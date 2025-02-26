import SwiftUI
import AVKit
import UIKit

// MARK: - View Model

class IntroSequenceViewModel: ObservableObject {
    @Published private(set) var currentScene: IntroScene?
    @Published private(set) var isCurrentSceneActive = true
    @Published private(set) var videoOpacity: Double = 0
    
    private var sceneIndex = 0
    private(set) var videoPlayer: AVPlayer?
    private var audioPlayer: AVAudioPlayer?
    
    init() {
        print("🎬 IntroSequenceViewModel: Initializing...")
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
            print("🔊 Audio Session: Successfully configured")
        } catch {
            print("❌ Audio Session Error: \(error)")
        }
        
        setupVideo()
        setupAudio()
        currentScene = IntroSequenceConfig.scenes.first
    }
    
    deinit {
        cleanup()
    }
    
    func startSequence() {
        print("▶️ Starting sequence...")
        videoPlayer?.seek(to: .zero)
        videoPlayer?.play()
        print("🎥 Video player status: \(videoPlayer?.status.rawValue ?? -1)")
        
        // Fade in video
        withAnimation(.easeIn(duration: 0.5)) {
            videoOpacity = 1
        }
        
        if let audioPlayer = audioPlayer {
            audioPlayer.currentTime = 0
            audioPlayer.play()
            print("🔊 Audio player: Started playing, volume: \(audioPlayer.volume), duration: \(audioPlayer.duration)")
        } else {
            print("❌ Audio player is nil!")
        }
        
        // Since we're starting with the first scene already visible,
        // schedule the next scene after the first scene's duration
        if let firstScene = currentScene {
            DispatchQueue.main.asyncAfter(deadline: .now() + firstScene.duration) {
                self.handleSceneCompletion()
            }
        }
    }
    
    func stopSequence() {
        print("⏹️ Stopping sequence...")
        videoPlayer?.pause()
        audioPlayer?.stop()
        
        // Fade out video if it's showing
        withAnimation(.easeOut(duration: 0.5)) {
            videoOpacity = 0
        }
    }
    
    func handleSceneCompletion() {
        showNextScene()
    }
    
    func skip() {
        videoPlayer?.pause()
        audioPlayer?.stop()
        
        // Show final scene
        sceneIndex = IntroSequenceConfig.scenes.count - 1
        currentScene = IntroSequenceConfig.scenes.last
        isCurrentSceneActive = true
        
        // Fade out video if it's showing
        withAnimation(.easeOut(duration: 0.5)) {
            videoOpacity = 0
        }
    }
    
    func cleanup() {
        print("🧹 Cleaning up resources...")
        videoPlayer?.pause()
        videoPlayer = nil
        audioPlayer?.stop()
        audioPlayer = nil
    }
    
    private func setupVideo() {
        print("🎥 Setting up video...")
        let videoName = IntroSequenceConfig.backgroundAssets.videoURL
        print("📺 Looking for video: \(videoName)")
        
        // Try both with and without Intro prefix
        let videoNames = [
            "Intro/Video/\(videoName).dataset/\(videoName)",
            "Intro/Video/\(videoName).dataset",
            videoName
        ]
        for name in videoNames {
            if let videoData = NSDataAsset(name: name) {
                print("✅ Found video data at '\(name)', size: \(videoData.data.count) bytes")
                let tempDir = FileManager.default.temporaryDirectory
                let videoURL = tempDir.appendingPathComponent("temp_video.mp4")
                
                do {
                    try videoData.data.write(to: videoURL)
                    videoPlayer = AVPlayer(url: videoURL)
                    videoPlayer?.isMuted = true
                    print("✅ Video player created successfully")
                    return
                } catch {
                    print("❌ Failed to create video player: \(error)")
                }
            }
        }
        print("❌ Video asset not found in asset catalog. Tried paths: \(videoNames)")
    }
    
    private func setupAudio() {
        print("🔊 Setting up audio...")
        let audioName = IntroSequenceConfig.backgroundAssets.musicURL
        print("🎵 Looking for audio: \(audioName)")
        
        // Try both with and without Intro prefix
        let audioNames = [
            "Intro/Audio/\(audioName).dataset/\(audioName)",
            "Intro/Audio/\(audioName).dataset",
            audioName
        ]
        for name in audioNames {
            if let audioData = NSDataAsset(name: name) {
                print("✅ Found audio data at '\(name)', size: \(audioData.data.count) bytes")
                do {
                    audioPlayer = try AVAudioPlayer(data: audioData.data)
                    audioPlayer?.prepareToPlay()
                    audioPlayer?.volume = 0.8
                    print("🎵 Audio player ready: duration=\(audioPlayer?.duration ?? 0), volume=\(audioPlayer?.volume ?? 0)")
                    return
                } catch {
                    print("❌ Audio player creation failed: \(error)")
                }
            }
        }
        print("❌ Audio asset not found in asset catalog. Tried paths: \(audioNames)")
        
        // List all resources for debugging
        print("📦 Bundle resources:")
        if let resourcePath = Bundle.main.resourcePath {
            do {
                let contents = try FileManager.default.contentsOfDirectory(atPath: resourcePath)
                contents.forEach { print("   📄 \($0)") }
            } catch {
                print("❌ Failed to list bundle contents: \(error)")
            }
        }
    }
    
    private func showNextScene() {
        guard sceneIndex < IntroSequenceConfig.scenes.count else {
            // Sequence complete
            return
        }
        
        isCurrentSceneActive = false
        currentScene = IntroSequenceConfig.scenes[sceneIndex]
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.isCurrentSceneActive = true
        }
        
        sceneIndex += 1
    }
}

// MARK: - Views

struct IntroSequenceView: View {
    @StateObject private var viewModel = IntroSequenceViewModel()
    @Environment(\.dismiss) private var dismiss
    let completion: (() -> Void)?
    
    init(completion: (() -> Void)? = nil) {
        self.completion = completion
    }
    
    var body: some View {
        ZStack {
            // Default white background
            Color.white
                .edgesIgnoringSafeArea(.all)
            
            // Background Video Layer
            if let player = viewModel.videoPlayer {
                VideoPlayer(player: player)
                    .edgesIgnoringSafeArea(.all)
                    .opacity(viewModel.videoOpacity)
            }
            
            // Content Layer
            GeometryReader { geometry in
                ZStack {
                    // Current Scene Content
                    if let currentScene = viewModel.currentScene {
                        switch currentScene.type {
                        case .text(let text):
                            TypewriterText(text: text,
                                         isVisible: viewModel.isCurrentSceneActive,
                                         completion: viewModel.handleSceneCompletion)
                                .font(.custom("PlayfairDisplay-Bold", size: 42))
                                .foregroundColor(.black)
                                .shadow(radius: 0)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal, 40)
                        
                        case .imageStack(let images):
                            ImageStackView(images: images,
                                         isVisible: viewModel.isCurrentSceneActive,
                                         completion: viewModel.handleSceneCompletion)
                        
                        case .imageRotation(let images):
                            ImageRotationView(images: images,
                                            isVisible: viewModel.isCurrentSceneActive,
                                            completion: viewModel.handleSceneCompletion)
                        
                        case .imageFade(let images):
                            ImageFadeView(images: images,
                                        isVisible: viewModel.isCurrentSceneActive,
                                        completion: viewModel.handleSceneCompletion)
                        
                        case .composite(let text, let images):
                            CompositeView(text: text,
                                        images: images,
                                        isVisible: viewModel.isCurrentSceneActive,
                                        completion: viewModel.handleSceneCompletion)
                        
                        case .video:
                            EmptyView()
                        }
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .onAppear {
            viewModel.startSequence()
        }
        .onTapGesture {
            viewModel.stopSequence()
            viewModel.cleanup()
            completion?()
        }
    }
}

// MARK: - Supporting Views

struct TypewriterText: View {
    let text: String
    let isVisible: Bool
    let completion: () -> Void
    
    @State private var displayedText = ""
    @State private var currentIndex = 0
    
    var body: some View {
        Text(displayedText)
            .multilineTextAlignment(.leading)
            .onChange(of: isVisible) { newValue in
                if newValue {
                    startTyping()
                }
            }
    }
    
    private func startTyping() {
        guard currentIndex == 0 else { return }
        
        Timer.scheduledTimer(withTimeInterval: 0.075, repeats: true) { timer in
            if currentIndex < text.count {
                let index = text.index(text.startIndex, offsetBy: currentIndex)
                displayedText += String(text[index])
                currentIndex += 1
                HapticManager.shared.playTypewriterFeedback()
            } else {
                timer.invalidate()
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    completion()
                }
            }
        }
    }
}

struct ImageStackView: View {
    let images: [String]
    let isVisible: Bool
    let completion: () -> Void
    
    @State private var currentImageIndex = 0
    @State private var offset: CGFloat = 1000
    @State private var angle: Double = 15
    
    var body: some View {
        ZStack {
            ForEach(Array(images.enumerated()), id: \.0) { index, imageName in
                Image(imageName)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(height: 300)
                    .opacity(index <= currentImageIndex ? 1 : 0)
                    .offset(x: index <= currentImageIndex ? 0 : offset)
                    .rotationEffect(.degrees(index <= currentImageIndex ? Double(index) * angle : 0))
            }
        }
        .onChange(of: isVisible) { newValue in
            if newValue {
                animateImages()
            }
        }
    }
    
    private func animateImages() {
        guard currentImageIndex == 0 else { return }
        
        for index in 0..<images.count {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 0.5) {
                withAnimation(.spring(response: 0.6, dampingFraction: 0.7)) {
                    currentImageIndex = index
                }
                HapticManager.shared.playImpactFeedback()
                
                if index == images.count - 1 {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                        completion()
                    }
                }
            }
        }
    }
}

// MARK: - Haptic Manager

class HapticManager {
    static let shared = HapticManager()
    
    private let lightGenerator = UIImpactFeedbackGenerator(style: .light)
    private let mediumGenerator = UIImpactFeedbackGenerator(style: .medium)
    private let heavyGenerator = UIImpactFeedbackGenerator(style: .heavy)
    
    private init() {
        lightGenerator.prepare()
        mediumGenerator.prepare()
        heavyGenerator.prepare()
    }
    
    func playTypewriterFeedback() {
        lightGenerator.impactOccurred()
    }
    
    func playImpactFeedback() {
        mediumGenerator.impactOccurred()
    }
    
    func playHeavyFeedback() {
        heavyGenerator.impactOccurred()
    }
}
