import SwiftUI

struct ImageRotationView: View {
    let images: [String]
    let isVisible: Bool
    let completion: () -> Void
    
    @State private var currentIndex = 0
    @State private var offset: CGFloat = UIScreen.main.bounds.width
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(Array(images.enumerated()), id: \.0) { index, imageName in
                    Image(imageName)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: geometry.size.width, height: geometry.size.height)
                        .clipped()
                        .opacity(index == currentIndex ? 1 : 0)
                        .offset(x: index == currentIndex ? 0 : offset)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .ignoresSafeArea()
            .onChange(of: isVisible) { newValue in
                if newValue {
                    startRotation()
                }
            }
        }
    }
    
    private func startRotation() {
        guard currentIndex == 0 else { return }
        
        for index in 0..<images.count {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 0.7) {
                withAnimation(.easeInOut(duration: 0.5)) {
                    currentIndex = index
                }
                
                if index == images.count - 1 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) {
                        completion()
                    }
                }
            }
        }
    }
}

struct ImageFadeView: View {
    let images: [String]
    let isVisible: Bool
    let completion: () -> Void
    
    @State private var currentIndex = 0
    @State private var opacity: Double = 0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(Array(images.enumerated()), id: \.0) { index, imageName in
                    Image(imageName)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: geometry.size.width * 0.8)
                        .opacity(index == currentIndex ? 1 : 0)
                }
            }
            .onChange(of: isVisible) { newValue in
                if newValue {
                    startFading()
                }
            }
        }
    }
    
    private func startFading() {
        guard currentIndex == 0 else { return }
        
        for index in 0..<images.count {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 0.8) {
                withAnimation(.easeInOut(duration: 0.6)) {
                    currentIndex = index
                }
                
                if index == images.count - 1 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                        completion()
                    }
                }
            }
        }
    }
}

struct CompositeView: View {
    let text: String
    let images: [String]
    let isVisible: Bool
    let completion: () -> Void
    
    @State private var currentIndex = 0
    @State private var textOpacity: Double = 0
    @State private var rotationSpeed: Double = 1.0
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background Image
                if currentIndex < images.count {
                    Image(images[currentIndex])
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: geometry.size.width)
                        .clipped()
                        .overlay(Color.black.opacity(0.4))
                }
                
                // Text
                VStack {
                    let lines = text.components(separatedBy: "\n")
                    ForEach(Array(lines.enumerated()), id: \.0) { index, line in
                        Text(line)
                            .font(.custom("PlayfairDisplay-Bold", size: 32))
                            .foregroundColor(.white)
                            .opacity(textOpacity)
                            .shadow(radius: 10)
                    }
                }
            }
            .onChange(of: isVisible) { newValue in
                if newValue {
                    startSequence()
                }
            }
        }
    }
    
    private func startSequence() {
        guard currentIndex == 0 else { return }
        
        // Start with slow rotation
        withAnimation(.easeIn(duration: 0.5)) {
            textOpacity = 1
        }
        
        // Accelerate through images
        for index in 0..<images.count {
            let baseDelay = Double(index) * (0.8 / rotationSpeed)
            DispatchQueue.main.asyncAfter(deadline: .now() + baseDelay) {
                withAnimation(.easeInOut(duration: 0.3)) {
                    currentIndex = index
                }
                
                // Increase speed
                rotationSpeed *= 1.2
                
                if index == images.count - 1 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                        withAnimation(.easeOut(duration: 0.3)) {
                            textOpacity = 0
                        }
                        
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                            completion()
                        }
                    }
                }
            }
        }
    }
}
