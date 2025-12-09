// Blow out candle feature using microphone
let audioContext;
let analyser;
let microphone;
let isBlownOut = false;

$(document).ready(function() {
    console.log('Happy Birthday Ms Charlotte! 🎂');
    
    // Wait for candle to appear before enabling blow detection
    setTimeout(() => {
        initMicrophone();
    }, 6500); // Start after candle and flame appear
});

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
        if (average > 15) { // Lowered threshold for more sensitivity
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
