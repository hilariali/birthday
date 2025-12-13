// YouTube Player
let player;
let videoEnded = false;

// YouTube Video ID - You can change this to any YouTube video ID
const YOUTUBE_VIDEO_ID = '8ZX-5AljvyY';

// This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    // When video ends (state 0)
    if (event.data === YT.PlayerState.ENDED) {
        startBirthdayExperience();
    }
}

// Skip button functionality
document.addEventListener('DOMContentLoaded', function() {
    const skipButton = document.getElementById('skipButton');
    if (skipButton) {
        skipButton.addEventListener('click', startBirthdayExperience);
    }
});

function startBirthdayExperience() {
    if (videoEnded) return; // Prevent multiple calls
    videoEnded = true;
    
    // Hide video container
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.style.transition = 'opacity 1s';
    videoContainer.style.opacity = '0';
    
    setTimeout(() => {
        videoContainer.style.display = 'none';
        
        // Show birthday content
        const birthdayContent = document.getElementById('birthdayContent');
        birthdayContent.style.display = 'block';
        
        // Start the cake animation after video ends
        setTimeout(() => {
            const cakeAnimation = document.getElementById('bizcocho_1');
            
            if (cakeAnimation) {
                cakeAnimation.beginElement();
                
                // Trigger candle animation after cake is fully built
                // Total cake animation time: bizcocho_1(0.8s) + relleno_1(0.5s) + bizcocho_2(0.5s) + relleno_2(0.5s) + bizcocho_3(0.3s) + crema(2s) = 4.6s
                setTimeout(() => {
                    const candle = document.querySelector('.candle');
                    if (candle) {
                        candle.classList.add('animate');
                    }
                }, 4600);
            }
        }, 500);
        
        // Initialize birthday experience
        initBirthdayPage();
    }, 1000);
}

// Blow out candle feature using microphone
let audioContext;
let analyser;
let microphone;
let isBlownOut = false;

function initBirthdayPage() {
    console.log('Happy Birthday Ms Charlotte! 🎂');
    
    let hasStarted = false;
    
    // Show a simple instruction overlay
    const overlay = $('<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 1.5em; font-family: Lato, sans-serif; text-align: center; z-index: 9999; text-shadow: 0 0 10px rgba(0,0,0,0.5);">👆 Click anywhere to start 🎵</div>');
    $('body').append(overlay);
    
    // Play song on first click/touch anywhere
    $(document).one('click touchstart', function() {
        if (!hasStarted) {
            hasStarted = true;
            overlay.fadeOut(500, function() { $(this).remove(); });
            playBirthdaySong();
        }
    });
    
    // Show blow instruction and enable microphone after cake finishes stacking
    setTimeout(() => {
        initMicrophone();
    }, 6500);
}

$(document).ready(function() {
    // YouTube player will handle initialization
    // Birthday page content is hidden until video ends or is skipped
});

function playBirthdaySong() {
    try {
        console.log('🎵 Starting birthday song...');
        
        // Create a simple celebratory melody using Web Audio API
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        console.log('Audio context state:', audioCtx.state);
        console.log('Audio context sample rate:', audioCtx.sampleRate);
        
        // Resume audio context if suspended (browser autoplay policy)
        if (audioCtx.state === 'suspended') {
            console.log('Resuming suspended audio context...');
            audioCtx.resume().then(() => {
                console.log('✅ Audio context resumed successfully');
            }).catch(err => {
                console.error('Failed to resume audio context:', err);
            });
        }
        
        // Wait a moment for context to be ready
        setTimeout(() => {
            console.log('Audio context final state:', audioCtx.state);
            
            // Happy Birthday melody (complete version, louder)
            const notes = [
                {freq: 261.63, duration: 0.4}, // C - Happy
                {freq: 261.63, duration: 0.4}, // C - birth-
                {freq: 293.66, duration: 0.8}, // D - day
                {freq: 261.63, duration: 0.8}, // C - to
                {freq: 349.23, duration: 0.8}, // F - you
                {freq: 329.63, duration: 1.6}, // E
                
                {freq: 261.63, duration: 0.4}, // C - Happy
                {freq: 261.63, duration: 0.4}, // C - birth-
                {freq: 293.66, duration: 0.8}, // D - day
                {freq: 261.63, duration: 0.8}, // C - to
                {freq: 392.00, duration: 0.8}, // G - you
                {freq: 349.23, duration: 1.6}, // F
                
                {freq: 261.63, duration: 0.4}, // C - Happy
                {freq: 261.63, duration: 0.4}, // C - birth-
                {freq: 523.25, duration: 0.8}, // C5 - day
                {freq: 440.00, duration: 0.8}, // A - dear
                {freq: 349.23, duration: 0.8}, // F - [name]
                {freq: 329.63, duration: 0.8}, // E
                {freq: 293.66, duration: 1.6}, // D
                
                {freq: 466.16, duration: 0.4}, // Bb - Happy
                {freq: 466.16, duration: 0.4}, // Bb - birth-
                {freq: 440.00, duration: 0.8}, // A - day
                {freq: 349.23, duration: 0.8}, // F - to
                {freq: 392.00, duration: 0.8}, // G - you
                {freq: 349.23, duration: 1.6}  // F
            ];
            
            let currentTime = audioCtx.currentTime + 0.2; // Longer delay to ensure audio context is ready
            
            console.log('Playing', notes.length, 'notes starting at', currentTime);
            
            notes.forEach((note, index) => {
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                oscillator.frequency.value = note.freq;
                oscillator.type = 'sine';
                
                // Increased volume to 0.8 for better audibility
                gainNode.gain.setValueAtTime(0.8, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                if (index === 0) {
                    console.log('🎶 First note playing at', currentTime, 'Hz:', note.freq);
                }
                
                currentTime += note.duration;
            });
            
            console.log('🎵 Birthday song scheduled to play until', currentTime);
        }, 100);
    } catch (error) {
        console.error('❌ Error playing birthday song:', error);
    }
}

async function initMicrophone() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        microphone.connect(analyser);
        
        // Calibrate background noise before starting detection
        calibrateBackgroundNoise();
        
        console.log('🎤 Microphone ready! Calibrating background noise...');
    } catch (error) {
        console.error('Microphone access denied:', error);
        enableSpacebarFallback();
    }
}

let baselineNoise = 0;
let dynamicThreshold = 120;

function calibrateBackgroundNoise() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const samples = [];
    let sampleCount = 0;
    const maxSamples = 30; // Collect 30 samples over ~1 second
    
    function collectSample() {
        if (sampleCount >= maxSamples) {
            // Calculate average baseline noise
            baselineNoise = samples.reduce((a, b) => a + b, 0) / samples.length;
            
            // Set adaptive threshold: baseline + 80 (if baseline is 20, threshold is 100; if baseline is 30, threshold is 110, etc.)
            dynamicThreshold = baselineNoise + 80;
            
            console.log(`📊 Background noise: ${baselineNoise.toFixed(2)}, Threshold set to: ${dynamicThreshold.toFixed(2)}`);
            
            // Start blow detection
            detectBlow();
            return;
        }
        
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        samples.push(average);
        sampleCount++;
        
        setTimeout(collectSample, 30); // Sample every 30ms
    }
    
    collectSample();
}

function detectBlow() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function checkAudioLevel() {
        if (isBlownOut) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        
        // Log audio level for debugging
        console.log('Audio level:', average, '| Threshold:', dynamicThreshold.toFixed(2));
        
        // Use dynamic threshold based on background noise
        if (average > dynamicThreshold) {
            blowOutCandle();
        } else {
            requestAnimationFrame(checkAudioLevel);
        }
    }
    
    checkAudioLevel();
}

function blowOutCandle() {
    if (isBlownOut) return;
    
    isBlownOut = true;
    console.log('🎉 Candle blown out!');
    
    // Add class to trigger blow out animation
    $('.candle').addClass('blown-out');
    
    // Stop microphone
    if (microphone) {
        microphone.disconnect();
    }
    if (audioContext) {
        audioContext.close();
    }
    
    // Show celebration message
    setTimeout(() => {
        const message = $('<div class="celebration-message">✨ Make a Wish! ✨<br><span style="font-size: 0.6em;">Happy Birthday Ms Charlotte!</span></div>');
        $('body').append(message);
        
        // Remove message after 4 seconds
        setTimeout(() => {
            message.fadeOut(500, function() {
                $(this).remove();
            });
        }, 4000);
    }, 500);
}

// Fallback for browsers that don't support microphone or user denies access
function enableSpacebarFallback() {
    console.log('⌨️ Press SPACEBAR to blow out the candle');
    
    $('.blow-instruction p').html('⌨️ Press SPACEBAR to blow out the candle!');
    
    $(document).on('keydown', function(e) {
        if (e.code === 'Space' || e.keyCode === 32) {
            e.preventDefault();
            blowOutCandle();
        }
    });
}
