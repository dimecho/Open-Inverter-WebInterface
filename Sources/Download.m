#import "Download.h"

@implementation Download

-(void)awakeFromNib
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(startDownload:) name:@"startDownload" object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(windowWillClose:) name:NSWindowWillCloseNotification object:nil];
}

- (void)windowWillClose:(NSNotification *)notification
{
    //Pause Download
}

- (void) startDownload:(NSNotification *) notification
{
    if ([notification.name isEqualToString:@"startDownload"])
    {
        NSURLRequest* theRequest = [NSURLRequest requestWithURL:[NSURL URLWithString:notification.userInfo[@"url"]]];
        NSURLDownload* theDownload = [[NSURLDownload alloc] initWithRequest:theRequest delegate:self];

        [theDownload setDestination:notification.userInfo[@"path"] allowOverwrite:NO];
        [theDownload setDeletesFileUponFailure:NO]; //Allow for Resume
    }
}

- (void)download:(NSURLDownload *)download didFailWithError:(NSError *)error
{
    NSLog(@"Download failed! Error - %@ %@", [error localizedDescription], [[error userInfo] objectForKey:NSURLErrorFailingURLStringErrorKey]);
}

- (void)downloadDidFinish:(NSURLDownload *)download
{
    [self.downloadProgressTextField setStringValue:@"Download Complete"];
    
    NSDictionary *userInfo = [NSDictionary dictionaryWithObjectsAndKeys: @"", @"url", nil];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"completeDownload" object:nil userInfo:userInfo];

    [window close];
}

- (void)download:(NSURLDownload *)download didReceiveResponse:(NSURLResponse *)response
{
    expectedContentLength = response.expectedContentLength;
    NSDictionary *responseHeaders = ((NSHTTPURLResponse *)response).allHeaderFields;
    NSString *actualContentLength = responseHeaders[@"Content-Length"];
    
    //NSLog(actualContentLength);
    
    if(actualContentLength && actualContentLength.length > 0){
        expectedContentLength = actualContentLength.longLongValue;
    }
}

- (void)download:(NSURLDownload *)download didReceiveDataOfLength:(unsigned long)length
{
    bytesReceived = bytesReceived + length;
    
    if (expectedContentLength != NSURLResponseUnknownLength) {

        double percentComplete = (bytesReceived/(float)expectedContentLength)*100.0;
        
        [self.progressIndicator setDoubleValue:percentComplete];
        
        [self.downloadProgressTextField setStringValue:[NSString stringWithFormat:@"%ld of %lld MB Downloaded",bytesReceived/1024/1024,expectedContentLength/1024/1024]];
    }else {
        NSLog(@"Bytes received - %ld",bytesReceived);
    }
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name: @"startDownload" object:nil];
    [super dealloc];
}



@end
