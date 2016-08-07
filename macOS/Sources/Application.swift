import Foundation
import Cocoa
import WebKit
import IOKit
import IOKit.serial
import Darwin.POSIX.termios

@NSApplicationMain
class Application: NSViewController, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate, NSURLDownloadDelegate , NSURLSessionDelegate,NSURLSessionDataDelegate
{
    //@IBOutlet weak var webView: WebView!
    var ip = "localhost"
    var port = "8080";
    var webView: WKWebView!
    var serial:CInt = -1
    var serialPath = String()
    var serialPathArray = [String]()
    var metadataSearch: NSMetadataQuery!
    var metadataQueryDidFinishGatheringObserver: AnyObject?
    
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
    
    //func download(download: NSURLDownload, decideDestinationWithSuggestedFilename filename: String)
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
    
    func URLSession(session: NSURLSession, dataTask: NSURLSessionDataTask, didReceiveResponse response: NSURLResponse, completionHandler: (NSURLSessionResponseDisposition) -> Void) {
        completionHandler(NSURLSessionResponseDisposition.Allow)
    }
    
    func webView(webView: WKWebView, decidePolicyForNavigationAction navigationAction: WKNavigationAction, decisionHandler: (WKNavigationActionPolicy) -> Void)
    {
        let url:NSURL = navigationAction.request.URL!
        //print(url)
        
        if (url == NSURL(string:"http://" + ip + ":" + port + "/encoder.php"))
        {
            checkInkscape()
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/upload.php"))
        {
            uploadSnapshot();
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/bootloader.php"))
        {
            checkOpenOCD()
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/attiny.php"))
        {
            checkATtiny()
            decisionHandler(WKNavigationActionPolicy.Cancel)

        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/firmware.php"))
        {
            flashFirmware()
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/compile.php"))
        {
            checkSource()
            decisionHandler(WKNavigationActionPolicy.Cancel)
            
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/gcc_remove.php"))
        {
            removeGCCARM()
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/schematics.php"))
        {
            checkEagle()
            decisionHandler(WKNavigationActionPolicy.Cancel)
        }
        else if (url == NSURL(string:"http://" + ip + ":" + port + "/download.php"))
        {
            //navigationAction.request.URL!.host
            //navigationAction.request.URL!.pathComponents
            
            _ = NSURLDownload(request: NSURLRequest(URL: url), delegate: self)
            
            /*
            let configuration = NSURLSessionConfiguration.defaultSessionConfiguration()
            let session = NSURLSession(configuration: configuration, delegate: self, delegateQueue: NSOperationQueue.mainQueue())
            let connection  = session.downloadTaskWithRequest(NSURLRequest(URL: url))
            connection.resume()
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
        closeSerial()
    }
    
    func initalGatherComplete(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        metadataSearch.disableUpdates() // You should invoke this method before iterating over query results that could change due to live updates.
        metadataSearch.stopQuery() // You would call this function to stop a query that is generating too many results to be useful but still want to access the available results.
        
        for item in metadataSearch.results as! [NSMetadataItem]
        {
            //let itemName = item.valueForAttribute(NSMetadataItemFSNameKey) as! String
            //let itemUrl = item.valueForAttribute(NSMetadataItemURLKey) as! NSURL
            print(item.valueForAttribute(NSMetadataItemURLKey))
            //print("result at " + String(i) + " - " + url)
        }
    }
    
    func downloadSource()
    {
        self.performSegueWithIdentifier("Download", sender:self)
        var userInfo = Dictionary<String, String>()
        userInfo["url"] = "http://johanneshuebner.com/quickcms/files/inverter.zip"
        userInfo["path"] = NSHomeDirectory() + "/Documents/inverter.zip"
        NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
    }
    
    func removeGCCARM()
    {
        let gcc_arm = "/usr/local/gcc_arm"
        let alert = NSAlert()
        alert.messageText = "Remove GCC 5.3 ARM Compiler?"
        alert.informativeText = "This will clean up over 500MB of space!\n" + gcc_arm
        alert.addButtonWithTitle("OK")
        alert.addButtonWithTitle("Cancel")
        if (alert.runModal() == NSAlertFirstButtonReturn)
        {
            do {
                try NSFileManager.defaultManager().removeItemAtPath(gcc_arm)
            }
            catch let error as NSError {
                print("Error: \(error)")
            }
            
            removeGCCAVR()

            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/index.php")!))
        }
    }
    
    func removeGCCAVR()
    {
        let gcc_avr = "/usr/local/CrossPack-AVR-20131216"
     
        do {
                try NSFileManager.defaultManager().removeItemAtPath(gcc_avr)
        }
        catch let error as NSError {
                print("Error: \(error)")
        }
    }
    
    func checkSource()
    {
        if (!NSFileManager.defaultManager().fileExistsAtPath("/Applications/Xcode.app"))
        {
            let alert = NSAlert()
            alert.messageText = "XCode is Not Found"
            alert.informativeText = "http://developer.apple.com/xcode"
            alert.addButtonWithTitle("OK")
            alert.runModal()
            
        }else{
            if (!NSFileManager.defaultManager().fileExistsAtPath(NSHomeDirectory() + "/Documents/firmware"))
            {
                downloadSource()
                NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeSourceDownload), name:"completeDownload", object: nil)
            }else{
                if (!NSFileManager.defaultManager().fileExistsAtPath("/usr/local/gcc_arm/gcc-arm-none-eabi-5_3-2016q1"))
                {
                    let alert = NSAlert()
                    alert.messageText = "Install GCC 5.3 ARM Compiler - Download 100MB"
                    alert.informativeText = "arm-none-eabi-gcc"
                    alert.addButtonWithTitle("OK")
                    alert.addButtonWithTitle("Cancel")
                    if (alert.runModal() == NSAlertFirstButtonReturn)
                    {
                        self.performSegueWithIdentifier("Download", sender:self)
                        var userInfo = Dictionary<String, String>()
                        userInfo["url"] = "https://launchpad.net/gcc-arm-embedded/5.0/5-2016-q1-update/+download/gcc-arm-none-eabi-5_3-2016q1-20160330-mac.tar.bz2"
                        userInfo["path"] = NSHomeDirectory() + "/Downloads/gcc-arm-none-eabi-5_3-2016q1-20160330-mac.tar.bz2"
                        NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeGCCDownload), name:"completeDownload", object: nil)
                    }
                }else{
                    system("open -a Terminal \"" + NSBundle.mainBundle().pathForResource("make", ofType:nil)! + "\"")
                }
            }
        }
    }
    
    func checkATtiny()
    {
        if (!NSFileManager.defaultManager().fileExistsAtPath(NSHomeDirectory() + "/Documents/firmware"))
        {
            downloadSource()
            NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeSourceDownload), name:"completeDownload", object: nil)
        }else{
            if (!NSFileManager.defaultManager().fileExistsAtPath("/usr/local/CrossPack-AVR/bin/avr-gcc"))
            {
                let alert = NSAlert()
                alert.messageText = "Install CrossPack-AVR Compiler - Download 42MB"
                alert.informativeText = "avr-gcc"
                alert.addButtonWithTitle("OK")
                alert.addButtonWithTitle("Cancel")
                if (alert.runModal() == NSAlertFirstButtonReturn)
                {
                    self.performSegueWithIdentifier("Download", sender:self)
                    var userInfo = Dictionary<String, String>()
                    userInfo["url"] = "https://www.obdev.at/downloads/crosspack/CrossPack-AVR-20131216.dmg"
                    userInfo["path"] = NSHomeDirectory() + "/Downloads/CrossPack-AVR-20131216.dmg"
                    NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                    NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeATtinyDownload), name:"completeDownload", object: nil)
                }
            }else{
                flashATtiny()
            }
        }
    }
    
    func checkOpenOCD()
    {
        if (!NSFileManager.defaultManager().fileExistsAtPath(NSHomeDirectory() + "/Documents/firmware"))
        {
            downloadSource()
            NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeSourceDownload), name:"completeDownload", object: nil)
        }else{
            if (!NSFileManager.defaultManager().fileExistsAtPath("/usr/local/gcc_arm/gcc-arm-none-eabi-5_3-2016q1"))
            {
                let alert = NSAlert()
                    alert.messageText = "Install OpenoCD Debugger - Download 2.5MB"
                    alert.informativeText = "openocd"
                    alert.addButtonWithTitle("OK")
                    alert.addButtonWithTitle("Cancel")
                    if (alert.runModal() == NSAlertFirstButtonReturn)
                    {
                        self.performSegueWithIdentifier("Download", sender:self)
                        var userInfo = Dictionary<String, String>()
                        userInfo["url"] = "https://github.com/gnuarmeclipse/openocd/releases/download/gae-0.10.0-20160110/gnuarmeclipse-openocd-osx-0.10.0-201601101000-dev.pkg"
                        userInfo["path"] = NSHomeDirectory() + "/Downloads/gnuarmeclipse-openocd-osx-0.10.0-201601101000-dev.pkg"
                        NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeOpenOCDDownload), name:"completeDownload", object: nil)
                }
            }else{
                flashBootloader()
            }
        }
    }

    
    func checkSchematics()
    {
        /*
        metadataSearch = NSMetadataQuery()
        metadataSearch.searchScopes = [NSMetadataQueryLocalComputerScope] //[NSMetadataQueryUserHomeScope]
        let predicate = NSPredicate(format: "%K == 'base_board4.sch'", NSMetadataItemFSNameKey)
        metadataSearch.predicate = predicate
        metadataSearch.startQuery()
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.initalGatherComplete), name:NSMetadataQueryDidFinishGatheringNotification, object:metadataSearch)
        */
        
        if (!NSFileManager.defaultManager().fileExistsAtPath(NSHomeDirectory() + "/Documents/pcb/base_board4.sch"))
        {
            downloadSource()
            NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeSchematicsDownload), name:"completeDownload", object: nil)
        }else{
            system("open " + NSHomeDirectory() + "/Documents/pcb/")
        }
    }
    
    func checkEagle()
    {
        if (!NSFileManager.defaultManager().fileExistsAtPath("/Applications/EAGLE-7.6.0/Eagle.app"))
        {
            let alert = NSAlert()
            alert.messageText = "Install EAGLE - Download 50MB"
            alert.informativeText = "CadSoft EAGLE PCB Design Software."
            alert.addButtonWithTitle("OK")
            alert.addButtonWithTitle("Cancel")
            if (alert.runModal() == NSAlertFirstButtonReturn)
            {
                self.performSegueWithIdentifier("Download", sender:self)
                var userInfo = Dictionary<String, String>()
                userInfo["url"] = "http://web.cadsoft.de/ftp/eagle/program/7.6/eagle-mac64-7.6.0.zip"
                userInfo["path"] = NSHomeDirectory() + "/Downloads/eagle-mac64-7.6.0.zip"
                NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeEagleDownload), name:"completeDownload", object: nil)
            }
        }else{
            checkSchematics()
        }
    }
    
    func checkXQuartz()
    {
        if (!NSFileManager.defaultManager().fileExistsAtPath("/Applications/Utilities/XQuartz.app"))
        {
            self.performSegueWithIdentifier("Download", sender:self)
            var userInfo = Dictionary<String, String>()
            userInfo["url"] = "https://dl.bintray.com/xquartz/downloads/XQuartz-2.7.9.dmg"
            userInfo["path"] = NSHomeDirectory() + "/Downloads/XQuartz-2.7.9.dmg"
            NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
            NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeXQUartzDownload), name:"completeDownload", object: nil)
        }else{
            openInskcapeEncoder()
        }
    }
    
    func checkInkscape()
    {
        if (!NSFileManager.defaultManager().fileExistsAtPath("/Applications/Inkscape.app"))
        {
            let alert = NSAlert()
            alert.messageText = "Install Inkscape - Download 70MB"
            alert.informativeText = "Inkscape is a Vector Graphics Software."
            alert.addButtonWithTitle("OK")
            alert.addButtonWithTitle("Cancel")
            if (alert.runModal() == NSAlertFirstButtonReturn)
            {
                self.performSegueWithIdentifier("Download", sender:self)
                var userInfo = Dictionary<String, String>()
                userInfo["url"] = "https://inkscape.org/en/gallery/item/3896/Inkscape-0.91-1-x11-10.7-x86_64.dmg"
                userInfo["path"] = NSHomeDirectory() + "/Downloads/Inkscape-0.91-1-x11-10.7-x86_64.dmg"
                NSNotificationCenter.defaultCenter().postNotificationName("startDownload", object:nil, userInfo:userInfo);
                NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(self.completeInkscapeDownload), name:"completeDownload", object: nil)
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
    
    func launchInstaller(script:String) -> Bool
    {
        let task = NSTask()
        task.launchPath = NSBundle.mainBundle().pathForResource(script, ofType:nil)
        task.launch()
        task.waitUntilExit()
        
        return true;
    }
    
    func openInskcapeEncoder()
    {
        let task = NSTask()
        task.launchPath = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape"
        task.arguments = ["--verb", "dgkelectronics.com.encoder.disk.generator"]
        task.launch()
    }
    
    func completeEagleDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        
        self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/driver/eagle.html")!))
        sleep(4)
        
        var output:String?
        var processErrorDescription:String?
        let installer: String = NSBundle.mainBundle().pathForResource("eagle", ofType:nil)!
        let success: Bool = runProcessAsAdministrator(installer, output:&output, errorDescription:&processErrorDescription)
        if (!success)
        {
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/driver/eagleError.html")!))
        }
        else
        {
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/driver/eagleSuccess.html")!))
            
            checkSchematics()
        }
    }
    
    func completeOpenOCDDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        
        launchInstaller("openocd")
        
        flashBootloader()
    }
    
    func completeATtinyDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        
        launchInstaller("attiny")
        
        flashATtiny()
    }
    
    func completeGCCDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        
        system("mkdir /usr/local/gcc_arm")
        let task = NSTask()
        task.launchPath = "/usr/bin/tar"
        task.arguments = ["xzf", NSHomeDirectory() + "/Downloads/gcc-arm-none-eabi-5_3-2016q1-20160330-mac.tar.bz2", "-C", "/usr/local/gcc_arm/"]
        task.launch()
        task.waitUntilExit()
        
        checkSource()
    }
    
    func completeSourceDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        system("tar xzf " + NSHomeDirectory() + "/Documents/inverter.zip -C " + NSHomeDirectory() + "/Documents/")
        checkSource()
    }
    
    func completeSchematicsDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        system("tar xzf " + NSHomeDirectory() + "/Documents/inverter.zip -C " + NSHomeDirectory() + "/Documents/")
        checkSchematics()
    }
    
    func completeXQUartzDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        
        self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/driver/xquartz.html")!))
        sleep(2)
        
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
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/driver/xquartzError.html")!))
        }
        else
        {
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + port + "/driver/xquartzSuccess.html")!))

            openInskcapeEncoder()
        }
    }
    
    func completeInkscapeDownload(notification: NSNotification)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        self.performSelectorInBackground(#selector(launchInstaller), withObject:"inkscape")
        //openInskcapeEncoder()
    }
    
    func flashATtiny()
    {
        system("open -a Terminal \"" + NSBundle.mainBundle().pathForResource("attiny", ofType:nil)! + "\"")
    }
    
    func flashBootloader()
    {
        /*
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.canCreateDirectories = false
        panel.canChooseFiles = true
        panel.allowedFileTypes = ["bin"]
        
        if (panel.runModal() == NSFileHandlingPanelOKButton)
        {
            let fileAttributes = try! NSFileManager.defaultManager().attributesOfItemAtPath(panel.URL!.path!)
            let fileSizeNumber = fileAttributes[NSFileSize] as! NSNumber
            let fileSize = fileSizeNumber.longLongValue
            
            if(fileSize < 20000)
            {
                system("echo '\"" + NSBundle.mainBundle().pathForResource("openocd", ofType:nil)! + "\" \"" + panel.URL!.path! + "\"' > /tmp/bootloader.sh; chmod +x /tmp/bootloader.sh; open -a Terminal /tmp/bootloader")
            }
        }
        */
        system("open -a Terminal \"" + NSBundle.mainBundle().pathForResource("openocd", ofType:nil)! + "\"")
        
        NSTimer.scheduledTimerWithTimeInterval(4.0, target: self, selector: #selector(webViewRefresh), userInfo: nil, repeats: false)
    }
    
    func flashFirmware()
    {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = false
        panel.canChooseDirectories = false
        panel.canCreateDirectories = false
        panel.canChooseFiles = true
        panel.allowedFileTypes = ["bin"]
        
        if (panel.runModal() == NSFileHandlingPanelOKButton)
        {
            let fileAttributes = try! NSFileManager.defaultManager().attributesOfItemAtPath(panel.URL!.path!)
            let fileSizeNumber = fileAttributes[NSFileSize] as! NSNumber
            let fileSize = fileSizeNumber.longLongValue
            
            if(fileSize > 20000)
            {
                //system("open -b com.apple.terminal --args \"" + NSBundle.mainBundle().pathForResource("updater", ofType:nil)! + "\" \"" + panel.URL!.path! + "\" " + serialPath)
                system("echo '\"" + NSBundle.mainBundle().pathForResource("updater", ofType:nil)! + "\" \"" + panel.URL!.path! + "\" " + serialPath + "' > /tmp/updater.sh; chmod +x /tmp/updater.sh; open -a Terminal /tmp/updater.sh") //; rm /tmp/updater.sh
                
                NSTimer.scheduledTimerWithTimeInterval(4.0, target: self, selector: #selector(webViewRefresh), userInfo: nil, repeats: false)
            }else{
                let alert = NSAlert()
                alert.alertStyle = NSAlertStyle.WarningAlertStyle
                alert.messageText = "Brick Alert"
                alert.informativeText = "Careful! You may brick your microcontroller - DO NOT pick Bootloader. This is Firmware Flash."
                alert.addButtonWithTitle("OK")
                alert.runModal()
            }
            
            /*
            let data  = NSData(contentsOfFile:panel.URL!.path!)!
            
            openSerial()
            
            let len = data.length
            var pages:Int = (len + 1024 - 1) / 1024;
            print("File length is %d bytes/%d pages\n", len, pages);
            //-----------------------------
            print("Resetting device...\n");
            write(serial, "reset\r", 6);
            var recv_char:Character = "-"
            while ("S" != recv_char){ //Wait for size request
                read(serial, &recv_char, 1)
            }
            //-----------------------------
            print("Sending number of pages...\n");
            write(serial, &pages, 1);
            while ("P" != recv_char){ //Wait for page request
                read(serial, &recv_char, 1)
            }
            */
            /*
            var page = 0
            var done = false
            repeat
            {
            print("Sending page %d... ", page);
            write(fd, rst_cmd, rst_cmd.count);
                //send_string(uart, (uint8_t*)&data[PAGE_SIZE_WORDS * page], PAGE_SIZE_BYTES);
            } while done != true
            */
        }
    }
    
    func webViewRefresh() {
        webView.reload();
    }
    
    func startSerial()
    {
        openSerial()
        
        sleep(2)
        dispatch_async(dispatch_get_main_queue()) {
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + self.port + "/index.php")!))
        }
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
            //raw.c_cflag &= ~UInt(CRTSCTS);  // no flow control
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
    
    func startPHP()
    {
        ip = "localhost"
        
        let fileManager = NSFileManager.defaultManager()
        let phpPath = "/usr/bin/php"
        let iniPath = "/usr/local/etc/php.ini"
        let dioPath = NSBundle.mainBundle().pathForResource("dio", ofType: nil)
        var wrongPath = true
        
        do {
            let data = try String(contentsOfURL: NSURL(fileURLWithPath:iniPath), encoding: NSUTF8StringEncoding)
            if data.rangeOfString(dioPath!) != nil{
                wrongPath = false
            }
        }
        catch {}
      
        if (!fileManager.fileExistsAtPath(phpPath) || wrongPath == true)
        {
            dispatch_async(dispatch_get_main_queue()) {
                self.webView.loadRequest(NSURLRequest(URL: NSURL.fileURLWithPath(NSBundle.mainBundle().pathForResource("Web/driver/php", ofType:"html")!)))
            }
            
            launchInstaller("php")
            
            sleep(2)
            
            startPHP()
            
        }else{
            
            //NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(phpDidTerminate), name:NSTaskDidTerminateNotification, object: nil)
            self.performSelectorInBackground(#selector(checkDrivers), withObject:nil)
            
            //TODO: check config.inc.php and correct serial /dev/cu.*
            
            system("pkill -9 php");
            
            let task = NSTask()
            task.launchPath = "/usr/bin/php"
            task.arguments = ["-S", "127.0.0.1:" + port, "-t", NSBundle.mainBundle().resourcePath! + "/Web/" ,"-c", "/usr/local/etc/php.ini"]
            task.launch()
        }
    }
    
    func checkPHPConfig()
    {
        let config_inc =  NSBundle.mainBundle().pathForResource("Web/config", ofType:"inc")
        let config_inc_php =  NSBundle.mainBundle().pathForResource("Web/config.inc", ofType:"php")
        
        do {
            var data = try String(contentsOfURL: NSURL(fileURLWithPath:config_inc_php!), encoding: NSUTF8StringEncoding)
            if data.rangeOfString(serialPath) == nil
            {
                data = try String(contentsOfURL: NSURL(fileURLWithPath:config_inc!), encoding: NSUTF8StringEncoding)
                data = data.stringByReplacingOccurrencesOfString("/dev/cu.usbserial", withString:serialPath)
                    
                try data.writeToURL(NSURL(fileURLWithPath:config_inc_php!), atomically: false, encoding: NSUTF8StringEncoding)
            }
        } catch {}
    }
    
    func checkDrivers()
    {
        let fileManager = NSFileManager.defaultManager()
        let kext_Prolific: Bool = fileManager.fileExistsAtPath("/Library/Extensions/ProlificUsbSerial.kext")
        let kext_Serial: Bool = fileManager.fileExistsAtPath("/Library/Extensions/serial.kext")
        
        if(!kext_Prolific || kext_Serial)
        {
            sleep(1)
            dispatch_async(dispatch_get_main_queue()) {
                self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + self.port + "/driver/loading.html")!))
            }
            
            var output:String?
            var processErrorDescription:String?
            let installer: String = NSBundle.mainBundle().pathForResource("driver", ofType:nil)!
            let success: Bool = runProcessAsAdministrator(installer, output:&output, errorDescription:&processErrorDescription)
            if (!success)
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + self.port + "/driver/error.html")!))
                }
            }
            else
            {
                dispatch_async(dispatch_get_main_queue()) {
                    self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + self.port + "/driver/success.html")!))
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
            self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + self.port + "/driver/connect.html")!))
        }
        
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
                    //NSBundle.mainBundle().pathForResource("Web/config.inc", ofType:"php")!
                    
                    dispatch_async(dispatch_get_main_queue()) {
                        self.webView.loadRequest(NSURLRequest(URL: NSURL(string: "http://" + self.ip + ":" + self.port + "/driver/receive.html")!))
                    }
                    serialPath = serialPathArray[i]
                    
                    checkPHPConfig()
                    
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
            let data = NSData(contentsOfFile:panel.URL!.path!)
            
            let request = NSMutableURLRequest(URL: NSURL(string:"http://" + self.ip + ":" + self.port + "/upload.php")!)
            request.HTTPMethod = "POST"
            request.setValue("Keep-Alive", forHTTPHeaderField: "Connection")
            
            let configuration = NSURLSessionConfiguration.defaultSessionConfiguration()
            let session = NSURLSession(configuration: configuration, delegate: self, delegateQueue: NSOperationQueue.mainQueue())

            let connection  = session.uploadTaskWithRequest(request, fromData: data!)
            connection.resume()
            
            /*
             let session = NSURLSession()
             let downloadTask = session.dataTaskWithRequest(request)
             downloadTask.resume()
             */
        }
    }
    
    func runProcessAsAdministrator(command: String, inout output: String?, inout errorDescription: String?) -> Bool
    {
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