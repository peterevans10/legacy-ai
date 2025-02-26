import SwiftUI

// MARK: - Rotating Words
private struct RotatingWord: View {
    let word: String
    let opacity: Double
    
    var body: some View {
        Text(word)
            .font(.custom("Inter", size: 24))
            .foregroundStyle(.white)
            .opacity(opacity)
            .animation(.easeInOut(duration: 1.0), value: opacity)
    }
}

// MARK: - Welcome View
private struct WelcomeView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var currentWordIndex = 0
    @State private var wordOpacity = 1.0
    
    private let words = ["Document", "Share", "Immortalize"]
    
    var body: some View {
        ZStack {
            // Background image
            GeometryReader { geometry in
                Image("library_corridor")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                    .overlay(
                        LinearGradient(
                            colors: [
                                Color.black.opacity(0.3),
                                Color.black.opacity(0.1)
                            ],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .edgesIgnoringSafeArea(.all)
            }
            .edgesIgnoringSafeArea(.all)
            
            // Content
            VStack {
                Spacer()
                    .frame(height: 180) // Top spacing
                
                // Title section
                VStack(spacing: 24) {
                    Text("Legacy AI")
                        .font(.custom("Didot-Bold", size: 56))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [
                                    Color(hex: "F5D485"),  // Lighter gold
                                    Color(hex: "D4AF37")   // Richer gold
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: Color(hex: "D4AF37").opacity(0.5), radius: 10, x: 0, y: 0)
                    
                    // Rotating words
                    Text(words[currentWordIndex])
                        .font(.custom("Inter", size: 24))
                        .foregroundStyle(.white)
                        .opacity(wordOpacity)
                        .animation(.easeInOut(duration: 2.0), value: wordOpacity)
                        .frame(height: 30)
                }
                
                Spacer()
            }
        }
        .onTapGesture {
            dismiss()
        }
        .onAppear {
            startWordRotation()
        }
    }
    
    private func startWordRotation() {
        Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { _ in
            // Fade out current word
            withAnimation(.easeInOut(duration: 2.0)) {
                wordOpacity = 0.0
            }
            
            // After fade out, change word and fade in
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                currentWordIndex = (currentWordIndex + 1) % words.count
                withAnimation(.easeInOut(duration: 2.0)) {
                    wordOpacity = 1.0
                }
            }
        }
    }
}

// MARK: - Onboarding Coordinator
class OnboardingCoordinator: ObservableObject {
    @Published var shouldShowIntro: Bool = true
    @Published var shouldShowWelcome: Bool = false
    
    init() {
        #if DEBUG
        shouldShowIntro = true
        #else
        shouldShowIntro = !UserDefaults.standard.bool(forKey: "hasSeenIntro")
        #endif
    }
    
    func markIntroAsComplete() {
        shouldShowIntro = false
        shouldShowWelcome = true
        
        #if !DEBUG
        UserDefaults.standard.set(true, forKey: "hasSeenIntro")
        #endif
    }
    
    func markWelcomeAsComplete() {
        shouldShowWelcome = false
    }
}

struct OnboardingContainerView<Content: View>: View {
    @StateObject private var coordinator = OnboardingCoordinator()
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        ZStack {
            // Your main app content
            content
            
            // Welcome view with library corridor
            if coordinator.shouldShowWelcome {
                WelcomeView()
                    .transition(.opacity)
                    .zIndex(2)
                    .onDisappear {
                        coordinator.markWelcomeAsComplete()
                    }
            }
            
            // Intro sequence overlay
            if coordinator.shouldShowIntro {
                IntroSequenceView(completion: {
                    coordinator.markIntroAsComplete()
                })
                .transition(.opacity)
                .zIndex(1)
            }
        }
    }
}
