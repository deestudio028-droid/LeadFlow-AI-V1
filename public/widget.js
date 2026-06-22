(function() {
  // 1. Detect API Origin and Token
  const scripts = document.getElementsByTagName('script');
  let currentScript = null;
  let token = '';
  let apiBase = '';

  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes('widget.js')) {
      currentScript = scripts[i];
      token = currentScript.getAttribute('data-token');
      apiBase = new URL(currentScript.src).origin;
      break;
    }
  }

  if (!token) {
    console.error('LeadFlow AI: Missing data-token on script tag.');
    return;
  }

  // 2. Inject CSS Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .lf-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .lf-fab {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #2563eb;
      color: white;
      border: none;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    .lf-fab:hover {
      transform: scale(1.05);
    }
    .lf-fab svg {
      width: 28px;
      height: 28px;
      fill: currentColor;
    }
    .lf-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      border: 1px solid #e5e7eb;
    }
    .lf-chat-window.lf-open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .lf-header {
      background-color: #2563eb;
      color: white;
      padding: 16px 20px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lf-close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
    }
    .lf-close-btn svg {
      width: 20px;
      height: 20px;
    }
    .lf-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: #f9fafb;
    }
    .lf-message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .lf-message-bot {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      color: #111827;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .lf-message-user {
      background-color: #2563eb;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .lf-input-area {
      padding: 16px;
      background-color: #ffffff;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 12px;
    }
    .lf-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 20px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .lf-input:focus {
      border-color: #2563eb;
    }
    .lf-send-btn {
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lf-send-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .lf-typing {
      align-self: flex-start;
      padding: 12px 16px;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      display: none;
      align-items: center;
      gap: 4px;
    }
    .lf-dot {
      width: 6px;
      height: 6px;
      background-color: #9ca3af;
      border-radius: 50%;
      animation: lf-bounce 1.4s infinite ease-in-out both;
    }
    .lf-dot:nth-child(1) { animation-delay: -0.32s; }
    .lf-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes lf-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    .lf-lead-form {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      margin-top: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .lf-lead-title {
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 14px;
      color: #111827;
    }
    .lf-lead-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      margin-bottom: 12px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .lf-lead-submit {
      width: 100%;
      background-color: #2563eb;
      color: white;
      border: none;
      padding: 8px 0;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
    }
    @media (max-width: 480px) {
      .lf-chat-window {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
        transform: translateY(100%);
      }
    }
  `;
  document.head.appendChild(style);

  // 3. Build DOM Elements
  const container = document.createElement('div');
  container.className = 'lf-widget-container';

  const fab = document.createElement('button');
  fab.className = 'lf-fab';
  fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

  const chatWindow = document.createElement('div');
  chatWindow.className = 'lf-chat-window';

  const header = document.createElement('div');
  header.className = 'lf-header';
  header.innerHTML = `
    <span>Chat with us</span>
    <button class="lf-close-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
  `;

  const messagesDiv = document.createElement('div');
  messagesDiv.className = 'lf-messages';

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'lf-typing';
  typingIndicator.innerHTML = '<div class="lf-dot"></div><div class="lf-dot"></div><div class="lf-dot"></div>';
  messagesDiv.appendChild(typingIndicator);

  const inputArea = document.createElement('form');
  inputArea.className = 'lf-input-area';
  inputArea.innerHTML = `
    <input type="text" class="lf-input" placeholder="Type your message..." required autocomplete="off">
    <button type="submit" class="lf-send-btn"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
  `;

  chatWindow.appendChild(header);
  chatWindow.appendChild(messagesDiv);
  chatWindow.appendChild(inputArea);
  container.appendChild(chatWindow);
  container.appendChild(fab);
  document.body.appendChild(container);

  // 4. State & Logic
  let isOpen = false;
  let chatHistory = [];
  let leadCaptureActive = false;

  const toggleChat = () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.classList.add('lf-open');
      inputArea.querySelector('input').focus();
      if (chatHistory.length === 0) {
        addMessage('Hi there! How can I help you today?', 'bot');
      }
    } else {
      chatWindow.classList.remove('lf-open');
    }
  };

  fab.addEventListener('click', toggleChat);
  header.querySelector('.lf-close-btn').addEventListener('click', toggleChat);

  const addMessage = (content, role) => {
    if (role !== 'system') {
      const msgDiv = document.createElement('div');
      msgDiv.className = `lf-message lf-message-${role}`;
      msgDiv.textContent = content;
      messagesDiv.insertBefore(msgDiv, typingIndicator);
      scrollToBottom();
    }
    chatHistory.push({ role: role === 'bot' ? 'assistant' : 'user', content });
  };

  const scrollToBottom = () => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  const showTyping = () => {
    typingIndicator.style.display = 'flex';
    messagesDiv.appendChild(typingIndicator);
    scrollToBottom();
  };

  const hideTyping = () => {
    typingIndicator.style.display = 'none';
  };

  // 5. Lead Capture Logic
  const leadKeywords = ['appointment', 'book', 'booking', 'consultation', 'contact', 'call', 'demo', 'interested', 'talk to someone', 'speak to team'];
  
  const checkLeadCapture = (message) => {
    console.log("Checking lead capture for message:", message);
    if (leadCaptureActive) {
      console.log("Lead capture already active or submitted in this session. Skipping.");
      return false;
    }
    const lower = message.toLowerCase();
    const matchedKeyword = leadKeywords.find(kw => lower.includes(kw));
    
    if (matchedKeyword) {
      console.log("Triggered by keyword:", matchedKeyword);
      triggerLeadCapture();
      return true;
    }
    console.log("No keywords matched.");
    return false;
  };

  const triggerLeadCapture = () => {
    leadCaptureActive = true;
    const formHtml = `
      <div class="lf-lead-form" id="lf-lead-form">
        <div class="lf-lead-title">Please provide your details so we can assist you better:</div>
        <input type="text" id="lf-lead-name" class="lf-lead-input" placeholder="Your Name" required>
        <input type="text" id="lf-lead-phone" class="lf-lead-input" placeholder="Your Phone Number" required>
        <button type="button" id="lf-lead-submit" class="lf-lead-submit">Submit Request</button>
      </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = formHtml;
    messagesDiv.insertBefore(wrapper, typingIndicator);
    scrollToBottom();

    document.getElementById('lf-lead-submit').addEventListener('click', async () => {
      const name = document.getElementById('lf-lead-name').value.trim();
      const phone = document.getElementById('lf-lead-phone').value.trim();
      
      if (!name || !phone) return alert('Please enter both name and phone number.');
      
      const nameRegex = /^[^\d]{2,100}$/;
      if (!nameRegex.test(name)) return alert('Please enter a valid name (letters only).');

      const phoneRegex = /^[\d\s\-\+]{7,20}$/;
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phoneRegex.test(phone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
        return alert('Please enter a valid phone number (7-15 digits).');
      }
      
      document.getElementById('lf-lead-submit').innerText = 'Submitting...';
      
      try {
        const res = await fetch(`${apiBase}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitor_name: name,
            visitor_phone: phone,
            visitor_message: chatHistory[chatHistory.length - 1]?.content || '',
            token: token
          })
        });
        
        if (res.ok) {
          document.getElementById('lf-lead-form').innerHTML = '<div class="lf-lead-title" style="color:#10b981;margin-bottom:0;">Thank you. Our team will contact you shortly.</div>';
          addMessage('Your details have been received! We will reach out soon.', 'bot');
          // Allow re-triggering for testing purposes
          setTimeout(() => { leadCaptureActive = false; }, 3000);
        } else {
          throw new Error('Failed to submit');
        }
      } catch (err) {
        document.getElementById('lf-lead-submit').innerText = 'Error. Try Again.';
      }
    });
  };

  // 6. Form Submission
  inputArea.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = inputArea.querySelector('input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage(text, 'user');
    
    if (checkLeadCapture(text)) {
      // Don't send to AI if lead capture was just triggered, or send it and just show the form anyway.
      // Let's still send it to AI to get a natural response alongside the form.
    }

    showTyping();

    // Prepare payload (skip the initial bot greeting from history for the API)
    const apiMessages = chatHistory.filter(m => !(m.role === 'assistant' && m.content.startsWith('Hi there!')));

    try {
      const res = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          token: token
        })
      });
      
      const data = await res.json();
      hideTyping();
      
      if (data.response) {
        addMessage(data.response, 'bot');
      } else {
        addMessage("I'm sorry, I'm having trouble connecting right now.", 'bot');
      }
    } catch (err) {
      hideTyping();
      addMessage("I'm sorry, an error occurred.", 'bot');
    }
  });
})();
