import SwiftUI

enum AppRoute {
    case onboarding
    case authentication
    case main
}

class AppCoordinator: ObservableObject {
    @Published var currentRoute: AppRoute = .onboarding
    
    func navigate(to route: AppRoute) {
        withAnimation {
            currentRoute = route
        }
    }
}
