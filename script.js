// Create geometric confetti
function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#ff9ff3'];
    const shapes = ['circle', 'square', 'triangle', 'star'];
    
    for (let i = 0; i < 50; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 15 + 5;
        
        const confetti = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        confetti.setAttribute('class', 'confetti');
        confetti.setAttribute('width', size);
        confetti.setAttribute('height', size);
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        let shapeElement;
        if (shape === 'circle') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapeElement.setAttribute('cx', size/2);
            shapeElement.setAttribute('cy', size/2);
            shapeElement.setAttribute('r', size/2);
        } else if (shape === 'square') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapeElement.setAttribute('width', size);
            shapeElement.setAttribute('height', size);
        } else if (shape === 'triangle') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapeElement.setAttribute('points', `${size/2},0 ${size},${size} 0,${size}`);
        } else if (shape === 'star') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapeElement.setAttribute('points', `${size/2},0 ${size*0.6},${size*0.4} ${size},${size*0.4} ${size*0.7},${size*0.65} ${size*0.8},${size} ${size/2},${size*0.75} ${size*0.2},${size} ${size*0.3},${size*0.65} 0,${size*0.4} ${size*0.4},${size*0.4}`);
        }
        
        shapeElement.setAttribute('fill', color);
        confetti.appendChild(shapeElement);
        confettiContainer.appendChild(confetti);
    }
}

// Create geometric particles
function createGeometricParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    const shapes = [
        { type: 'circle', size: 30 },
        { type: 'square', size: 25 },
        { type: 'triangle', size: 28 },
        { type: 'hexagon', size: 26 }
    ];
    const colors = ['#ffffff', '#ffeb3b', '#4ecdc4', '#ff6b9d', '#9dd9ff'];
    
    for (let i = 0; i < 20; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = shape.size + Math.random() * 10;
        
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        particle.setAttribute('class', 'particle');
        particle.setAttribute('width', size);
        particle.setAttribute('height', size);
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        let shapeElement;
        if (shape.type === 'circle') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shapeElement.setAttribute('cx', size/2);
            shapeElement.setAttribute('cy', size/2);
            shapeElement.setAttribute('r', size/2);
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', '2');
            shapeElement.setAttribute('fill', 'none');
        } else if (shape.type === 'square') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shapeElement.setAttribute('width', size);
            shapeElement.setAttribute('height', size);
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', '2');
            shapeElement.setAttribute('fill', 'none');
        } else if (shape.type === 'triangle') {
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapeElement.setAttribute('points', `${size/2},0 ${size},${size} 0,${size}`);
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', '2');
            shapeElement.setAttribute('fill', 'none');
        } else if (shape.type === 'hexagon') {
            const cx = size/2;
            const cy = size/2;
            const r = size/2;
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
            }
            shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            shapeElement.setAttribute('points', points.join(' '));
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('stroke-width', '2');
            shapeElement.setAttribute('fill', 'none');
        }
        
        particle.appendChild(shapeElement);
        particlesContainer.appendChild(particle);
    }
}

// Create animated geometric background
function createGeometricBackground() {
    const svg = document.querySelector('.geometric-bg');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    // Create animated lines
    for (let i = 0; i < 15; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', Math.random() * width);
        line.setAttribute('y1', Math.random() * height);
        line.setAttribute('x2', Math.random() * width);
        line.setAttribute('y2', Math.random() * height);
        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        line.setAttribute('stroke-width', '1');
        
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'opacity');
        animate.setAttribute('values', '0;0.3;0');
        animate.setAttribute('dur', (Math.random() * 3 + 2) + 's');
        animate.setAttribute('repeatCount', 'indefinite');
        
        line.appendChild(animate);
        svg.appendChild(line);
    }
    
    // Create circles
    for (let i = 0; i < 10; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', Math.random() * width);
        circle.setAttribute('cy', Math.random() * height);
        circle.setAttribute('r', Math.random() * 50 + 20);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
        circle.setAttribute('stroke-width', '2');
        
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', '20;80;20');
        animate.setAttribute('dur', (Math.random() * 4 + 3) + 's');
        animate.setAttribute('repeatCount', 'indefinite');
        
        circle.appendChild(animate);
        svg.appendChild(circle);
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
    createGeometricBackground();
    createGeometricParticles();
    setTimeout(createConfetti, 3000);
});

// Blow out candles on spacebar press
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        const flames = document.querySelectorAll('.flame');
        flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.style.opacity = '0';
                flame.style.transform = 'scale(0)';
                flame.style.transition = 'all 0.5s ease-out';
            }, index * 100);
        });
        
        // Show celebration message with geometric effect
        setTimeout(() => {
            const message = document.createElement('div');
            message.innerHTML = '<span style="font-size: 48px; font-weight: bold; color: #ffd700; text-shadow: 0 0 20px rgba(255,215,0,0.8);">✨ Make a Wish! ✨</span>';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 36px;
                color: white;
                text-shadow: 0 0 20px rgba(255,255,255,0.8);
                z-index: 1000;
                animation: wishPop 1s ease-out;
            `;
            
            const wishStyle = document.createElement('style');
            wishStyle.textContent = `
                @keyframes wishPop {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(wishStyle);
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
        }, 500);
    }
});
