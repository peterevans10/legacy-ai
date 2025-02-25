import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    
    var body: some View {
        Group {
            switch coordinator.currentRoute {
            case .onboarding:
                OnboardingView()
                    .environmentObject(coordinator)
            case .authentication:
                Text("Authentication") // Placeholder
            case .main:
                Text("Main") // Placeholder
            }
        }
    }
}
