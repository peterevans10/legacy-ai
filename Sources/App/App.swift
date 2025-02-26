import SwiftUI

@main
struct LegacyAIApp: App {
    @StateObject private var appCoordinator = AppCoordinator()
    @StateObject private var onboardingCoordinator = OnboardingCoordinator()
    
    var body: some Scene {
        WindowGroup {
            OnboardingContainerView {
                ContentView()
                    .environmentObject(appCoordinator)
            }
        }
    }
}
