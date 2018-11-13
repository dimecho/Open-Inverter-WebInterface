import Foundation
import Cocoa
import IOKit

@NSApplicationMain
class Application: NSViewController, NSApplicationDelegate
{
	var serial:CInt = -1
    var serialPath = String()
	
    func applicationDidFinishLaunching(_ aNotification: Notification)
    {
		if !ProcessInfo.processInfo.arguments.contains("reload") {
			let task = Process()
			task.launchPath = Bundle.main.path(forResource: "run", ofType:nil)
			task.arguments =  ["reload"]
			task.launch()
			task.waitUntilExit()
		}
		//system("open -a Terminal \"" + NSBundle.mainBundle().pathForResource("run", ofType:nil)! + "\"")
		
		DispatchQueue.main.async
		{
			if let path = Bundle.main.path(forResource: "serial", ofType: "json", inDirectory: "Web/js") {
				do {
					let jsonString = try String(contentsOfFile: path)
					let jsonData = jsonString.data(using: .utf8)
					let json = try? JSONSerialization.jsonObject(with: jsonData!, options: [])
					if let dictionary = json as? [String: Any] {
						let d = dictionary["serial"]
						if let p = d as? [String: Any] {
							self.serialPath = p["port"] as! String
							self.openSerial()
						}
					}
				} catch {
				}
			}
		}
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
	
    func openSerial()
    {
		if(serial != -1) {
			return
		}
		
		closeSerial()
		
        var raw = Darwin.termios()
        let path = String(serialPath)
		let fd = open(path, O_RDWR) //| O_NOCTTY) | O_NDELAY | O_NONBLOCK
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
			cfsetspeed(&raw, 115200)    // set speed
			//cfsetispeed(&raw, speed_t(B115200))     // set input speed
			//cfsetospeed(&raw, speed_t(B115200))     // set output speed
			//------------------
			var cflag:tcflag_t = 0
            cflag |= UInt(CS8)            // 8-bit
            cflag |= UInt(CSTOPB)         // stop 2
			//raw.c_cflag &= ~(UInt(FNDELAY))		// clear fcntl, otherwise VMIN/VTIME are ignored
			//raw.c_cflag &= ~(UInt(CRTSCTS))	// clear rtscts
            raw.c_cflag &= ~(UInt(CSIZE))		// clear all bits
            raw.c_cflag |= cflag				// set cflags
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
}
