const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Predefined responses for the chatbot
const responses = {
    greetings: [
        "Hello! How are you today?",
        "Hi there! Nice to see you!",
        "Hey! What's up?",
        "Greetings! How can I help you?"
    ],
    farewell: [
        "Goodbye! Have a great day!",
        "See you later!",
        "Take care! Come back soon!",
        "Bye! It was nice chatting with you!"
    ],
    thanks: [
        "You're welcome! 😊",
        "Happy to help!",
        "No problem at all!",
        "My pleasure!"
    ],
    birthday: [
        "Happy Birthday! 🎂 Hope you have an amazing day!",
        "Wishing you the best birthday ever! 🎉",
        "Have a wonderful birthday celebration! 🎈",
        "Many happy returns! May all your wishes come true! ✨"
    ],
    default: [
        "That's interesting! Tell me more.",
        "I see! What else would you like to talk about?",
        "Interesting point! Anything else on your mind?",
        "Got it! What else can I help you with?",
        "I understand. Is there anything specific you'd like to know?",
        "That's a great question! I'm here to chat and help however I can."
    ]
};

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get bot response based on user input
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for greetings
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
        return getRandomResponse(responses.greetings);
    }
    
    // Check for farewell
    if (message.match(/(bye|goodbye|see you|farewell|take care)/)) {
        return getRandomResponse(responses.farewell);
    }
    
    // Check for thanks
    if (message.match(/(thank|thanks|thx|appreciate)/)) {
        return getRandomResponse(responses.thanks);
    }
    
    // Check for birthday related
    if (message.match(/(birthday|bday|celebration)/)) {
        return getRandomResponse(responses.birthday);
    }
    
    // Check for name questions
    if (message.match(/(what is your name|who are you|your name)/)) {
        return "I'm your friendly chatbot assistant! You can call me ChatBot. 🤖";
    }
    
    // Check for how are you
    if (message.match(/(how are you|how do you do|how's it going)/)) {
        return "I'm doing great, thank you for asking! How about you?";
    }
    
    // Check for help
    if (message.match(/(help|assist|support)/)) {
        return "I'm here to chat with you! Try asking me about birthdays, or just have a friendly conversation. 😊";
    }
    
    // Check for time
    if (message.match(/(what time|current time|time is it)/)) {
        const now = new Date();
        return `The current time is ${now.toLocaleTimeString()}. 🕐`;
    }
    
    // Check for date
    if (message.match(/(what date|today's date|current date)/)) {
        const now = new Date();
        return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`;
    }
    
    // Default response
    return getRandomResponse(responses.default);
}

// Get random response from array
function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Handle send message
function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator (optional enhancement)
    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, false);
    }, 500);
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Focus on input when page loads
userInput.focus();
