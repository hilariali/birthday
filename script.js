// Create confetti animation
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#ff9ff3'];
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
}

// Play birthday music sound (optional - would need audio file)
function playBirthdaySound() {
    // You can add an audio element and play birthday music here
    // const audio = new Audio('birthday-song.mp3');
    // audio.play();
}

// Add sparkle effect on click
document.addEventListener('click', (e) => {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.backgroundColor = '#fff';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'sparkle 0.6s ease-out';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 600);
});

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(3) rotate(180deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animations
window.addEventListener('load', () => {
    setTimeout(createConfetti, 3000); // Start confetti after cake is built
    
    // Add continuous wave effect to birthday text
    const text = document.querySelector('.birthday-text');
    setInterval(() => {
        text.style.transform = 'scale(1.05)';
        setTimeout(() => {
            text.style.transform = 'scale(1)';
        }, 200);
    }, 2000);
});

// Blow out candles on spacebar press
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        const flames = document.querySelectorAll('.flame');
        flames.forEach(flame => {
            flame.style.animation = 'blowOut 0.5s forwards';
        });
        
        // Add blow out animation
        const blowOutStyle = document.createElement('style');
        blowOutStyle.textContent = `
            @keyframes blowOut {
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px) scale(0);
                }
            }
        `;
        document.head.appendChild(blowOutStyle);
        
        // Show celebration message
        setTimeout(() => {
            const message = document.createElement('div');
            message.textContent = 'Make a wish! ✨';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 36px;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                animation: fadeInUp 1s ease-out;
            `;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
        }, 500);
    }
});
