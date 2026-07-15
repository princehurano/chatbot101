// serve ni sha as database sa mga keywords
const keywordResponses = {
    enrollment: {
        keywords: ['enrollment', 'enroll', 'register', 'sign up', 'join'],
        response: 'For enrollment, please visit our admissions office or fill out the online form on our website. Enrollment typically opens in May for the upcoming school year. Do you have any specific questions about the enrollment process?'
    },
    admission: {
        keywords: ['admission', 'admit', 'apply', 'application'],
        response: 'Our admission process requires a completed application form, academic transcripts, and a personal statement. The application deadline is usually June 15th. Would you like more details about any specific requirement?'
    },
    tuition: {
        keywords: ['tuition', 'fees', 'cost', 'price', 'pay', 'payment'],
        response: "Dipindi saimong budget"
    },
    schedule: {
        keywords: ['schedule', 'class', 'timetable', 'timing', 'hours', 'time'],
        response: 'School hours are 8:00 AM to 5 PM, Monday through Friday. Classes run in 45-minute periods with a 30-minute lunch break at noon. Special schedules apply on Fridays when early dismissal is at 2:40 PM. Any other scheduling questions?'
    },
    registrar: {
        keywords: ['registrar', 'records', 'transcript', 'certificate', 'document'],
        response: 'The Registrar\'s Office handles all student records, transcripts, and certificates. You can visit them in Building A, Room 101, or call (555) 123-4567. Office hours are 9 AM - 4 PM, Monday to Friday.'
    },
    scholarship: {
        keywords: ['scholarship', 'financial aid', 'grant', 'bursary', 'fund'],
        response: 'We offer various scholarships including merit-based, need-based, and sports scholarships. The scholarship application period opens in March. Applicants must maintain a 3.0 GPA or higher. Contact our Financial Aid office for detailed eligibility criteria.'
    },
    try: {
        keywords: ['ethan', 'prince', 'lloyd', 'fritz', 'bea', 'dirk'],
        response: "HOAYYYYYYYYYYYYYY! PAPWET YARN?"
    },
     pangutana: {
        keywords: ['pangutana', 'mangutana'],
        response: "Unsa man?"
    },
     students: {
        keywords: ['students', 'estudyante'],
        response: "Didto k4h Mangut4na sa porpis dol,,, ay4w kog Gara garae dol.,, ego ka ani Akung kinumo henuktok jod kaH...."
    },
    about: {
        keywords: ['about', 'About'],
        response: `This is a DESIGN AND DEVELOPMENT OF A KEYWORD-BASED CHATBOT FOR SCHOOL INQUIRIES.
        
        Mao ni nga problems akong nakita that's why I think of this 

Problem 1: Students have difficulty obtaining school information quickly, especially outside office hours.

Problem 2: Students who commute may spend time and money traveling to the school just to ask simple questions.

Problem 3: Administrative staff repeatedly answer the same frequently asked questions, increasing their workload.

Problem 4: There is no centralized, automated inquiry system that provides immediate access to official school information.`
    },

    requirements: {
        keywords: ['requirements', 'requirement', 'needed', 'need', 'necessary', 'document', 'documents'],
        response: 'Admission requirements include: 1) Completed application form, 2) Birth certificate, 3) Previous school report card, 4) Vaccination records, 5) Parent/guardian identification. Additional requirements may apply based on grade level.'
    },
    vision: {
        keywords: ['Vision', 'vision'],
        response: "We, the Ignacian Marian community, witness the loving compassion of Jesus. We open new horizons with hope of nurturing learners to be humble and globally competent leaders grounded in solidarity and committed to social renewal for the common good."
    },
    mission: {
        keywords: ['Mission', 'mission'],
        response: `We commit ourselves to: 

1.) Grow deeper in discernment and interior freedom to be prophets of hope in today’s world;

2.) Continuously form Ignacian Marian leaders who witness to faith, excellence and service in varied socio-cultural settings;

3.) Constantly pursue innovative programs, approaches, and educational strategies to develop world-class professionals;

4.) Build up resources and capabilities to respond to  contemporary issues towards enhancement of quality of life; and

5.) Expand our educational thrust for the poor.`
    },
    contact: {
        keywords: ['contact', 'phone', 'email', 'address', 'office', 'call', 'reach', 'message'],
        response: 'School Contact Information:\n📍 Address: Capistrano St, Cagayan De Oro City, 9000\n📞 Phone: +63 (977) 108 7317\n📧 Email: lc@lccdo.edu.ph Office Hours: Monday to Friday 8:00 AM to 5PM - Saturday 8AM - 12NN'
    }
};

// ===== DOM ELEMENTS =====
// Get references to HTML elements we'll interact with
const chatDisplay = document.getElementById('chatDisplay');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const quickTopics = document.getElementById('quickTopics');

// ===== UI-ONLY ELEMENTS (theme, settings, splash) =====
const splash = document.getElementById('splash');
const themeToggle = document.getElementById('themeToggle');
const moreBtn = document.getElementById('moreBtn');
const settingsPanel = document.getElementById('settingsPanel');
const segBtns = document.querySelectorAll('.seg-btn');
const typingFxToggle = document.getElementById('typingFxToggle');

// ===== SETTINGS FOR TYPING EFFECT =====
// Adjust these numbers to make the bot type faster or slower
const TYPING_SPEED_MS = 15;        // delay between each letter (lower = faster)
const THINKING_DELAY_MS = 700;     // how long the "..." dots show before bot starts typing

// Keeps track of the currently running typing animation (if any),
// so a new message can safely interrupt/finish it instead of letting
// two timers write into the chat at the same time.
let activeTypingTimer = null;
let activeCursor = null;

// Whether the bot should "type out" responses character-by-character,
// or just show them instantly (purely a UI preference, toggled in Settings).
let typingFxEnabled = true;

// ===== Helper: formatted timestamp like "10:42 AM" =====
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// ===== FUNCTION: Add Message to Chat (instant, used for user messages) =====
// This function creates a new message element and adds it to the chat display
function addMessage(text, isUser) {
    // Create a new message container
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user' : 'bot');

    // Create the message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = text;

    // Add content to message container
    messageDiv.appendChild(messageContent);

    // Timestamp (UI-only addition)
    const timeEl = document.createElement('div');
    timeEl.classList.add('message-time');
    timeEl.textContent = formatTime(new Date());
    messageDiv.appendChild(timeEl);

    // Add message to chat display
    chatDisplay.appendChild(messageDiv);

    // Auto-scroll to the bottom to show the latest message
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// ===== FUNCTION: Show Typing Indicator (the "..." bouncing dots) =====
// Creates a temporary bubble with 3 animated dots to show the bot is "thinking"
// Returns the element so we can remove it later
function showTypingIndicator() {
    // Make sure there's never more than one indicator on screen at once
    removeTypingIndicator(document.getElementById('typingIndicator'));

    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typingIndicator';

    const content = document.createElement('div');
    content.classList.add('message-content');

    // Create 3 dots
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.classList.add('typing-dot');
        content.appendChild(dot);
    }

    typingDiv.appendChild(content);
    chatDisplay.appendChild(typingDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    return typingDiv;
}

// ===== FUNCTION: Remove Typing Indicator =====
// Removes the "..." bubble once the bot is ready to respond
function removeTypingIndicator(typingDiv) {
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
}

// when naay previous text, then immediately naay new one it will automatically finish the previous one para di mag dungan
function finishActiveTyping() {
    if (activeTypingTimer) {
        clearInterval(activeTypingTimer);
        activeTypingTimer = null;
    }
    if (activeCursor) {
        // Reveal whatever text was still queued up, in one go
        if (activeCursor.dataset.remainingText) {
            activeCursor.insertAdjacentText('beforebegin', activeCursor.dataset.remainingText);
        }
        activeCursor.remove();
        activeCursor = null;
    }
}

// Creates an empty bot bubble, then reveals the response one character at a time
function typeBotMessage(text) {
    // If a previous message is still mid-typing, finish it instantly first
    finishActiveTyping();

    // Create the message container (same structure as addMessage)
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot');

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    messageDiv.appendChild(messageContent);
    chatDisplay.appendChild(messageDiv);

    // Timestamp (UI-only addition)
    const timeEl = document.createElement('div');
    timeEl.classList.add('message-time');
    timeEl.textContent = formatTime(new Date());
    messageDiv.appendChild(timeEl);

    // If the typing animation is turned off in Settings, show the full
    // message instantly instead of animating it character-by-character.
    if (!typingFxEnabled) {
        messageContent.textContent = text;
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
        return;
    }

    const cursor = document.createElement('span');
    cursor.classList.add('typing-cursor');
    messageContent.appendChild(cursor);

    let charIndex = 0;

    activeCursor = cursor;
    cursor.dataset.remainingText = text;

    // typing timer to complete the response
    activeTypingTimer = setInterval(() => {
        if (charIndex < text.length) {
            cursor.insertAdjacentText('beforebegin', text[charIndex]);
            charIndex++;

            // Keep the remaining text up to date in case we get interrupted
            cursor.dataset.remainingText = text.slice(charIndex);

            // pwede maka-scroll even if typing pa
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        } else {
            // once mahuman ug type, automatic ma-stop ang timer
            clearInterval(activeTypingTimer);
            cursor.remove();
            activeTypingTimer = null;
            activeCursor = null;
        }
    }, TYPING_SPEED_MS);
}


// kani nga function is gina analyze niya ang user input then mag return ang bot ug message
function getBotResponse(userText) {
    // gina auto lowercase ang text para mag match sa keyword categorized
    const lowerText = userText.toLowerCase();

    // Tig check sa each keyword sa category
    for (const category in keywordResponses) {
        const data = keywordResponses[category];

        // Pang check sa keyword category if naa ba sa gi input sa user 
        for (const keyword of data.keywords) {
            if (lowerText.includes(keyword)) {
                return data.response;
            }
        }
    }

    // Automatic or default nga chat once dili sha aligned sa keywords nga gi-program
    return 'Dili ko maka-sabot ing-ana, dawg. Try ug lain pangutana';
}

// kani nga function triggers when ang user mag enter or i-click ang send message
function handleSendMessage() {
    const message = userInput.value.trim();

    // once ma-check niya nga walay message then it returns empty 
    if (message === '') {
        return;
    }

    // pag ang bot kay ga show pa ug 3dots "..." mawala na sha diretso
    // if naay new chat kay gina priorotize niya ang new message
    const oldTypingIndicator = document.getElementById('typingIndicator');
    removeTypingIndicator(oldTypingIndicator);

    // if ang bot kay ga type sha previous    
    finishActiveTyping();

    // pag add ug user message sa chat
    addMessage(message, true);

    // Clear input field
    userInput.value = '';
    autoExpandInput();

    // bot response diri
    const botResponse = getBotResponse(message);

    // Step 1: typing indication 3 dots mo tunga "..."
    const typingDiv = showTypingIndicator();

    // Step 2: after short delay dayun then mawala ang 3 dots "..." during type sa bot
    setTimeout(() => {

        if (document.getElementById('typingIndicator') === typingDiv) {
            removeTypingIndicator(typingDiv);
            typeBotMessage(botResponse);
        }
    }, THINKING_DELAY_MS);

    // para maka-type direct japon bisag asa ka mag tuplok
    userInput.focus();
}

// Pag tuplokon mag send sha ug message
sendBtn.addEventListener('click', handleSendMessage);

// "Enter" to send message (Shift+Enter inserts a newline — UI-only addition
// since the input field is now an auto-expanding textarea)
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
    }
});

// Auto-expanding textarea height (UI-only)
function autoExpandInput() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 110) + 'px';
}
userInput.addEventListener('input', autoExpandInput);

quickTopics.addEventListener('click', (event) => {
    const chip = event.target.closest('.topic-chip');
    if (!chip) return;
    userInput.value = chip.dataset.topic;
    handleSendMessage();
});

// ===== UI-ONLY: Theme toggle (Light / Dark mode) =====
function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('schoolBotTheme', mode);
    segBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

function getInitialTheme() {
    const saved = localStorage.getItem('schoolBotTheme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

applyTheme(getInitialTheme());

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

segBtns.forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.mode));
});

// ===== UI-ONLY: Settings panel open/close =====
moreBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
});

// ===== UI-ONLY: Typing-effect on/off switch =====
if (typingFxToggle) {
    typingFxToggle.addEventListener('change', () => {
        typingFxEnabled = typingFxToggle.checked;
    });
}

// ===== UI-ONLY: Splash screen =====
window.addEventListener('load', () => {
    setTimeout(() => {
        if (splash) splash.classList.add('hidden');
    }, 500);
});

// Welcome Message 
window.addEventListener('load', () => {
    const welcomeText = 'Unsay tuyo nimo dawg?';

    const typingDiv = showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator(typingDiv);
        typeBotMessage(welcomeText);
    }, THINKING_DELAY_MS);
});

userInput.focus();
