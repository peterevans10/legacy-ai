// Types for the cinematic intro sequence

import Foundation
import SwiftUI
import AVFoundation

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
}

/// Haptic feedback patterns
enum HapticPattern {
    case typing           // Subtle feedback for text typing
    case transition      // Scene transition feedback
    case impact         // Strong impact for dramatic moments
    case none          // No haptic feedback
}

/// Main controller for the intro sequence
protocol IntroSequenceController {
    /// Start playing the intro sequence
    func play()
    
    /// Skip to the end of the sequence
    func skip()
    
    /// Preload all required assets
    func preloadAssets() async
    
    /// Clean up resources
    func cleanup()
}
