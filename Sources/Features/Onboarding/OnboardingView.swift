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

// MARK: - Main View
struct OnboardingView: View {
    @EnvironmentObject private var coordinator: AppCoordinator
    @State private var currentWordIndex = 0
    @State private var wordOpacity = 1.0
    
    private let words = ["Document", "Share", "Immortalize"]
    
    var body: some View {
        ZStack {
            // Background image with overlay
            GeometryReader { geometry in
                Image("library_corridor")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                    .overlay(LegacyTheme.Gradients.subtleOverlay)
                    .ignoresSafeArea()
            }
            .ignoresSafeArea()
            
            // Content
            VStack {
                Spacer()
                    .frame(height: 180) // Reduced top spacing
                
                // Title section
                VStack(spacing: LegacyTheme.Spacing.xl) {
                    Text("Legacy AI")
                        .font(.custom("Didot-Bold", size: 56))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [
                                    Color(hex: "FFD700"),  // Bright gold
                                    Color(hex: "FDB931"),  // Rich gold
                                    Color(hex: "D4AF37"),  // Classic gold
                                    Color(hex: "FFD700")   // Back to bright gold
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: Color(hex: "FFD700").opacity(0.5), radius: 10, x: 0, y: 0)
                        .frame(maxWidth: .infinity)
                    
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
        .contentShape(Rectangle())
        .onTapGesture {
            coordinator.navigate(to: .authentication)
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
