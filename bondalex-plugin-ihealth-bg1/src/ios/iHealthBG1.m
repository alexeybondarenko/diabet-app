
#include <sys/types.h>
#include <sys/sysctl.h>

#import <Cordova/CDV.h>
#import "iHealthBG1.h"
#import "BGHeader.h"

@implementation iHealthBG1

-(void)DeviceConnectForBG1:(NSNotification *)tempNoti{

    AudioBG1Communication *bgInstance = [AudioBG1Communication audioCommunicationObject];
    if (bgInstance != nil) {
        NSLog(@"connect bg1");
    }

    if (self.callbackId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"name": @"connect"}];
        [result setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }

}

-(void)DeviceDisConnectForBG1:(NSNotification *)tempNoti{
    NSLog(@"disconnect bg1");
    if (self.callbackId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"name": @"disconnect"}];
        [result setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }
}

- (void)subscribe:(CDVInvokedUrlCommand*)command
{
    NSLog(@"subscribe");
    self.callbackId = command.callbackId;

    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(DeviceConnectForBG1:) name:BG1ConnectNoti object:nil];
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(DeviceDisConnectForBG1:) name:BG1DisConnectNoti object:nil];

    [AudioBG1Communication audioCommunicationObject];
}
- (void)unsubscribe: (CDVInvokedUrlCommand*) command
{
    NSLog(@"unsubscribe");
    // callback one last time to clear the callback function on JS side
    if (self.callbackId) {
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:nil];
        [result setKeepCallbackAsBool:NO];
        [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    }
    self.callbackId = nil;

    [[NSNotificationCenter defaultCenter] removeObserver:self name:BG1ConnectNoti object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:BG1DisConnectNoti object:nil];
}

@end
