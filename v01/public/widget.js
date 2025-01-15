(() => {
  // Default settings
  const defaultSettings = {
    apiKey: '',
    primaryColor: '#007bff',
    fontFamily: 'Inter',
    position: 'right',
    welcomeMessage: 'Hi! How can I help you today?',
    selectedModel: 'openai/gpt-3.5-turbo',
  };

  // Merge default settings with user settings
  const settings = {
    ...defaultSettings,
    ...window.ChatWidgetSettings,
  };

  // Create widget container
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  document.body.appendChild(container);

  // Create widget styles
  const style = document.createElement('style');
  style.textContent = `
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      ${settings.position}: 20px;
      z-index: 10000;
      font-family: ${settings.fontFamily}, system-ui, sans-serif;
    }

    #chat-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${settings.primaryColor};
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: transform 0.2s;
    }

    #chat-widget-button:hover {
      transform: scale(1.05);
    }

    #chat-widget-window {
      display: none;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      overflow: hidden;
      flex-direction: column;
    }

    #chat-widget-header {
      background-color: ${settings.primaryColor};
      color: white;
      padding: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #chat-widget-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
    }

    #chat-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .chat-message {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      word-break: break-word;
    }

    .chat-message.user {
      align-self: flex-end;
      background-color: ${settings.primaryColor};
      color: white;
    }

    .chat-message.assistant {
      align-self: flex-start;
      background-color: #f0f0f0;
      color: black;
    }

    #chat-widget-input-container {
      border-top: 1px solid #eee;
      padding: 12px;
      display: flex;
      gap: 8px;
    }

    #chat-widget-input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #ddd;
      outline: none;
    }

    #chat-widget-send {
      background-color: ${settings.primaryColor};
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      cursor: pointer;
    }

    #chat-widget-send:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  // Create widget HTML
  container.innerHTML = `
    <button id="chat-widget-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </button>
    <div id="chat-widget-window">
      <div id="chat-widget-header">
        <span>Chat Support</span>
        <button id="chat-widget-close">✕</button>
      </div>
      <div id="chat-widget-messages">
        <div class="chat-message assistant">${settings.welcomeMessage}</div>
      </div>
      <div id="chat-widget-input-container">
        <input id="chat-widget-input" type="text" placeholder="Type your message..." />
        <button id="chat-widget-send">Send</button>
      </div>
    </div>
  `;

  // Get DOM elements
  const button = document.getElementById('chat-widget-button');
  const window = document.getElementById('chat-widget-window');
  const close = document.getElementById('chat-widget-close');
  const messages = document.getElementById('chat-widget-messages');
  const input = document.getElementById('chat-widget-input');
  const send = document.getElementById('chat-widget-send');

  // Toggle chat window
  button.addEventListener('click', () => {
    button.style.display = 'none';
    window.style.display = 'flex';
    input.focus();
  });

  close.addEventListener('click', () => {
    window.style.display = 'none';
    button.style.display = 'flex';
  });

  // Handle sending messages
  const sendMessage = async () => {
    const content = input.value.trim();
    if (!content || send.disabled) return;

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.textContent = content;
    messages.appendChild(userMessage);
    messages.scrollTop = messages.scrollHeight;

    // Clear input and disable send button
    input.value = '';
    send.disabled = true;

    try {
      // Call chat API
      const response = await fetch('/api/chat/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          model: settings.selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Create assistant message element
      const assistantMessage = document.createElement('div');
      assistantMessage.className = 'chat-message assistant';
      messages.appendChild(assistantMessage);

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter((line) => line.trim() !== '' && line.trim() !== 'data: [DONE]');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const { content } = JSON.parse(line.slice(6));
              assistantMessage.textContent += content;
              messages.scrollTop = messages.scrollHeight;
            } catch (e) {
              console.error('Error parsing SSE chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'chat-message assistant';
      errorMessage.textContent = 'Sorry, I encountered an error. Please try again.';
      messages.appendChild(errorMessage);
    } finally {
      send.disabled = false;
      messages.scrollTop = messages.scrollHeight;
    }
  };

  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
})(); 