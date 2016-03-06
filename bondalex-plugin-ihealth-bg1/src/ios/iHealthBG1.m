
#include <sys/types.h>
#include <sys/sysctl.h>

#import <Cordova/CDV.h>
#import "iHealthBG1.h"
#import "BGHeader.h"

#define CodeStr @"024C565F4C5614322D1200A02F3485B6F314378BACD619011F72003608A9"

@implementation iHealthBG1

-(BOOL)sendStatus: (NSString *) status andKeepCallback: (BOOL) keepCallback {
    return [self sendStatus:status withData:nil andKeepCallback:keepCallback];
}
-(BOOL)sendStatus: (NSString *) status withData: (NSDictionary *) dataDic andKeepCallback: (BOOL) keepCallback {
    if (self.callbackId == nil) return NO;

    NSMutableDictionary *resultDic = [NSMutableDictionary dictionaryWithDictionary:@{@"status": status}];
    if (dataDic != nil) {
        [resultDic setValue:dataDic forKey:@"data"];
    }
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDic];
    [result setKeepCallbackAsBool: keepCallback];
    [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
    return YES;
}

-(void)DeviceConnectForBG1:(NSNotification *)tempNoti{

    NSString *username = @"alexeybondarenko@me.com";
    NSString *clientId = @"fbd3c9b972414d579ac27afc6fde8fe1";
    NSString *clientSecret = @"03a6bb3f0000459788c9cf5e1eb0c20c";

    AudioBG1Communication *bgInstance = [AudioBG1Communication audioCommunicationObject];
    if (bgInstance != nil) {

        [self sendStatus:@"init" andKeepCallback:YES];
        NSLog(@"connect bg1");

        [bgInstance commandCreateConnectWithUserID:username clientID:clientId clientSecret:clientSecret Authentication:^(UserAuthenResult result) {
            BOOL verify = FALSE;
            if(result== UserAuthen_CombinedSuccess || result== UserAuthen_LoginSuccess || result== UserAuthen_RegisterSuccess || result== UserAuthen_TrySuccess){
                verify = TRUE;
                NSLog(@"verify success");
            }
            [self sendStatus:@"verify" withData:@{@"status": [NSNumber numberWithBool:verify]} andKeepCallback:YES];
        } DisposeDiscoverBGBlock:^(BOOL result) {
            [self sendStatus:@"plugged" withData:@{@"status": [NSNumber numberWithBool:result]} andKeepCallback:YES];
        } DisposeBGIDPSBlock:^(NSDictionary *idpsDic) {
            [self sendStatus:@"idps" withData:idpsDic andKeepCallback:YES];
        } DisposeConnectBGBlock:^(BOOL result) {
            [self sendStatus:@"connect" withData:@{@"status": [NSNumber numberWithBool:result]} andKeepCallback:YES];

            if(result == FALSE){ return;}

            [bgInstance commandCreateBGtestWithCode:CodeStr DisposeBGSendCodeBlock:^(BOOL sendOk) {
                [self sendStatus:@"sendCodeBlock" withData:@{@"status": [NSNumber numberWithBool:sendOk]} andKeepCallback:YES];
                // NSLog(@"DisposeBGSendCodeBlock:%d",sendOk);
            } DisposeBGStripInBlock:^(BOOL stripIn) {
                [self sendStatus:@"stripIn" withData:@{@"status": [NSNumber numberWithBool:stripIn]} andKeepCallback:YES];
                // NSLog(@"stripIn:%d",stripIn);
            } DisposeBGBloodBlock:^(BOOL blood) {
                [self sendStatus:@"blood" withData:@{@"status": [NSNumber numberWithBool:blood]} andKeepCallback:YES];
                // NSLog(@"blood:%d",blood);
            } DisposeBGResultBlock:^(NSNumber *result) {
                [self sendStatus:@"result" withData:@{@"result": result} andKeepCallback:YES];
                // NSLog(@"result:%@",result);
            }DisposeBGStripOutBlock:^(BOOL stripOut) {
                [self sendStatus:@"stripOut" withData:@{@"status": [NSNumber numberWithBool:stripOut]} andKeepCallback:YES];
                // NSLog(@"stripOut:%d",stripOut);
            } DisposeBGErrorBlock:^(NSNumber *errorID) {
                [self sendStatus:@"error" withData:@{@"status": errorID} andKeepCallback:YES];
                // NSLog(@"errorID:%@",errorID);
            }];

        } DisposeBGErrorBlock:^(NSNumber *errorID) {
            [self sendStatus:@"error" withData:@{@"status": errorID} andKeepCallback:YES];
            // NSLog(@"errorID:%@",errorID);
        }];
    }
}

-(void)DeviceDisConnectForBG1:(NSNotification *)tempNoti{
    NSLog(@"disconnect bg1");
    [self sendStatus:@"disconnect" andKeepCallback:YES];
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
    [self sendStatus:@"unsubscribe" andKeepCallback:NO];

    self.callbackId = nil;

    [[NSNotificationCenter defaultCenter] removeObserver:self name:BG1ConnectNoti object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:BG1DisConnectNoti object:nil];
}

@end
