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
    // Create a simple celebratory melody using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
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
    
    let currentTime = audioCtx.currentTime;
    
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
    
    console.log('🎵 Playing birthday song...');
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
        
        // Start detecting blow
        detectBlow();
        
        console.log('🎤 Microphone ready! Blow to extinguish the candle.');
    } catch (error) {
        console.error('Microphone access denied:', error);
        // Fallback: allow spacebar to blow out candle
        enableSpacebarFallback();
    }
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
        console.log('Audio level:', average);
        
        // If volume is high enough (user is blowing), extinguish candle
        if (average > 120) { // Threshold set to 120
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
