import Cocoa

class Download: NSViewController, NSURLDownloadDelegate //NSURLSessionDelegate
{
    var bytesReceived:Int64 = 0
    var expectedContentLength:Int64 = 0
    
    @IBOutlet weak var file: NSTextField!
    @IBOutlet weak var progress: NSTextField!
    @IBOutlet weak var progressBar: NSProgressIndicator!

    override func viewDidLoad() {
        super.viewDidLoad()
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(startDownload), name:"startDownload", object: nil)
    }
    
    func startDownload(notification: NSNotification)
    {
        if (notification.name == "startDownload")
        {
            print(notification.userInfo!["url"] as! String)
            self.file.stringValue = notification.userInfo!["path"] as! String
            print(self.file.stringValue)
    
            let download:NSURLDownload = NSURLDownload(request: NSURLRequest(URL: NSURL(string: notification.userInfo!["url"] as! String)!), delegate: self)
            download.setDestination(notification.userInfo!["path"] as! String, allowOverwrite:true)
            download.deletesFileUponFailure = true //Allow for Resume
            
            /*
             let session = NSURLSession()
             let downloadTask = session.downloadTaskWithURL(url)
             downloadTask.resume()
             */
        }
    }
    
    func download(download: NSURLDownload, didFailWithError error:NSError)
    {
        print("Download failed! Error - %@ %@" + error.localizedDescription) // + " - " + error.userInfo!.objectForKey:NSURLErrorFailingURLStringErrorKey);
    }
    
    func downloadDidFinish(download:NSURLDownload)
    {
        self.progress.stringValue = "Download Complete"
        
        //let userInfo:NSDictionary = ["url":file.stringValue]
        NSNotificationCenter.defaultCenter().postNotificationName("completeDownload", object:nil) //userInfo: [NSObject():userInfo]);
    
        self.dismissController(self)
    }
    
    func download(download:NSURLDownload, didReceiveResponse response:NSURLResponse)
    {
        expectedContentLength = response.expectedContentLength
        let responseHeaders:NSDictionary  = (response as! NSHTTPURLResponse).allHeaderFields
        let actualContentLength:String = responseHeaders["Content-Length"] as! String
    
        print(actualContentLength)
    
        if(Int(actualContentLength) > 0){
            expectedContentLength = Int64(actualContentLength)!
        }
    
        if (NSFileManager.defaultManager().fileExistsAtPath(self.file.stringValue))
        {
            var fileSize : UInt64 = 0
            do {
                let attr:NSDictionary? = try NSFileManager.defaultManager().attributesOfItemAtPath(file.stringValue)
                
                if let _attr = attr {
                    fileSize = _attr.fileSize();
                }
            } catch {
                print("Error: \(error)")
            }
            
            if(Int64(fileSize) == expectedContentLength)
            {
                download.cancel()
                self.downloadDidFinish(download)
            }
        }
    }
    
    func download(download:NSURLDownload, didReceiveDataOfLength length:Int)
    {
        
        bytesReceived = bytesReceived + length;
        
        let percent: Double = (Double(bytesReceived) / Double(expectedContentLength) )*100.0
        
        progressBar.doubleValue = percent
        progress.stringValue = String(bytesReceived/1024/1024) + " of " + String(expectedContentLength/1024/1024) + "MB Downloaded"
    }
    
    @IBAction func dismiss(sender: AnyObject)
    {
        NSNotificationCenter.defaultCenter().removeObserver(self)
        self.dismissController(self)
    }
    
}