import Foundation
import SwiftUI
import AVFoundation

// MARK: - Types

/// Represents a single scene in the intro sequence
struct IntroScene {
    /// Unique identifier for the scene
    let id: String
    
    /// Duration of the scene in seconds
    let duration: TimeInterval
    
    /// Type of scene content
    let type: SceneType
    
    /// Assets required for the scene
    let assets: SceneAssets
    
    /// Animation configuration
    let animation: AnimationConfig
    
    /// Haptic feedback pattern
    let haptics: HapticPattern?
}

/// Types of scenes available in the intro
enum SceneType {
    case text(String)           // Simple text overlay
    case imageStack([String])   // Multiple images stacked (e.g., Jordan photos)
    case imageRotation([String]) // Horizontally rotating images
    case imageFade([String])    // Cross-fading images
    case composite(text: String, images: [String]) // Text with image background
    case video(String)          // Video background
}

/// Assets required for a scene
struct SceneAssets {
    /// Image assets (if any)
    let images: [String]?
    
    /// Video asset URL (if any)
    let videoURL: URL?
    
    /// Audio asset URL (if any)
    let audioURL: URL?
}

/// Configuration for animations
struct AnimationConfig {
    /// Type of animation to perform
    let type: AnimationType
    
    /// Duration of the animation
    let duration: TimeInterval
    
    /// Timing curve for the animation
    let curve: CAMediaTimingFunction
    
    /// Delay before starting the animation
    let delay: TimeInterval
}

/// Available animation types
enum AnimationType {
    case typewriter          // Typing effect with cursor
    case stackWithAngle     // 3D stacking with rotation
    case horizontalRotation // Carousel-style rotation
    case crossFade         // Smooth fade between elements
    case slideUp           // Vertical slide animation
    case flash            // Camera flash effect
    case rapidSequence    // Quick succession of elements
    case fade
}

/// Haptic feedback patterns
enum HapticPattern {
    case typing           // Subtle feedback for text typing
    case transition      // Scene transition feedback
    case impact         // Strong impact for dramatic moments
    case none          // No haptic feedback
    case success
    case subtle
}

// MARK: - Configuration

/// Configuration for the entire intro sequence
struct IntroSequenceConfig {
    /// Background video and music configuration
    static let backgroundAssets = BackgroundAssets(
        videoURL: "intro_background",
        musicURL: "intro_music"
    )
    
    /// Complete sequence of scenes
    static let scenes: [IntroScene] = [
        // Scene 1: "Legacy"
        IntroScene(
            id: "legacy",
            duration: 4.0,
            type: .text("Legacy"),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 1.0,
                curve: CAMediaTimingFunction(name: .default),
                delay: 0.0
            ),
            haptics: .subtle
        ),
        
        // Scene 2: Jordan Photo Montage
        IntroScene(
            id: "jordan_montage",
            duration: 3.0,
            type: .imageStack([
                "jordan1",
                "jordan2",
                "jordan3"
            ]),
            assets: SceneAssets(
                images: [
                    "jordan1",
                    "jordan2",
                    "jordan3"
                ],
                videoURL: nil,
                audioURL: nil
            ),
            animation: AnimationConfig(
                type: .stackWithAngle,
                duration: 0.8,
                curve: CAMediaTimingFunction(name: .easeOut),
                delay: 0.2
            ),
            haptics: .impact
        ),
        
        // Scene 3: "We know what it looks like"
        IntroScene(
            id: "looks_like",
            duration: 2.5,
            type: .text("We know what it\nlooks like"),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 2.0,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.3
            ),
            haptics: .typing
        ),
        
        // Scene 4: Montage 2 (Horizontal Rotation)
        IntroScene(
            id: "montage2",
            duration: 3.0,
            type: .imageRotation([
                "montage1_1",
                "montage1_2",
                "montage1_3"
            ]),
            assets: SceneAssets(
                images: [
                    "montage1_1",
                    "montage1_2",
                    "montage1_3"
                ],
                videoURL: nil,
                audioURL: nil
            ),
            animation: AnimationConfig(
                type: .horizontalRotation,
                duration: 2.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.0
            ),
            haptics: .transition
        ),
        
        // Scene 5: "We know what it feels like"
        IntroScene(
            id: "feels_like",
            duration: 2.5,
            type: .text("We know what it\nfeels like"),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 2.0,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.3
            ),
            haptics: .typing
        ),
        
        // Scene 6: Montage 3 (Cross Fade)
        IntroScene(
            id: "montage3",
            duration: 3.0,
            type: .imageFade([
                "montage2_1",
                "montage2_2",
                "montage2_3"
            ]),
            assets: SceneAssets(
                images: [
                    "montage2_1",
                "montage2_2",
                "montage2_3"
                ],
                videoURL: nil,
                audioURL: nil
            ),
            animation: AnimationConfig(
                type: .crossFade,
                duration: 2.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.0
            ),
            haptics: .transition
        ),
        
        // Scene 7: "We know what it takes to build"
        IntroScene(
            id: "takes_to_build",
            duration: 2.5,
            type: .text("We know what it\ntakes to build"),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 2.0,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.3
            ),
            haptics: .typing
        ),
        
        // Scene 8: Montage 4
        IntroScene(
            id: "montage4",
            duration: 3.0,
            type: .imageRotation([
                "montage3_1",
                "montage3_2",
                "montage3_3"
            ]),
            assets: SceneAssets(
                images: [
                    "montage3_1",
                    "montage3_2",
                    "montage3_3"
                ],
                videoURL: nil,
                audioURL: nil
            ),
            animation: AnimationConfig(
                type: .horizontalRotation,
                duration: 2.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.0
            ),
            haptics: .transition
        ),
        
        // Scene 9: "But what if..."
        IntroScene(
            id: "what_if",
            duration: 2.0,
            type: .text("But what if..."),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 1.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.3
            ),
            haptics: .typing
        ),
        
        // Scene 10: Rapid Text Rotation
        IntroScene(
            id: "rapid_sequence",
            duration: 5.0,
            type: .composite(
                text: "But what if...\nwe never heard the stories?\nBut what if...\nwe never wrote it down?\nBut what if...\nwe lost the memories?\nBut what if...\nno one remembered?",
                images: [
                    "legacy_1",
                    "legacy_2",
                    "legacy_3",
                    "legacy_4"
                ]
            ),
            assets: SceneAssets(
                images: [
                    "legacy_1",
                    "legacy_2",
                    "legacy_3",
                    "legacy_4"
                ],
                videoURL: nil,
                audioURL: nil
            ),
            animation: AnimationConfig(
                type: .rapidSequence,
                duration: 4.0,
                curve: CAMediaTimingFunction(name: .easeIn),
                delay: 0.0
            ),
            haptics: .impact
        ),
        
        // Scene 11: "It would all be forgotten"
        IntroScene(
            id: "forgotten",
            duration: 3.0,
            type: .text("It would all be\nforgotten"),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 2.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.3
            ),
            haptics: .typing
        ),
        
        // Scene 12: "Preserve your legacy"
        IntroScene(
            id: "preserve",
            duration: 3.0,
            type: .text("Preserve your legacy"),
            assets: SceneAssets(images: nil, videoURL: nil, audioURL: nil),
            animation: AnimationConfig(
                type: .typewriter,
                duration: 2.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.3
            ),
            haptics: .typing
        ),
        
        // Final Scene: "Legacy AI"
        IntroScene(
            id: "app_title",
            duration: 4.0,
            type: .text("Legacy AI"),
            assets: SceneAssets(
                images: [],
                videoURL: nil,
                audioURL: nil
            ),
            animation: AnimationConfig(
                type: .fade,
                duration: 1.5,
                curve: CAMediaTimingFunction(name: .easeInEaseOut),
                delay: 0.0
            ),
            haptics: .success
        )
    ]
}

/// Background assets configuration
struct BackgroundAssets {
    let videoURL: String
    let musicURL: String
}
