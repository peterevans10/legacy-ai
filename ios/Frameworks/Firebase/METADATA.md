## Dependency Graph

"(~> X)" below means that the SDK requires all of the xcframeworks from X. You
should make sure to include all of the xcframeworks from X when including the
SDK.

## FirebaseAnalytics
- FBLPromises.xcframework
- FirebaseAnalytics.xcframework
- FirebaseCore.xcframework
- FirebaseCoreInternal.xcframework
- FirebaseInstallations.xcframework
- GoogleAppMeasurement.xcframework
- GoogleAppMeasurementIdentitySupport.xcframework
- GoogleUtilities.xcframework
- nanopb.xcframework

## FirebaseABTesting (~> FirebaseAnalytics)
- FirebaseABTesting.xcframework

## FirebaseAnalyticsOnDeviceConversion (~> FirebaseAnalytics)
- FirebaseAnalyticsOnDeviceConversion.xcframework
- GoogleAppMeasurementOnDeviceConversion.xcframework

## FirebaseAppCheck (~> FirebaseAnalytics)
- AppCheckCore.xcframework
- FirebaseAppCheck.xcframework
- FirebaseAppCheckInterop.xcframework

## FirebaseAppDistribution (~> FirebaseAnalytics)
- FirebaseAppDistribution.xcframework

## FirebaseAuth (~> FirebaseAnalytics)
- FirebaseAppCheckInterop.xcframework
- FirebaseAuth.xcframework
- GTMSessionFetcher.xcframework
- RecaptchaInterop.xcframework

## FirebaseCrashlytics (~> FirebaseAnalytics)
- FirebaseCoreExtension.xcframework
- FirebaseCrashlytics.xcframework
- FirebaseSessions.xcframework
- GoogleDataTransport.xcframework
- PromisesSwift.xcframework

## FirebaseDatabase (~> FirebaseAnalytics)
- FirebaseAppCheckInterop.xcframework
- FirebaseDatabase.xcframework
- FirebaseSharedSwift.xcframework
- leveldb-library.xcframework

## FirebaseDynamicLinks (~> FirebaseAnalytics)
- FirebaseDynamicLinks.xcframework

## FirebaseFirestore (~> FirebaseAnalytics)
- BoringSSL-GRPC.xcframework
- FirebaseAppCheckInterop.xcframework
- FirebaseCoreExtension.xcframework
- FirebaseFirestore.xcframework
- FirebaseFirestoreInternal.xcframework
- FirebaseSharedSwift.xcframework
- abseil.xcframework
- gRPC-C++.xcframework
- gRPC-Core.xcframework
- leveldb-library.xcframework

You'll also need to add the resources in the Resources
directory into your target's main bundle.

## FirebaseFunctions (~> FirebaseAnalytics)
- FirebaseAppCheckInterop.xcframework
- FirebaseAuthInterop.xcframework
- FirebaseCoreExtension.xcframework
- FirebaseFunctions.xcframework
- FirebaseMessagingInterop.xcframework
- FirebaseSharedSwift.xcframework
- GTMSessionFetcher.xcframework

## FirebaseInAppMessaging (~> FirebaseAnalytics)
- FirebaseABTesting.xcframework
- FirebaseInAppMessaging.xcframework

You'll also need to add the resources in the Resources
directory into your target's main bundle.

## FirebaseMLModelDownloader (~> FirebaseAnalytics)
- FirebaseMLModelDownloader.xcframework
- GoogleDataTransport.xcframework
- SwiftProtobuf.xcframework

## FirebaseMessaging (~> FirebaseAnalytics)
- FirebaseMessaging.xcframework
- GoogleDataTransport.xcframework

## FirebasePerformance (~> FirebaseAnalytics)
- FirebaseABTesting.xcframework
- FirebaseCoreExtension.xcframework
- FirebasePerformance.xcframework
- FirebaseRemoteConfig.xcframework
- FirebaseSessions.xcframework
- FirebaseSharedSwift.xcframework
- GoogleDataTransport.xcframework
- PromisesSwift.xcframework

## FirebaseRemoteConfig (~> FirebaseAnalytics)
- FirebaseABTesting.xcframework
- FirebaseRemoteConfig.xcframework
- FirebaseSharedSwift.xcframework

## FirebaseStorage (~> FirebaseAnalytics)
- FirebaseAppCheckInterop.xcframework
- FirebaseAuthInterop.xcframework
- FirebaseCoreExtension.xcframework
- FirebaseStorage.xcframework
- GTMSessionFetcher.xcframework

## Google-Mobile-Ads-SDK (~> FirebaseAnalytics)
- GoogleMobileAds.xcframework
- UserMessagingPlatform.xcframework

## GoogleSignIn
- AppAuth.xcframework
- GTMAppAuth.xcframework
- GTMSessionFetcher.xcframework
- GoogleSignIn.xcframework

You'll also need to add the resources in the Resources
directory into your target's main bundle.



## Versions

The xcframeworks in this directory map to these versions of the Firebase SDKs in
CocoaPods.

               CocoaPod                | Version
---------------------------------------|---------
AppAuth                                | 1.6.2
AppCheckCore                           | 10.18.0
BoringSSL-GRPC                         | 0.0.24
Firebase                               | 10.19.0
FirebaseABTesting                      | 10.19.0
FirebaseAnalytics                      | 10.19.0
FirebaseAnalyticsOnDeviceConversion    | 10.19.0
FirebaseAppCheck                       | 10.19.0
FirebaseAppCheckInterop                | 10.19.0
FirebaseAppDistribution                | 10.19.0-beta
FirebaseAuth                           | 10.19.0
FirebaseAuthInterop                    | 10.19.0
FirebaseCore                           | 10.19.0
FirebaseCoreExtension                  | 10.19.0
FirebaseCoreInternal                   | 10.19.0
FirebaseCrashlytics                    | 10.19.0
FirebaseDatabase                       | 10.19.0
FirebaseDynamicLinks                   | 10.19.0
FirebaseFirestore                      | 10.19.0
FirebaseFirestoreInternal              | 10.19.0
FirebaseFunctions                      | 10.19.0
FirebaseInAppMessaging                 | 10.19.0-beta
FirebaseInstallations                  | 10.19.0
FirebaseMLModelDownloader              | 10.19.0-beta
FirebaseMessaging                      | 10.19.0
FirebaseMessagingInterop               | 10.19.0
FirebasePerformance                    | 10.19.0
FirebaseRemoteConfig                   | 10.19.0
FirebaseSessions                       | 10.19.0
FirebaseSharedSwift                    | 10.19.0
FirebaseStorage                        | 10.19.0
GTMAppAuth                             | 2.0.0
GTMSessionFetcher                      | 3.2.0
Google-Mobile-Ads-SDK                  | 10.13.0
GoogleAppMeasurement                   | 10.19.0
GoogleAppMeasurementOnDeviceConversion | 10.19.0
GoogleDataTransport                    | 9.3.0
GoogleSignIn                           | 7.0.0
GoogleUserMessagingPlatform            | 2.1.0
GoogleUtilities                        | 7.12.0
PromisesObjC                           | 2.3.1
PromisesSwift                          | 2.3.1
RecaptchaInterop                       | 100.0.0
SwiftProtobuf                          | 1.25.1
abseil                                 | 1.20220623.0
gRPC-C++                               | 1.49.1
gRPC-Core                              | 1.49.1
leveldb-library                        | 1.22.2
nanopb                                 | 2.30909.1

