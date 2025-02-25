import SwiftUI

enum LegacyTheme {
    enum Colors {
        // Core palette inspired by classic home offices
        static let richWalnut = Color(hex: "733E1D")      // Classic wood paneling
        static let antiquePaper = Color(hex: "F5E6D3")    // Aged document
        static let darkLeather = Color(hex: "2B1810")     // Leather-bound books
        static let warmBrass = Color(hex: "B6A577")       // Desk accessories
        
        // Accent colors
        static let subtleGold = Color(hex: "9B8650")      // Understated gold
        static let deepTeal = Color(hex: "1A3B3B")        // Leather chair
        static let oxfordCream = Color(hex: "F7F2E6")     // Fine stationery
        
        // Text colors
        static let inkBlack = Color(hex: "222222")        // Writing ink
        static let agedSepia = Color(hex: "594835")       // Old text
    }
    
    enum Gradients {
        static let modernGold = LinearGradient(
            colors: [
                Color(hex: "F5D485"),  // Lighter, more modern gold
                Color(hex: "D4AF37")   // Richer gold base
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        
        static let subtleOverlay = LinearGradient(
            colors: [
                Color.black.opacity(0.3),
                Color.black.opacity(0.1)
            ],
            startPoint: .top,
            endPoint: .bottom
        )
        
        static let glassEffect = LinearGradient(
            colors: [
                Color.white.opacity(0.1),
                Color.white.opacity(0.05)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        
        static let agedParchment = LinearGradient(
            colors: [
                Colors.antiquePaper,
                Colors.oxfordCream,
                Colors.antiquePaper.opacity(0.8)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        
        static let libraryBackground = LinearGradient(
            colors: [
                Color(hex: "#2C1810").opacity(0.9),
                Color(hex: "#1A0F0A")
            ],
            startPoint: .top,
            endPoint: .bottom
        )
    }
    
    enum Typography {
        static let h1: CGFloat = 36
        static let h2: CGFloat = 28
        static let h3: CGFloat = 24
        static let body: CGFloat = 18
        static let caption: CGFloat = 16
        static let small: CGFloat = 14
    }
    
    enum Spacing {
        static let xs: CGFloat = 4
        static let s: CGFloat = 8
        static let m: CGFloat = 16
        static let l: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }
    
    enum Animations {
        static let defaultDuration: Double = 0.6
        static let defaultCurve: SwiftUI.Animation = .easeInOut(duration: defaultDuration)
        static let gentleCurve: SwiftUI.Animation = .easeInOut(duration: 0.8)
    }
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - View Extensions
extension View {
    func headerStyle(size: CGFloat = LegacyTheme.Typography.h1) -> some View {
        self.font(.custom("Baskerville-SemiBold", size: size))
            .foregroundStyle(LegacyTheme.Gradients.modernGold)
            .shadow(color: Color.black.opacity(0.1), radius: 1, x: 0, y: 1)
    }
    
    func bodyStyle(size: CGFloat = LegacyTheme.Typography.body) -> some View {
        self.font(.custom("Baskerville", size: size))
            .foregroundColor(LegacyTheme.Colors.agedSepia)
            .lineSpacing(8)
    }
    
    func primaryButtonStyle() -> some View {
        self.font(.custom("Baskerville-SemiBold", size: LegacyTheme.Typography.body))
            .foregroundColor(LegacyTheme.Colors.oxfordCream)
            .padding(.vertical, LegacyTheme.Spacing.l)
            .padding(.horizontal, LegacyTheme.Spacing.xl)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(LegacyTheme.Colors.richWalnut)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(LegacyTheme.Colors.subtleGold, lineWidth: 1)
            )
    }
    
    func parchmentCard() -> some View {
        self.padding(LegacyTheme.Spacing.xl)
            .background(
                LegacyTheme.Gradients.agedParchment
            )
            .overlay(
                RoundedRectangle(cornerRadius: 2)
                    .stroke(LegacyTheme.Colors.agedSepia.opacity(0.2), lineWidth: 0.5)
            )
    }
}
