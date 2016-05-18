#import "Application.h"
#import "serial.h"
#import "Terminal.h"
#import "Download.h"
#include <termios.h>

@implementation Application

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification
{
    [webView setPolicyDelegate:self];
    [webView setDownloadDelegate:self];
    
    [self performSelectorInBackground:@selector(startPHP) withObject:nil];
}

- (void)checkInkscape
{
    if (![[NSFileManager defaultManager] fileExistsAtPath:@"/Applications/Inkscape.app/Contents/MacOS/Inkscape"])
    {
        NSAlert *alert = [[NSAlert alloc] init];
        [alert setMessageText:@"Install Inkscape - Download 70MB"];
        [alert setInformativeText:@"Inkscape is an open-source vector editor."];
        [alert addButtonWithTitle:@"OK"];
        [alert addButtonWithTitle:@"Cancel"];
        
        if ([alert runModal] == NSAlertFirstButtonReturn)
        {
            //[webView setMainFrameURL:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/web/encoder/inkscape.html"]];
            
            NSWindowController* downloadWindow = [[NSWindowController alloc] initWithWindowNibName:@"Download"];
            [downloadWindow showWindow:self];
            
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(completeDownload:) name:@"completeDownload" object:nil];
            NSDictionary *userInfo = [NSDictionary dictionaryWithObjectsAndKeys: @"https://inkscape.org/en/gallery/item/3896/Inkscape-0.91-1-x11-10.7-x86_64.dmg", @"url", [[NSHomeDirectory() stringByAppendingPathComponent:@"Downloads"] stringByAppendingPathComponent:@"Inkscape-0.91-1-x11-10.7-x86_64.dmg"], @"path", nil];
            [[NSNotificationCenter defaultCenter] postNotificationName:@"startDownload" object:nil userInfo:userInfo];
        }
        [alert release];
    }else{
        /*
        //Applications/Inkscape.app/Contents/Resources/share/inkscape/extensions/encoder_disk_generator.py
        NSString* encoderPath = [NSString stringWithFormat:@"%@/.config/inkscape/extensions/encoder_disk_generator.py", NSHomeDirectory()];
        if (![[NSFileManager defaultManager] fileExistsAtPath:encoderPath])
        {
            [[NSFileManager defaultManager] copyItemAtURL:[NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"encoder_disk_generator" ofType:@"py" inDirectory:@"web/encoder"]] toURL:[NSURL fileURLWithPath:encoderPath] error:nil];
        }
        */
        [[NSWorkspace sharedWorkspace] launchApplication:@"/Applications/Inkscape.app"];
    }
}

- (void) completeDownload:(NSNotification *) notification
{
    if ([notification.name isEqualToString:@"completeDownload"])
    {
        NSLog(@"install DMG");
        
        NSString* output = nil;
        NSString* processErrorDescription = nil;
        BOOL success = [self runProcessAsAdministrator:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/inkscape"] withArguments:[NSArray arrayWithObjects:@"", nil] output:&output errorDescription:&processErrorDescription];
        if (!success)
        {
            NSLog(processErrorDescription);
        }
        else
        {
            NSLog(output);
        }
    }
}

- (void)checkDrivers
{
    NSString *filePath=@"/Library/Extensions/ProlificUsbSerial.kext/Contents/MacOS/ProlificUsbSerial";
    if (![[NSFileManager defaultManager] fileExistsAtPath:filePath])
    {
        [NSThread sleepForTimeInterval:1.0f]; //wait for PHP to start
        dispatch_sync(dispatch_get_main_queue(), ^{
            [webView setMainFrameURL:@"http://localhost:8080/driver/loading.html"];
        });
        
        NSString* output = nil;
        NSString* processErrorDescription = nil;
        BOOL success = [self runProcessAsAdministrator:@"/bin/cp" withArguments:[NSArray arrayWithObjects:@"-R", [NSString stringWithFormat:@"'%@'", [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/web/driver/ProlificUsbSerial.kext"]], @"/Library/Extensions/", nil] output:&output errorDescription:&processErrorDescription];
        if (!success)
        {
            //NSLog(processErrorDescription);
            dispatch_sync(dispatch_get_main_queue(), ^{
                [webView setMainFrameURL:@"http://localhost:8080/driver/error1.html"];
            });
            return;
        }
        else
        {
            //NSLog(output);
            dispatch_sync(dispatch_get_main_queue(), ^{
                [webView setMainFrameURL:@"http://localhost:8080/driver/success.html"];
            });
            
            [NSThread sleepForTimeInterval:2.0f];
        }
    }

    [self checkConnect];
}

- (void)checkConnect
{
    [NSThread sleepForTimeInterval:1.0f]; //wait for PHP to start
    
    dispatch_sync(dispatch_get_main_queue(), ^{
        [webView setMainFrameURL:@"http://localhost:8080/driver/connect.html"];
    });
    
    Boolean found;
    
    while (found == NO)
    {
        for ( int i = 0; i < [self findPorts]; i++ )
        {
            //NSLog(path[i]);
            if ([path[i] rangeOfString:@"cu.usbserial"].location != NSNotFound)
            {
                dispatch_sync(dispatch_get_main_queue(), ^{
                    [webView setMainFrameURL:@"http://localhost:8080/driver/receive.html"];
                });
                tty = path[i];
                [self startSerial];
                found = YES;
            }
        }

        [NSThread sleepForTimeInterval:2.0f];
    }
}

- (int)findPorts
{
    CFStringRef cstream[32], cpath[32] ;
    int i, count ;
    
    count = findPorts( cstream, cpath, 32 ) ;
    for ( i = 0; i < count; i++ ) {
        stream[i] = [ [ NSString stringWithString:(NSString*)cstream[i] ] retain ] ;
        CFRelease( cstream[i] ) ;
        path[i] = [ [ NSString stringWithString:(NSString*)cpath[i] ] retain ] ;
        CFRelease( cpath[i] ) ;
        //NSLog(stream[i]);
        //NSLog(path[i]);
    }
    return count ;
}

- (void)startPHP
{
    //NSString* phpPath=@"/usr/local/php5/bin/php";
    NSString* phpPath=@"/usr/bin/php";
    
    if (![[NSFileManager defaultManager] fileExistsAtPath:phpPath] || ![[NSFileManager defaultManager] fileExistsAtPath:@"/usr/local/lib/php/extensions/dio.so"])
    {
        dispatch_sync(dispatch_get_main_queue(), ^{
            [webView setMainFrameURL:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/web/driver/php.html"]];
        });
        
        NSString* output = nil;
        NSString* processErrorDescription = nil;
        BOOL success = [self runProcessAsAdministrator:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/install"] withArguments:[NSArray arrayWithObjects:@"", nil] output:&output errorDescription:&processErrorDescription];
        if (!success)
        {
            //NSLog(processErrorDescription);
            dispatch_sync(dispatch_get_main_queue(), ^{
                [webView setMainFrameURL:[[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/web/driver/error2.html"]];
            });
        }
        else
        {
            //NSLog(output);
            [self startPHP];
        }
        
    }else{
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(phpDidTerminate:) name:NSTaskDidTerminateNotification object:nil];

        self.phpTask = [[[NSTask alloc] init] autorelease];
        [self.phpTask setLaunchPath:phpPath];
        [self.phpTask setArguments:[NSArray arrayWithObjects: @"-S", @"127.0.0.1:8080", @"-t", [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"/web/"], nil]];
        
        [self performSelectorInBackground:@selector(checkDrivers) withObject:nil];
        
        [self.phpTask launch];
    }
}

- (void)download:(NSURLDownload *)download didReceiveResponse:(NSURLResponse *)response
{
    // A response was received.  We can use the response to get some interesting stuff like the expected content length
    // for use in progress indicators and a suggested filename that I'll be using here..
    suggestedFilename = [[response suggestedFilename] retain];
}

- (void)download:(NSURLDownload *)download decideDestinationWithSuggestedFilename:(NSString *)filename
{
    NSSavePanel* panel = [NSSavePanel savePanel];
    [panel setNameFieldStringValue:suggestedFilename];
    if ([panel runModal] == NSFileHandlingPanelCancelButton)
    {
        [download cancel];
    }
    else
    {
        NSString *destination;
        destination = [[panel directoryURL] path];
        destination = [destination stringByAppendingPathComponent:suggestedFilename];
        [download setDestination:destination allowOverwrite:YES];
    }
}

- (void)webView:(WebView *)sender decidePolicyForMIMEType:(NSString *)type request:(NSURLRequest *)request frame:(WebFrame *)frame decisionListener:(id<WebPolicyDecisionListener>)listener
{
    if ([type isEqualToString:@"text/snapshot"]){
        [listener download];
    }else{
        [listener use];
    }
}

- (void)webView:(WebView *)sender decidePolicyForNavigationAction:(NSDictionary*)actionInformation request:(NSURLRequest *)request frame:(WebFrame *)frame decisionListener:(id<WebPolicyDecisionListener>)listener
{
    if ([[actionInformation objectForKey:WebActionOriginalURLKey] isEqual:[NSURL URLWithString:@"http://localhost:8080/encoder.html"]])
    {
        [self checkInkscape];
        
        [listener ignore];
        
    }else{
        
        [listener use];
    }
}

- (void)startSerial
{
    //Force OSX to use TTY with baudRate 115200
    
    self.terminal = [[[Terminal alloc] init] autorelease];
    [self.terminal setRTS: NO];
    [self.terminal setDTR: NO];
    [self.terminal setCrlfEnable:NO];
    [self.terminal setRawEnable:NO];
    
    Boolean opened = [self.terminal openConnections:[tty cStringUsingEncoding:NSASCIIStringEncoding] baudrate:115200 bits:8 parity:1 stopBits:2 ] ;
    //[self.terminal transmitCharacters:@"json\n"];
    
    if (opened == NO)
    {
        dispatch_sync(dispatch_get_main_queue(), ^{

            NSAlert *alert = [[NSAlert alloc] init];
            [alert addButtonWithTitle:@"OK"];
            [alert setMessageText:@"Cannot open terminal port."];
            [alert setInformativeText:[tty stringByAppendingPathComponent:@" would not open."]];
            [alert setAlertStyle:NSWarningAlertStyle];
            [alert runModal];
            
            [webView setMainFrameURL:@"http://localhost:8080/wiring.html"];
        });
        
    }else{
        [NSThread sleepForTimeInterval:2.0f];
        dispatch_sync(dispatch_get_main_queue(), ^{
            [webView setMainFrameURL:@"http://localhost:8080/index.html"];
        });
    }
}

- (void) phpDidTerminate:(NSNotification *)notification
{
    NSAlert *alert = [[NSAlert alloc] init];
    [alert addButtonWithTitle:@"OK"];
    [alert setMessageText:@"PHP Server Quit"];
    [alert setInformativeText:@"Well this is unexpected ..check Firewall."];
    [alert setAlertStyle:NSWarningAlertStyle];
    [alert runModal];
}

- (void)windowWillClose:(NSNotification *)notification
{
    NSLog(@"Main Window Closed");

}

- (void)applicationWillTerminate:(NSApplication *)application
{
    [self.phpTask terminate];
    [self.terminal closeConnections];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)application {
    return YES;
}

- (BOOL) runProcessAsAdministrator:(NSString*)scriptPath withArguments:(NSArray *)arguments  output:(NSString **)output errorDescription:(NSString **)errorDescription {
    
    NSString * allArgs = [arguments componentsJoinedByString:@" "];
    NSString * fullScript = [NSString stringWithFormat:@"'%@' %@", scriptPath, allArgs];
    
    NSDictionary *errorInfo = [NSDictionary new];
    NSString *script =  [NSString stringWithFormat:@"do shell script \"%@\" with administrator privileges", fullScript];
    
    NSAppleScript *appleScript = [[NSAppleScript new] initWithSource:script];
    NSAppleEventDescriptor * eventResult = [appleScript executeAndReturnError:&errorInfo];
    
    if (! eventResult)
    {
        // Describe common errors
        *errorDescription = nil;
        if ([errorInfo valueForKey:NSAppleScriptErrorNumber])
        {
            NSNumber * errorNumber = (NSNumber *)[errorInfo valueForKey:NSAppleScriptErrorNumber];
            if ([errorNumber intValue] == -128)
                *errorDescription = @"The administrator password is required.";
        }
        
        // Set error message from provided message
        if (*errorDescription == nil)
        {
            if ([errorInfo valueForKey:NSAppleScriptErrorMessage])
                *errorDescription =  (NSString *)[errorInfo valueForKey:NSAppleScriptErrorMessage];
        }
        return NO;
    }
    else
    {
        // Set output to the AppleScript's output
        *output = [eventResult stringValue];
        
        return YES;
    }
}

@end
