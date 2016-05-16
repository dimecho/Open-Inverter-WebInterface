#import <Cocoa/Cocoa.h>

@interface DownloadDelegate : NSObject {
    NSString *suggestedFilename;
    NSSavePanel *panel;
}

@end