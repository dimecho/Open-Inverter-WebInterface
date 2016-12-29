import Foundation
import Cocoa
import IOKit
import IOKit.serial
import Darwin.POSIX.termios

@NSApplicationMain
class Application: NSViewController, NSApplicationDelegate
{
    var serial:CInt = -1
    var serialPath = String()
    var serialPathArray = [String]()
    
    func applicationDidFinishLaunching(_ aNotification: Notification)
    {
        self.performSelector(inBackground: #selector(checkConnect), with:nil)
        
        let task = Process()
        task.launchPath = Bundle.main.path(forResource: "run", ofType:nil)
        task.launch()
        //task.waitUntilExit()
        //system("open -a Terminal \"" + NSBundle.mainBundle().pathForResource("run", ofType:nil)! + "\"")
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool
    {
        return true
    }
    
    func applicationWillTerminate(_ notification: Notification)
    {
        let task = Process()
        task.launchPath = "pkill"
        task.arguments =  ["-9" , "php"]
        task.launch()
    }
    
    func checkConnect()
    {
        var found = false
        repeat {
            var portIterator: io_iterator_t = 0
            let kernResult = findSerialDevices(kIOSerialBSDAllTypes, serialPortIterator: &portIterator)
            if kernResult == KERN_SUCCESS {
                printSerialPath(portIterator)
            }
            
            for i in 0...(serialPathArray.count-1)
            {
                //print(serialPathArray[i])
                
                if (serialPathArray[i].uppercased().range(of: "USB") != nil)
                {
                    serialPath = serialPathArray[i]
                    openSerial()
                    found = true
                }
            }
            sleep(4)
        }while found != true
    }
    
    func openSerial()
    {
        if(serial != -1){
            return
        }
        
        var raw = Darwin.termios()
        let path = String(serialPath)
        let fd = open(path!, (O_RDWR | O_NOCTTY | O_NDELAY))
        
        if (fd > 0)
        {
            let CRTSCTS = 020000000000 /* flow control */
            
            //fcntl(fd, F_SETFL, 0);
            tcgetattr( fd, &raw)          // merge flags into termios attributes
            //------------------
            //cfsetspeed(&raw, 115200)    // set speed
            cfsetispeed(&raw, 115200)     // set input speed
            cfsetospeed(&raw, 115200)     // set output
            //------------------
            var cflag:tcflag_t = 0
            cflag |= UInt(CS8)            // 8-bit
            //cflag |= UInt(PARODD)       // parity
            cflag |= UInt(CSTOPB)         // stop 2
            
            raw.c_cflag &= ~( UInt(CSIZE) | UInt(PARENB) | UInt(PARODD) | UInt(CSTOPB))	// clear all bits and merge in our selection
            raw.c_cflag &= ~(UInt(IXON) | UInt(IXOFF) | UInt(IXANY)) // shut off xon/xoff ctrl
            raw.c_cflag &= ~(UInt(PARENB) | UInt(PARODD));      // shut off parity
            raw.c_cflag &= ~UInt(CRTSCTS);  // no flow control
            raw.c_cflag |= cflag            // set flags
            //------------------
            if (tcsetattr (fd, TCSANOW, &raw) != 0) // set termios
            {
                print("error from tcsetattr");
            }else{
                serial = fd
            }
        }
    }
    
    func closeSerial()
    {
        if(serial != -1){
            close(serial) ;
            serial = -1 ;
        }
    }
    //================= C Wrapper ======================
    func printSerialPath(_ portIterator: io_iterator_t) {
        var serialService: io_object_t
        repeat {
            serialService = IOIteratorNext(portIterator)
            if (serialService != 0) {
                let key: CFString! = "IOCalloutDevice" as CFString!
                let bsdPathAsCFtring: AnyObject? =
                    IORegistryEntryCreateCFProperty(serialService, key, kCFAllocatorDefault, 0).takeUnretainedValue()
                let bsdPath = bsdPathAsCFtring as! String?
                if let path = bsdPath {
                    serialPathArray.append(path)
                    //print(path)
                }
            }
        } while serialService != 0
    }
    func findSerialDevices(_ deviceType: String, serialPortIterator: inout io_iterator_t ) -> kern_return_t {
        var result: kern_return_t = KERN_FAILURE
        let classesToMatch = IOServiceMatching(kIOSerialBSDServiceValue)//.takeUnretainedValue()
        var classesToMatchDict = (classesToMatch! as NSDictionary) as! Dictionary<String, AnyObject>
        classesToMatchDict[kIOSerialBSDTypeKey] = deviceType as AnyObject?
        let classesToMatchCFDictRef = (classesToMatchDict as NSDictionary) as CFDictionary
        result = IOServiceGetMatchingServices(kIOMasterPortDefault, classesToMatchCFDictRef, &serialPortIterator);
        return result
    }
    //=================================================
}
