import Foundation
import Cocoa
import WebKit
import IOKit
import IOKit.serial
import Darwin.POSIX.termios

@NSApplicationMain
class Application: NSViewController, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate, NSURLDownloadDelegate //, NSURLSessionDelegate
{
    //@IBOutlet weak var webView: WebView!
    var webView: WKWebView!
    var serial = String()
    var serialPath = [String]()
    var ip = "localhost"
    
    override func viewDidLoad()
    {
        super.viewDidLoad()
        NSApplication.sharedApplication().windows.first?.delegate = self
        
        //Create Preferences - How the web page should be loaded
        let preferences = WKPreferences()
        preferences.javaScriptEnabled = true
        
        //Create Configuration for our Preferences
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        
        //Instantiate webView
        webView = WKWebView(frame: view.bounds, configuration: configuration)
        webView.navigationDelegate = self
        view.addSubview(webView)
        
        self.performSelectorInBackground(#selector(startPHP), withObject:nil)
    }
    
    func windowDidResize(notification: NSNotification)
    {
        webView.frame = view.bounds
    }

    func download(download: NSURLDownload, decideDestinationWithSuggestedFilename filename: String)
    {
        let panel = NSSavePanel()
        panel.nameFieldStringValue = filename
        
        if (panel.runModal() == NSFileHandlingPanelCancelButton)
        {
            download.cancel()
        }
        else
        {
            download.setDestination(panel.URL!.path!, allowOverwrite: true)
        }
    }
    
    func webView(webView: WKWebView, decidePolicyForNavigationAction navigationAction: WKNavigationAction, decisionHandler: (WKNavigationActionPolicy) -> Void)
    {
        let url:NSURL = navigationAction.request.URL!
        //print(url)
        
        if (url == NSURL(string:"http://" + ip + ":8080/encoder.html"))
        {
            checkInkscape()
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":8080/upload.html"))
        {
            uploadSnapshot();
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":8080/download.php"))
        {
            //navigationAction.request.URL!.host
            //navigationAction.request.URL!.pathComponents
            
            _ = NSURLDownload(request: NSURLRequest(URL: url), delegate: self)
            /*
            let session = NSURLSession()
            let downloadTask = session.downloadTaskWithURL(url)
            downloadTask.resume()
            */
   
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else
        {
            decisionHandler(WKNavigationActionPolicy.Allow)
        }
    }
    
    func applicationShouldTerminateAfterLastWindowClosed(sender: NSApplication) -> Bool {
        return true
    }
    
    func applicationWillTerminate(notification: NSNotification)
    {
        system("pkill -9 php");
        //self.terminal.closeConnections();
    }
    
    func checkXQuartz()
    {
        let app: Bool = NSFileManager.defaultManager().fileExistsAtPath("/Applications/Utilities/XQuartz.app", isDirectory: nil)
        if (!app)
        {
            //dispatch_async(dispatch_get_main_queue()) {
                self.performSegueWithIdentifier("Download", sender:self)
                var userInfo = Dictionary<String, String>()
                userInfo["url"] = "https://dl.bintray.com/xquartz/downloads/XQuartz-2.7.9.dmg"
                userInfo["path"] = NSHomeDirectory() + "/Downloads/XQuartz-2.7.9.dmg"
                NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeXQUartzDownload), name:"completeDownload", object: nil)
            //}
        }else{
            openInskcapeEncoder()
        }
    }
    
    func checkInkscape()
    {
        let app: Bool = NSFileManager.defaultManager().fileExistsAtPath("/Applications/Inkscape.app", isDirectory: nil)
        if (!app)
        {
            let alert = NSAlert()
            //alert.alertStyle = NSAlertStyle.WarningAlertStyle
            alert.messageText = "Install Inkscape - Download 70MB"
            alert.informativeText = "Inkscape is an open-source vector editor."
            alert.addButtonWithTitle("OK")
            alert.addButtonWithTitle("Cancel")
            if (alert.runModal() == NSAlertFirstButtonReturn)
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.performSegueWithIdentifier("Download", sender:self)
                    var userInfo = Dictionary<String, String>()
                    userInfo["url"] = "https://inkscape.org/en/gallery/item/3896/Inkscape-0.91-1-x11-10.7-x86_64.dmg"
                    userInfo["path"] = NSHomeDirectory() + "/Downloads/Inkscape-0.91-1-x11-10.7-x86_64.dmg"
                    NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                    NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeInkscapeDownload), name:"completeDownload", object: nil)
                }
            }
        }else{
            
            let encoderPath = NSHomeDirectory() + "/.config/inkscape/extensions/encoder_disk_generator.py"
            
            if (!NSFileManager.defaultManager().fileExistsAtPath(encoderPath))
            {
                do {
                    try NSFileManager.defaultManager().copyItemAtPath(NSBundle.mainBundle().pathForResource("encoder_disk_generator", ofType:"py", inDirectory:"encoder")!, toPath:encoderPath)
                } catch let error as NSError {
                    print("Cannot copy file: \(error.localizedDescription)")
                }
            }
            checkXQuartz()
        }
    }
    
    func launchInstaller(script:String)
    {
        let task = NSTask()
        task.launchPath = NSBundle.mainBundle().pathForResource(script, ofType:nil)
        task.launch()
        task.waitUntilExit()
    }
    
    func openInskcapeEncoder()
    {
        let task = NSTask()
        task.launchPath = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape"
        task.arguments = ["--verb", "dgkelectronics.com.encoder.disk.generator"]
        task.launch()
    }
    
    func completeXQUartzDownload(notification: NSNotification)
    {
        if (notification.name == "completeDownload")
        {
            //self.performSelectorInBackground(#selector(launchInstaller), withObject:"xquartz")
            dispatch_async(dispatch_get_main_queue()) {
                self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/xquartz.html")!))
            }
            
            let task = NSTask()
            task.launchPath = "/usr/bin/hdiutil"
            task.arguments = ["attach", NSHomeDirectory() + "/Downloads/XQuartz-2.7.9.dmg"]
            task.launch()
            task.waitUntilExit()
 
            var output:String?
            var processErrorDescription:String?
            let installer: String = NSBundle.mainBundle().pathForResource("xquartz", ofType:nil)!
            let success: Bool = runProcessAsAdministrator(installer, output:&output, errorDescription:&processErrorDescription)
            if (!success)
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/xquartzError.html")!))
                }
            }
            else
            {
                print(output)
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/xquartzSuccess.html")!))
                }
                sleep(2)
                openInskcapeEncoder()
            }
        }
    }
    
    func completeInkscapeDownload(notification: NSNotification)
    {
        if (notification.name == "completeDownload")
        {
            self.performSelectorInBackground(#selector(launchInstaller), withObject:"inkscape")
            //openInskcapeEncoder()
        }
    }
    
    func startSerial()
    {
        var raw = Darwin.termios()
        
        let path = String.fromCString(serial)
        let fd = open(path!, (O_RDWR | O_NOCTTY | O_NDELAY))
        
        if (fd > 0)
        {
            tcgetattr( fd, &raw)            // merge flags into termios attributes
            //------------------
             var cflag:tcflag_t = 0
             cflag |= UInt(CS8)              // 8-bit
             cflag |= UInt(PARODD)           // parity
             cflag |= UInt(CSTOPB)           // stop 2
            raw.c_cflag &= ~( UInt(CSIZE) | UInt(PARENB) | UInt(PARODD) | UInt(CSTOPB))	// clear all bits and merge in our selection
            raw.c_cflag |= cflag            // set flags
            //------------------
            cfsetspeed(&raw, 115200)        // set speed
            //cfsetispeed(&raw, 115200)     // set input speed
            //cfsetospeed(&raw, 115200)     // set output
            tcsetattr( fd, TCSANOW, &raw)   // set termios
            
            sleep(2)
            dispatch_async(dispatch_get_main_queue()) {
                self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/index.html")!))
            }
        }else{
            
        }
        /*
        let opened = terminal.openConnections(serial, baudrate:115200, bits:8, parity:1, stopBits:2)
        if (opened == false)
        {
        }
        else
        {
        }
        */
    }
    
    func startPHP()
    {
        ip = "localhost"
        
        let fileManager = NSFileManager.defaultManager()
        let phpPath = "/usr/bin/php"
        
        if (!fileManager.fileExistsAtPath(phpPath) || !fileManager.fileExistsAtPath("/usr/local/lib/php/extensions/dio.so"))
        {
            dispatch_async(dispatch_get_main_queue()) {
                self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/php.html")!))
            }
            var output:String?
            var processErrorDescription:String?
            let installer: String = NSBundle.mainBundle().pathForResource("install", ofType:nil)!
            let success: Bool = runProcessAsAdministrator(installer, output:&output, errorDescription:&processErrorDescription)
            if (!success)
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/phpError.html")!))
                }
            }
            else
            {
                startPHP()
            }
        }else{
            
            //NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(phpDidTerminate), name:NSTaskDidTerminateNotification, object: nil)
            self.performSelectorInBackground(#selector(checkDrivers), withObject:nil)
       
            //TODO: check config.inc.php and correct serial /dev/cu.*
            
            var task = NSTask()
            task.launchPath = "/usr/bin/php"
            task.arguments = ["-S", "127.0.0.1:8080", "-t", NSBundle.mainBundle().resourcePath! + "/Web/"]
            task.launch()
        }
    }
    
    func checkDrivers()
    {
        var directory: ObjCBool = ObjCBool(false)
        let kext_Prolific: Bool = NSFileManager.defaultManager().fileExistsAtPath("/Library/Extensions/ProlificUsbSerial.kext", isDirectory: &directory)
        let kext_Serial: Bool = NSFileManager.defaultManager().fileExistsAtPath("/Library/Extensions/serial.kext", isDirectory: &directory)

        if(!kext_Prolific || kext_Serial)
        {
            sleep(1)
            dispatch_async(dispatch_get_main_queue()) {
                self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/loading.html")!))
            }
            
            var output:String?
            var processErrorDescription:String?
            let installer: String = NSBundle.mainBundle().pathForResource("driver", ofType:nil)!
            let success: Bool = runProcessAsAdministrator(installer, output:&output, errorDescription:&processErrorDescription)
            if (!success)
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/error.html")!))
                }
            }
            else
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/success.html")!))
                }
                sleep(2)
            }
        }
        
        checkConnect()
    }
    
    func checkConnect()
    {
        sleep(1)
        dispatch_async(dispatch_get_main_queue()) {
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/connect.html")!))
        }
        
        var found = false
        repeat {
            var portIterator: io_iterator_t = 0
            let kernResult = findSerialDevices(kIOSerialBSDAllTypes, serialPortIterator: &portIterator)
            if kernResult == KERN_SUCCESS {
                printSerialPaths(portIterator)
            }
            //print(serialPath.count)
            for i in 0...(serialPath.count-1)
            {
                print(serialPath[i])
                if (serialPath[i].rangeOfString("usbserial") != nil)
                {
                    dispatch_async(dispatch_get_main_queue()) {
                        self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":8080/driver/receive.html")!))
                    }
                    serial = serialPath[i]
                    startSerial()
                    found = true
                }
            }
            sleep(2)
        }while found != true
    }
    
    func phpDidTerminate(notification: NSNotification)
    {
        let alert = NSAlert()
        alert.alertStyle = NSAlertStyle.WarningAlertStyle
        alert.messageText = "PHP Server Quit"
        alert.informativeText = "Well this is unexpected ..check Firewall."
        alert.addButtonWithTitle("OK")
        alert.runModal()
    }
    
    func uploadSnapshot()
    {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.canCreateDirectories = false
        panel.canChooseFiles = true
    
        if (panel.runModal() == NSFileHandlingPanelOKButton)
        {
            let data  = NSData(contentsOfFile:panel.URL!.path!)
            
            let request = NSMutableURLRequest(URL: NSURL(string:"http://" + self.ip + ":8080/upload.php")!)
            request.HTTPMethod = "POST"
            request.HTTPBody = data
            
            let connection = NSURLConnection(request: request, delegate: self, startImmediately: true)
            connection!.start()
            
            /*
            let session = NSURLSession()
            let downloadTask = session.dataTaskWithRequest(request)
            downloadTask.resume()
            */
        }
    }

    func runProcessAsAdministrator(command: String, inout output: String?, inout errorDescription: String?) -> Bool
    {
        //command 2>&1
        var errorInfo:NSDictionary?
        let source = "do shell script \"\(command.stringByReplacingOccurrencesOfString(" ", withString: "\\\\ "))\" with administrator privileges"
        let script = NSAppleScript(source: source)
        let eventResult = script?.executeAndReturnError(&errorInfo)
        
        if (eventResult == nil)
        {
            errorDescription = nil
            if let code = errorInfo?.valueForKey(NSAppleScriptErrorNumber) as? NSNumber {
                if code.intValue == -128 {
                    errorDescription = "The administrator password is required to do this.";
                }
                
                if errorDescription == nil {
                    if let message = errorInfo?.valueForKey(NSAppleScriptErrorMessage) as? NSString {
                        errorDescription = String(message)
                        //print(errorDescription)
                    }
                }
            }
            return false
        } else {
            output = (eventResult?.stringValue)!
            return true
        }
    }
    
    @IBAction func checkUpdates(sender: AnyObject)
    {
        let data = NSData(contentsOfURL: NSURL(string: "http://github.com/poofik/huebner-inverter/raw/master/OSX/Info.plist")!)
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
    
    //================= C Wrapper ======================
    func printSerialPaths(portIterator: io_iterator_t) {
        var serialService: io_object_t
        repeat {
            serialService = IOIteratorNext(portIterator)
            if (serialService != 0) {
                let key: CFString! = "IOCalloutDevice"
                let bsdPathAsCFtring: AnyObject? =
                    IORegistryEntryCreateCFProperty(serialService, key, kCFAllocatorDefault, 0).takeUnretainedValue()
                let bsdPath = bsdPathAsCFtring as! String?
                if let path = bsdPath {
                    serialPath.append(path)
                    //print(path)
                }
            }
        } while serialService != 0;
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

