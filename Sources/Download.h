#import <Cocoa/Cocoa.h>

@interface Download : NSObject <NSURLDownloadDelegate>
{
    IBOutlet NSWindow* window;
    long bytesReceived;
    long long expectedContentLength;
}

@property (nonatomic, assign) IBOutlet NSProgressIndicator *progressIndicator;
@property (nonatomic, assign) IBOutlet NSTextField *downloadProgressTextField;

@end
