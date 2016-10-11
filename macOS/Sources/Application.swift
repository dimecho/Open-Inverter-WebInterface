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
    
    func applicationDidFinishLaunching(aNotification: NSNotification)
    {
        self.performSelectorInBackground(#selector(checkConnect), withObject:nil)
        
        let task = NSTask()
        task.launchPath = NSBundle.mainBundle().pathForResource("run", ofType:nil)
        task.launch()
        //task.waitUntilExit()
        //system("open -a Terminal \"" + NSBundle.mainBundle().pathForResource("run", ofType:nil)! + "\"")
    }

    func applicationShouldTerminateAfterLastWindowClosed(sender: NSApplication) -> Bool
    {
        return true
    }
    
    func applicationWillTerminate(notification: NSNotification)
    {
        system("pkill -9 php");
    }
    
    @IBAction func checkUpdates(sender: AnyObject)
    {
        let data = NSData(contentsOfURL: NSURL(string: "http://github.com/poofik/huebner-inverter/raw/master/macOS/Info.plist")!)
        let plist = (try! NSPropertyListSerialization.propertyListWithData(data!, options: NSPropertyListMutabilityOptions.MutableContainersAndLeaves, format: nil)) as! NSMutableDictionary
        let onlineVersion = plist.valueForKey("CFBundleShortVersionString") as? String
        let currentVersion = NSBundle.mainBundle().infoDictionary!["CFBundleShortVersionString"] as? String
        let onlineBuild = plist.valueForKey("CFBundleVersion") as? String
        let currentBuild = NSBundle.mainBundle().infoDictionary!["CFBundleVersion"] as? String
        let alert = NSAlert()
        
        if(Double(onlineVersion!)! == Double(currentVersion!)! && Int(onlineBuild!)! == Int(currentBuild!)!)
        {
            alert.messageText = "Version " + onlineVersion! + " Build " + currentBuild!
            alert.informativeText = "You already have the latest and greatest"
            alert.addButtonWithTitle("OK")
            alert.runModal()
        }else{
            alert.messageText = "New Version " + onlineVersion! + " Build " + onlineBuild! + " is Available"
            alert.informativeText = "Go to GitHub to Download?"
            alert.addButtonWithTitle("OK")
            alert.addButtonWithTitle("Cancel")
            if (alert.runModal() == NSAlertFirstButtonReturn)
            {
                let github = "https://github.com/poofik/Huebner-Inverter/releases"
                if NSFileManager.defaultManager().fileExistsAtPath("/Applications/FireFox.app")
                {
                    system("open -a Firefox '" + github + "'")
                }else{
                    NSWorkspace.sharedWorkspace().openURL(NSURL(string:github)!)
                }
            }
        }
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
                print(serialPathArray[i])
                
                if (serialPathArray[i].uppercaseString.rangeOfString("USB") != nil)
                {
                    serialPath = serialPathArray[i]
                    openSerial()
                    found = true
                }
            }
            sleep(2)
        }while found != true
    }
    
    func openSerial()
    {
        if(serial != -1){
            return
        }
        
        var raw = Darwin.termios()
        let path = String.fromCString(serialPath)
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
    func printSerialPath(portIterator: io_iterator_t) {
        var serialService: io_object_t
        repeat {
            serialService = IOIteratorNext(portIterator)
            if (serialService != 0) {
                let key: CFString! = "IOCalloutDevice"
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
    func findSerialDevices(deviceType: String, inout serialPortIterator: io_iterator_t ) -> kern_return_t {
        var result: kern_return_t = KERN_FAILURE
        let classesToMatch = IOServiceMatching(kIOSerialBSDServiceValue)//.takeUnretainedValue()
        var classesToMatchDict = (classesToMatch as NSDictionary) as! Dictionary<String, AnyObject>
        classesToMatchDict[kIOSerialBSDTypeKey] = deviceType
        let classesToMatchCFDictRef = (classesToMatchDict as NSDictionary) as CFDictionaryRef
        result = IOServiceGetMatchingServices(kIOMasterPortDefault, classesToMatchCFDictRef, &serialPortIterator);
        return result
    }
    //=================================================
}