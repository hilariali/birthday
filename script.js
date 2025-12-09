// Blow out candle feature using microphone
let audioContext;
let analyser;
let microphone;
let isBlownOut = false;

$(document).ready(function() {
    console.log('Happy Birthday Ms Charlotte! 🎂');
    
    // Need user interaction for audio - play on first click anywhere
    let hasPlayed = false;
    $(document).one('click touchstart', function() {
        if (!hasPlayed) {
            hasPlayed = true;
            playBirthdaySong();
        }
    });
    
    // Auto-trigger after a moment (may not work due to browser autoplay policy)
    setTimeout(() => {
        if (!hasPlayed) {
            playBirthdaySong();
            hasPlayed = true;
        }
    }, 100);
    
    // Show blow instruction and enable microphone after cake finishes stacking
    setTimeout(() => {
        initMicrophone();
    }, 6500);
});

function playBirthdaySong() {
    try {
        console.log('🎵 Starting birthday song...');
        
        // Create a simple celebratory melody using Web Audio API
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume audio context if suspended (browser autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                console.log('Audio context resumed');
            });
        }
        
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
        
        let currentTime = audioCtx.currentTime + 0.1; // Small delay to ensure audio context is ready
        
        notes.forEach(note => {
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
            
            currentTime += note.duration;
        });
        
        console.log('🎵 Birthday song scheduled to play');
    } catch (error) {
        console.error('Error playing birthday song:', error);
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
        // Fallback: allow spacebar to blow out candle
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
            
            // Set adaptive threshold: baseline + 70 (if baseline is 10, threshold is 80; if baseline is 30, threshold is 100, etc.)
            dynamicThreshold = baselineNoise + 70;
            
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
