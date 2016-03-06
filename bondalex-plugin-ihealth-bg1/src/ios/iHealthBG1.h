
#import <UIKit/UIKit.h>
#import <Cordova/CDVPlugin.h>

@interface iHealthBG1 : CDVPlugin
{}

@property (strong) NSString* callbackId;

- (void)subscribe:(CDVInvokedUrlCommand*)command;
- (void)unsubscribe:(CDVInvokedUrlCommand*)command;

@end
