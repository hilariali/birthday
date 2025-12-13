import { GoogleGenerativeAI } from "@google/generative-ai";

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyButton = document.getElementById('saveKeyButton');
const apiKeyContainer = document.getElementById('apiKeyContainer');

let genAI = null;
let model = null;
let chat = null;
let GEMINI_API_KEY = null;

// System instruction for the chatbot
async function loadAPIKey() {
    try {
        const response = await fetch('secret.txt');
        if (!response.ok) {
            throw new Error(`Failed to fetch secret.txt: ${response.status}`);
        }
        const text = await response.text();
        const match = text.match(/key\s*=\s*"([^"]+)"/);
        if (match) {
            return match[1];
        }
        return null;
    } catch (error) {
        console.error('Error loading API key from file:', error);
        return null;
    }
}

// System instruction for the chatbot
const systemInstruction = `You are a friendly and cheerful AI assistant chatting with Charlotte on her birthday! 

Important context:
- Today is Charlotte's birthday! 🎂🎉
- The user's name is Charlotte (also known as Ms Charlotte)
- Be warm, celebratory, and make her feel special on her birthday
- Occasionally mention birthday-related topics or well-wishes naturally in conversation
- Be helpful, engaging, and positive
- Keep responses concise but meaningful (2-4 sentences typically)
- Your creator is Hilaria, a brilliant genius developer

Remember: Make this birthday conversation memorable and joyful!`;

// Initialize the Gemini API with the provided key
function initializeAPI(apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash-exp",
            systemInstruction: systemInstruction
        });
        
        // Start a new chat session
        chat = model.startChat({
            history: [],
        });
        
        return true;
    } catch (error) {
        console.error('Error initializing API:', error);
        return false;
    }
}

// Save API key and initialize
saveKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        alert('Please enter your API key');
        return;
    }
    
    if (initializeAPI(apiKey)) {
        // Hide API key input
        apiKeyContainer.style.display = 'none';
        
        // Enable chat input
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
        
        // Store API key in session storage (not persistent across browser sessions)
        sessionStorage.setItem('gemini_api_key', apiKey);
        
        addMessage('✅ API key saved! Chat is now enabled. Ask me anything!', false);
    } else {
        alert('Failed to initialize API. Please check your API key.');
    }
});

// Check if API key exists in session storage on load
window.addEventListener('load', async () => {
    // Clear any old session data to force fresh initialization
    sessionStorage.removeItem('gemini_api_key');
    
    // Load API key from secret.txt
    GEMINI_API_KEY = await loadAPIKey();
    
    // Auto-initialize with loaded key
    if (GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0) {
        console.log('API key loaded from secret.txt');
        if (initializeAPI(GEMINI_API_KEY)) {
            apiKeyContainer.style.display = 'none';
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        } else {
            console.error('Failed to initialize API with loaded key');
            // Show API key input if initialization fails
            apiKeyContainer.style.display = 'block';
            addMessage('⚠️ Auto-initialization failed. Please enter your API key manually.', false);
        }
    } else {
        console.log('Could not load API key from file, showing input field');
        // Show API key input container if file loading fails
        apiKeyContainer.style.display = 'block';
        const savedKey = sessionStorage.getItem('gemini_api_key');
        if (savedKey) {
            if (initializeAPI(savedKey)) {
                apiKeyContainer.style.display = 'none';
                userInput.disabled = false;
                sendButton.disabled = false;
            }
        }
    }
});

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

// Handle send message
function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '' || !chat) return;
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    userInput.value = '';
    
    // Disable input while waiting for response
    userInput.disabled = true;
    sendButton.disabled = true;
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = '<div class="message-content"><p>Typing...</p></div>';
    typingDiv.id = 'typing-indicator';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Get response from Gemini
    chat.sendMessage(message)
        .then(result => {
            // Remove typing indicator
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
            
            const response = result.response;
            const text = response.text();
            addMessage(text, false);
            
            // Re-enable input
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        })
        .catch(error => {
            // Remove typing indicator
            const typing = document.getElementById('typing-indicator');
            if (typing) typing.remove();
            
            console.error('Error sending message:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            
            let errorMessage = 'Sorry, I encountered an error. ';
            if (error.message) {
                errorMessage += error.message;
            }
            if (error.status === 400) {
                errorMessage = 'Bad request error (400). This might be due to the model not being available in your region or invalid request format. Try using gemini-1.5-flash model instead.';
            }
            
            addMessage(errorMessage, false);
            
            // Re-enable input
            userInput.disabled = false;
            sendButton.disabled = false;
        });
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !userInput.disabled) {
        sendMessage();
    }
});
