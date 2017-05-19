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
		
		closeSerial()
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
		//Close old connection (if app was closed not properly)
		//let defaults:UserDefaults = UserDefaults.standard
		//serial = defaults.value(forKey: "serial") as? CInt ?? -1
		
		if(serial != -1){
			return
		}
		
		closeSerial()
		
        var raw = Darwin.termios()
        let path = String(serialPath)
		let fd = open(path!, O_RDWR | O_NOCTTY | O_NDELAY ) //| O_NONBLOCK
		/*
		- The O_NOCTTY flag tells UNIX that this program doesn't want to be the "controlling terminal" for that port. If you don't specify this then any input (such as keyboard abort signals and so forth) will affect your process. Programs like getty(1M/8) use this feature when starting the login process, but normally a user program does not want this behavior.
		
		- The O_NDELAY flag tells UNIX that this program doesn't care what state the DCD signal line is in - whether the other end of the port is up and running. If you do not specify this flag, your process will be put to sleep until the DCD signal line is the space voltage.
		
		- In non-blocking mode, VMIN/VTIME have no effect (FNDELAY / O_NDELAY seem to be linux variants of O_NONBLOCK, the portable, POSIX flag).
		*/
        if (fd > 0)
        {
			//fcntl(fd, F_SETFL, 0);	// passing F_SETFL to clear the O_NONBLOCK flag so subsequent I/O will block.
			tcgetattr(fd, &raw)         // merge flags into termios attributes
			//------------------
			//cfmakeraw(&raw);
			//raw.c_cc.16 = 1 //raw.c_cc[VMIN] = 1
			//raw.c_cc[VTIME] = 10
			//------------------
			//cfsetspeed(&raw, 115200)    // set speed
			cfsetispeed(&raw, speed_t(B115200))     // set input speed
			cfsetospeed(&raw, speed_t(B115200))     // set output speed
			//------------------
			
			//let CRTSCTS = 020000000000 // flow control
			//let CMSPAR = 0o10000000000 // "stick" (mark/space) parity
			
			var cflag:tcflag_t = 0
            cflag |= UInt(CS8)            // 8-bit
            cflag |= UInt(CSTOPB)         // stop 2
			//cflag |= (UInt(CLOCAL) | UInt(CREAD)) //set up raw mode / no echo / binary
			
			raw.c_cflag &= ~(UInt(FNDELAY))		// clear fcntl, otherwise VMIN/VTIME are ignored
			//raw.c_cflag &= ~(UInt(CRTSCTS))	// clear rtscts
            raw.c_cflag &= ~(UInt(CSIZE))		// clear all bits
            raw.c_cflag &= ~(UInt(IXON) | UInt(IXOFF) | UInt(IXANY))		// shut off xon/xoff ctrl
			raw.c_cflag &= ~(UInt(PARENB) | UInt(PARODD)); // | UInt(CMSPAR));	// shut off parity
            raw.c_cflag |= cflag				// set flags
			
            //------------------
            if (tcsetattr (fd, TCSANOW, &raw) != 0) // set termios
            {
                print("error from tcsetattr");
            }else{
                serial = fd
				//defaults.set(serial, forKey: "serial")
				//defaults.synchronize()
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
