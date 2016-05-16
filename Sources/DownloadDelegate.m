#import "DownloadDelegate.h"

@implementation DownloadDelegate

- (void)download:(NSURLDownload *)download didReceiveResponse:(NSURLResponse *)response
{
	// A response was received.  We can use the response to get some interesting stuff like the expected content length
	// for use in progress indicators and a suggested filename that I'll be using here..
	suggestedFilename = [[response suggestedFilename] retain];
}

- (void)download:(NSURLDownload *)download decideDestinationWithSuggestedFilename:(NSString *)filename
{
    panel = [NSSavePanel savePanel];
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

@end
