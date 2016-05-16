#import "PolicyDelegate.h"

@implementation PolicyDelegate

- (void)webView:(WebView *)sender decidePolicyForMIMEType:(NSString *)type request:(NSURLRequest *)request frame:(WebFrame *)frame decisionListener:(id<WebPolicyDecisionListener>)listener
{
    if ([type isEqualToString:@"text/snapshot"]){
        [listener download];
    }else{
        [listener use];
    }
}

@end
