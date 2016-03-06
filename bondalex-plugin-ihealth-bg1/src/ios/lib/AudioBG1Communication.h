//
//  AudioBG1Communication.h
//  iHealth_BG1
//
//  Created by daiqingquan on 14-1-9.
//  Copyright (c) 2014年 daiqingquan. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import "BGMacroFile.h"


typedef enum {
    ModelAuthenSuccess,
    ModelNoAuthen
}ModelAuthenStatus;

typedef enum {
    ModelNoStrip,
    ModelStripIn,
    ModelBloold
}ModelTestStatus;

#define NoNeedCode  @"000000"

@interface AudioBG1Communication : NSObject<AVAudioPlayerDelegate>{

    DisposeAuthenticationBlock _disposeAuthenticationBlock;
    DisposeBGErrorBlock _disposeBGErrorBlock;
    DisposeConnectBGBlock _disposeConnectBGBlock;
    DisposeDiscoverBGBlock _disposeDiscoverBGBlock;
    DisposeBGStripInBlock _disposeBGStripInBlock;
    DisposeBGStripOutBlock _disposeBGStripOutBlock;
    DisposeBGBloodBlock _disposeBGBloodBlock;
    DisposeBGResultBlock _disposeBGResultBlock;
    DisposeBGSendCodeBlock _disposeBGSendCodeBlock;
    DisposeBGIDPSBlock _disposeBGIDPSBlock;
    int reCommandFlag;
    ModelAuthenStatus modelAuthenStatus;
    ModelTestStatus modelTestStatus;
    
    NSString *thirdUserID;
    
    NSString *clientSDKUserName;
    NSString *clientSDKID;
    NSString *clientSDKSecret;
    
    BOOL modelVerifyOK;
    
}

/**
 * The authentication will be started by calling this method after the BG meter got connected.
 * @param userID  The only user label, is indicated by form of email address.
 * @param clientID See 'clientSecret'.
 * @param clientSecret  'clientID' and 'clientSecret' are the only user label, will be achieved after the register of SDK application. Please contact louie@ihealthlabs.com for the registration.
 * @param unitstate   BGUnit_mmolPL stands for mmol/L, BGUnit_mgPmL stands for mg/dL.
 * @param disposeAuthenticationBlock This block returns results after  the verification of userID,clientID,clientSecret.
 * -- Results:
 *      a)	UserAuthen_RegisterSuccess, new register successes.
 *      b)	UserAuthen_LoginSuccess, user logs in successfully.
 *      c)	UserAuthen_CombinedSuccess, user has been recognised as iHealth user, the measurement via SDK could be activated, the result data belongs to the user.
 *      d)	UserAuthen_TrySuccess, network error, the measurement is only for testing, SDK is not fully functional.
 *      e)	UserAuthen_InvalidateUserInfo, the verification of userID/clientID/clientSecret failed.
 *      f)	UserAuthen_SDKInvalidateRight, the application has not been authorised.
 *      g)	UserAuthen_UserInvalidateRight, the user has not been authorised.
 *      h)	UserAuthen_InternetError, network error, verification failed.
 *   -- PS:
 *      1. the measurement via SDK is functional in the case from a) to d).
 *      2. the measurement via SDK will be determined in the case from e) to h), please contact iHealth support team, louie@ihealthlabs.com
 *      3. “iHealth Disclaimer” will pop up and need to be proved by the user when SDK is activated for the first time.
 *      4. if iHealth SDK has been using without internet, there is only 10-day try out because the SDK can not be certified.
 * @param disposeDiscoverBGBlock This block returns means blood glucose meter plugged in.
 * @param disposeBGIDPSBlock  This block returns the IDPS of the meter, this will be operated for the first time when the app talks to the meter.
 * @param disposeConnectBGBlock, This block returns the connection status, the connection of the BG meter is regular , the measurement could be processed.
 * @param disposeBGErrorBlock, This block returns error, please refer to the error codes in the appendix.
 */
-(void)commandCreateConnectWithUserID:(NSString*)userID clientID:(NSString *)clientID clientSecret:(NSString *)clientSecret Authentication:(DisposeAuthenticationBlock)disposeAuthenticationBlock DisposeDiscoverBGBlock:(DisposeDiscoverBGBlock)disposeDiscoverBGBlock DisposeBGIDPSBlock:(DisposeBGIDPSBlock)disposeBGIDPSBlock DisposeConnectBGBlock:(DisposeConnectBGBlock)disposeConnectBGBlock DisposeBGErrorBlock:(DisposeBGErrorBlock)disposeBGErrorBlock;


/**
 * Establish connection and start BG measurement.
 * @param codeStrips The code String gets by scanning the QR code.
 * @param disposeBGSendCodeBlock   If the QR code is accepted, yes means accepted, no means deny.
 * @param disposeBGStripInBlock  This block returns yes means the strips slide into the BG meter.
 * @param disposeBGBloodBlock  This block returns yes means the blood drop has beed sensed from the strip.
 * @param disposeBGResultBlock  Returns the measurement by the unit of mg/dL, range from 20-600.
 * @param disposeBGStripOutBlock  This block returns yes means the strip has been pulled out.
 * @param disposeBGErrorBlock  This block returns any errors during the measurement, pleaser refer to the error code list.
 */
-(void)commandCreateBGtestWithCode:(NSString*)codeStrips DisposeBGSendCodeBlock:(DisposeBGSendCodeBlock)disposeBGSendCodeBlock DisposeBGStripInBlock:(DisposeBGStripInBlock)disposeBGStripInBlock DisposeBGBloodBlock:(DisposeBGBloodBlock)disposeBGBloodBlock DisposeBGResultBlock:(DisposeBGResultBlock)disposeBGResultBlock DisposeBGStripOutBlock:(DisposeBGStripOutBlock)disposeBGStripOutBlock DisposeBGErrorBlock:(DisposeBGErrorBlock)disposeBGErrorBlock;

/**
 * Initialization for BG1 (connected BG via sound jack)
 * When the app detected the glucose meter, the notification with the name of BG1ConnectNoti will be sent. After the device disconnected, the notification with the name of  BG1DisConnectNoti will be received.
 */
+ (AudioBG1Communication *)audioCommunicationObject;

/**
 * Analyze code include the bottleID，DueDate and the number of strips.
 * @param encodeString  The code String gets by scanning the QR code.
 */
-(NSDictionary *)codeStripStrAnalysis:(NSString *)encodeString;

@end
