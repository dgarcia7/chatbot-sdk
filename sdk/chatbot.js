(function () {
  class ChatBotSDK {
    constructor(config) {
      this.config = {
        title: config.title || "Chat de Soporte",
        subtitle: config.subtitle || "Normalmente respondemos en minutos",
        placeholder: config.placeholder || "Escribe tu mensaje...",
        welcomeMessage: config.welcomeMessage || "¡Hola! ¿En qué podemos ayudarte hoy?",
        botName: config.botName || "Asistente Virtual",
        botAvatar: config.botAvatar || null,
        color: config.color || "#0ea5e9",
        apiUrl: config.apiUrl,
        apiKey: config.apiKey || "",
        enableStreaming: config.enableStreaming !== false, // Habilitado por defecto
        streamingSpeed: config.streamingSpeed || 20, // Milisegundos entre caracteres
        // Datos del usuario logueado (opcionales)
        userId: config.userId || null,
        userName: config.userName || null,
        userEmail: config.userEmail || null,
        userToken: config.userToken || null,
        customData: config.customData || null // Datos personalizados adicionales
      };
      this.isOpen = false;
      this.isMinimized = false;
      this.messages = [];
      this.isTyping = false;
      this.typingTimeout = null;
      this.currentStreamingMessage = null;
      this.isWaitingResponse = false;
    }

    init() {
      this.injectStyles();
      this.createButton();
      this.createChatBox();
      this.addWelcomeMessage();
    }

    injectStyles() {
      const style = document.createElement("style");
      style.innerHTML = `
        * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', 'Arial', 'Helvetica Neue', sans-serif;
        }

        @keyframes cb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes cb-slideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cb-scaleIn {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }

        .cb-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: ${this.config.color};
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999;
          font-size: 24px;
          border: none;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }

        .cb-button:hover {
          transform: scale(1.05);
        }

        .cb-button:active {
          transform: scale(0.95);
        }

        .cb-button-icon {
          position: absolute;
          transition: all 0.3s ease;
        }

        .cb-button-icon.hidden {
          transform: rotate(90deg);
          opacity: 0;
        }

        .cb-notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #ef4444;
          border-radius: 50%;
          animation: cb-pulse 2s ease-in-out infinite;
        }

        .cb-chat {
          position: fixed;
          bottom: 92px;
          right: 24px;
          width: 384px;
          max-width: calc(100vw - 48px);
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          z-index: 9999;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .cb-chat.hidden {
          opacity: 0;
          transform: translateY(16px);
          pointer-events: none;
        }

        .cb-chat.visible {
          animation: cb-slideUp 0.3s ease, cb-scaleIn 0.3s ease;
        }

        .cb-chat.minimized {
          height: auto !important;
        }

        .cb-header {
          padding: 16px;
          background: ${this.config.color};
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cb-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cb-header-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .cb-header-text h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', 'Arial', 'Helvetica Neue', sans-serif;
        }

        .cb-header-text p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', 'Arial', 'Helvetica Neue', sans-serif;
        }

        .cb-header-actions {
          display: flex;
          gap: 4px;
        }

        .cb-header-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #fff;
          cursor: pointer;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .cb-header-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .cb-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f9fafb;
          max-height: 400px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cb-message {
          max-width: 80%;
          padding: 12px;
          font-size: 14px;
          line-height: 1.5;
          animation: cb-slideUp 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Ubuntu', 'Arial', 'Helvetica Neue', sans-serif;
        }

        .cb-message.user {
          margin-left: auto;
          background: ${this.config.color};
          color: #fff;
          border-radius: 16px 16px 4px 16px;
        }

        .cb-message.bot {
          margin-right: auto;
          background: #ffffff;
          color: #111827;
          border: 1px solid #e5e7eb;
          border-radius: 16px 16px 16px 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Estilos para contenido HTML dentro de mensajes */
        .cb-message p {
          margin: 0 0 8px 0;
        }

        .cb-message p:last-child {
          margin-bottom: 0;
        }

        .cb-message strong,
        .cb-message b {
          font-weight: 600;
        }

        .cb-message em,
        .cb-message i {
          font-style: italic;
        }

        .cb-message a {
          color: ${this.config.color};
          text-decoration: underline;
          cursor: pointer;
        }

        .cb-message.user a {
          color: #ffffff;
        }

        .cb-message ul,
        .cb-message ol {
          margin: 8px 0;
          padding-left: 20px;
        }

        .cb-message li {
          margin: 4px 0;
        }

        .cb-message code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }

        .cb-message.user code {
          background: rgba(255, 255, 255, 0.2);
        }

        .cb-message pre {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 8px 0;
        }

        .cb-message pre code {
          background: none;
          padding: 0;
        }

        .cb-message br {
          display: block;
          margin: 4px 0;
          content: '';
        }

        .cb-message-time {
          font-size: 10px;
          margin-top: 2px;
          margin-bottom: 8px;
          display: block;
          opacity: 0.7;
        }

        .cb-message-time.bot-time {
          color: #6b7280;
          margin-left: 36px;
        }

        .cb-message-time.user-time {
          color: ${this.config.color};
          text-align: right;
          margin-right: 0;
        }

        /* Modal de confirmación */
        .cb-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: cb-fadeIn 0.2s ease;
        }

        @keyframes cb-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cb-modal {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: calc(100vw - 48px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: cb-slideUp 0.3s ease;
        }

        .cb-modal-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .cb-modal-message {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .cb-modal-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .cb-modal-btn {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .cb-modal-btn-cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .cb-modal-btn-cancel:hover {
          background: #e5e7eb;
        }

        .cb-modal-btn-confirm {
          background: ${this.config.color};
          color: #ffffff;
        }

        .cb-modal-btn-confirm:hover {
          opacity: 0.9;
        }

        .cb-typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          max-width: 80px;
          animation: cb-slideUp 0.3s ease;
        }

        .cb-typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: cb-typing 1.4s ease-in-out infinite;
        }

        .cb-typing-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .cb-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .cb-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes cb-typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .cb-welcome-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          margin-bottom: 16px;
          animation: cb-slideUp 0.3s ease;
        }

        .cb-welcome-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin: 0 auto 12px;
          background: ${this.config.color}20;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cb-welcome-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cb-welcome-avatar svg {
          width: 32px;
          height: 32px;
          color: ${this.config.color};
        }

        .cb-welcome-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
        }

        .cb-welcome-role {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 12px 0;
        }

        .cb-welcome-text {
          font-size: 14px;
          color: #374151;
          line-height: 1.5;
          margin: 0;
        }

        .cb-message-with-avatar {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-right: auto;
          max-width: 85%;
        }

        .cb-message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${this.config.color}20;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }

        .cb-message-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cb-message-avatar svg {
          width: 14px;
          height: 14px;
          color: ${this.config.color};
        }

        .cb-input-container {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          background: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cb-input {
          flex: 1;
          padding: 10px 16px;
          font-size: 14px;
          background: #f3f4f6;
          border: none;
          border-radius: 12px;
          outline: none;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .cb-input:focus {
          background: #e5e7eb;
          box-shadow: 0 0 0 2px ${this.config.color}33;
        }

        .cb-input::placeholder {
          color: #9ca3af;
        }

        .cb-send-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: ${this.config.color};
          color: #fff;
          cursor: pointer;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .cb-send-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .cb-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .cb-chat {
            width: calc(100vw - 48px);
          }
        }

        /* Icons SVG */
        .cb-icon {
          width: 20px;
          height: 20px;
          display: inline-block;
        }

        .cb-icon-lg {
          width: 24px;
          height: 24px;
        }
      `;
      document.head.appendChild(style);
    }

    createButton() {
      this.button = document.createElement("button");
      this.button.className = "cb-button";
      this.button.innerHTML = `
        <span class="cb-button-icon" id="cb-icon-chat">
          <svg class="cb-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="cb-button-icon hidden" id="cb-icon-close">
          <svg class="cb-icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      `;

      this.notificationBadge = document.createElement("span");
      this.notificationBadge.className = "cb-notification-badge";
      this.button.appendChild(this.notificationBadge);

      this.button.onclick = () => this.toggleChat();

      document.body.appendChild(this.button);
    }

    createChatBox() {
      this.chat = document.createElement("div");
      this.chat.className = "cb-chat hidden";

      this.chat.innerHTML = `
        <div class="cb-header">
          <div class="cb-header-info">
            <div class="cb-header-avatar">
              <svg class="cb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div class="cb-header-text">
              <h3>${this.config.title}</h3>
              <p>${this.config.subtitle}</p>
            </div>
          </div>
          <div class="cb-header-actions">
            <button class="cb-header-btn" id="cb-new-chat-btn" aria-label="Nuevo chat">
              <svg class="cb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </button>
            <button class="cb-header-btn" id="cb-minimize-btn" aria-label="Minimizar">
              <svg class="cb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button class="cb-header-btn" id="cb-close-btn" aria-label="Cerrar">
              <svg class="cb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="cb-messages" id="cb-messages"></div>
        <div class="cb-input-container">
          <input type="text" class="cb-input" id="cb-input" placeholder="${this.config.placeholder}" />
          <button class="cb-send-btn" id="cb-send-btn" aria-label="Enviar">
            <svg class="cb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      `;

      document.body.appendChild(this.chat);

      // Event listeners
      const input = this.chat.querySelector("#cb-input");
      const sendBtn = this.chat.querySelector("#cb-send-btn");
      const newChatBtn = this.chat.querySelector("#cb-new-chat-btn");
      const minimizeBtn = this.chat.querySelector("#cb-minimize-btn");
      const closeBtn = this.chat.querySelector("#cb-close-btn");

      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSendMessage();
        }
      });

      input.addEventListener("input", (e) => {
        sendBtn.disabled = !e.target.value.trim();
      });

      sendBtn.addEventListener("click", () => this.handleSendMessage());
      newChatBtn.addEventListener("click", () => this.startNewChat());
      minimizeBtn.addEventListener("click", () => this.toggleMinimize());
      closeBtn.addEventListener("click", () => this.toggleChat());

      sendBtn.disabled = true;
    }

    addWelcomeMessage() {
      const messagesContainer = this.chat.querySelector("#cb-messages");
      
      const welcomeCard = document.createElement("div");
      welcomeCard.className = "cb-welcome-card";
      
      const avatarHtml = this.config.botAvatar 
        ? `<img src="${this.config.botAvatar}" alt="${this.config.botName}" />` 
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
           </svg>`;
      
      // Personalizar mensaje si el usuario está logueado
      let welcomeText = this.config.welcomeMessage;
      if (this.config.userName) {
        // Extraer el primer nombre si tiene varios
        const firstName = this.config.userName.split(' ')[0];
        welcomeText = `¡Hola ${firstName}! ¿En qué puedo ayudarte hoy?`;
      }
      
      welcomeCard.innerHTML = `
        <div class="cb-welcome-avatar">
          ${avatarHtml}
        </div>
        <h4 class="cb-welcome-name">${this.config.botName}</h4>
        <p class="cb-welcome-role">${this.config.subtitle}</p>
        <p class="cb-welcome-text">${welcomeText}</p>
      `;
      
      messagesContainer.appendChild(welcomeCard);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      this.isMinimized = false;

      const iconChat = document.getElementById("cb-icon-chat");
      const iconClose = document.getElementById("cb-icon-close");

      if (this.isOpen) {
        this.chat.classList.remove("hidden");
        this.chat.classList.add("visible");
        this.notificationBadge.style.display = "none";
        iconChat.classList.add("hidden");
        iconClose.classList.remove("hidden");
        this.chat.querySelector("#cb-input").focus();
      } else {
        this.chat.classList.add("hidden");
        this.chat.classList.remove("visible");
        iconChat.classList.remove("hidden");
        iconClose.classList.add("hidden");
      }

      this.updateMinimizedState();
    }

    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      this.updateMinimizedState();
    }

    updateMinimizedState() {
      if (this.isMinimized) {
        this.chat.classList.add("minimized");
        this.chat.querySelector(".cb-messages").style.display = "none";
        this.chat.querySelector(".cb-input-container").style.display = "none";
      } else {
        this.chat.classList.remove("minimized");
        this.chat.querySelector(".cb-messages").style.display = "flex";
        this.chat.querySelector(".cb-input-container").style.display = "flex";
      }
    }

    sanitizeHTML(html) {
      // Crear un elemento temporal para sanitizar
      const temp = document.createElement('div');
      temp.textContent = html;
      const text = temp.innerHTML;
      
      // Permitir etiquetas seguras
      const allowedTags = /<(\/?)(p|br|strong|b|em|i|u|a|ul|ol|li|code|pre|span|div|h1|h2|h3|h4|h5|h6)([^>]*)>/gi;
      
      // Restaurar etiquetas permitidas
      return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
                 .replace(/<style[^>]*>.*?<\/style>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/on\w+\s*=/gi, '');
    }

    addMessage(content, sender, options = {}) {
      const messagesContainer = this.chat.querySelector("#cb-messages");
      const showTime = options.showTime !== false;
      const isHTML = options.isHTML !== false;
      
      // Remover indicador de escritura si existe
      this.removeTypingIndicator();
      
      if (sender === "bot") {
        const messageWrapper = document.createElement("div");
        messageWrapper.className = "cb-message-with-avatar";
        
        const avatarDiv = document.createElement("div");
        avatarDiv.className = "cb-message-avatar";
        
        const avatarHtml = this.config.botAvatar 
          ? `<img src="${this.config.botAvatar}" alt="${this.config.botName}" />` 
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
             </svg>`;
        
        avatarDiv.innerHTML = avatarHtml;
        
        const messageDiv = document.createElement("div");
        messageDiv.className = "cb-message bot";
        
        // Usar innerHTML para soportar HTML, con sanitización
        if (isHTML) {
          messageDiv.innerHTML = this.sanitizeHTML(content);
        } else {
          messageDiv.textContent = content;
        }
        
        messageWrapper.appendChild(avatarDiv);
        messageWrapper.appendChild(messageDiv);
        messagesContainer.appendChild(messageWrapper);
        
        // Agregar timestamp fuera del mensaje si está habilitado
        if (showTime) {
          const timeSpan = document.createElement("span");
          timeSpan.className = "cb-message-time bot-time";
          timeSpan.textContent = this.formatTime(new Date());
          messagesContainer.appendChild(timeSpan);
        }
      } else {
        const messageDiv = document.createElement("div");
        messageDiv.className = `cb-message ${sender}`;
        
        if (isHTML) {
          messageDiv.innerHTML = this.sanitizeHTML(content);
        } else {
          messageDiv.textContent = content;
        }
        
        messagesContainer.appendChild(messageDiv);
        
        // Agregar timestamp fuera del mensaje del usuario
        if (showTime) {
          const timeSpan = document.createElement("span");
          timeSpan.className = "cb-message-time user-time";
          timeSpan.textContent = this.formatTime(new Date());
          messagesContainer.appendChild(timeSpan);
        }
      }

      // Hacer los enlaces seguros
      const links = messagesContainer.querySelectorAll('.cb-message a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });

      this.scrollToBottom();
      this.messages.push({ content, sender, timestamp: new Date() });
    }

    formatTime(date) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    scrollToBottom() {
      const messagesContainer = this.chat.querySelector("#cb-messages");
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
      if (this.isTyping) return;
      
      this.isTyping = true;
      const messagesContainer = this.chat.querySelector("#cb-messages");
      
      const messageWrapper = document.createElement("div");
      messageWrapper.className = "cb-message-with-avatar";
      messageWrapper.id = "cb-typing-indicator-wrapper";
      
      const avatarDiv = document.createElement("div");
      avatarDiv.className = "cb-message-avatar";
      
      const avatarHtml = this.config.botAvatar 
        ? `<img src="${this.config.botAvatar}" alt="${this.config.botName}" />` 
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
           </svg>`;
      
      avatarDiv.innerHTML = avatarHtml;
      
      const typingDiv = document.createElement("div");
      typingDiv.className = "cb-typing-indicator";
      typingDiv.innerHTML = `
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
        <span class="cb-typing-dot"></span>
      `;
      
      messageWrapper.appendChild(avatarDiv);
      messageWrapper.appendChild(typingDiv);
      messagesContainer.appendChild(messageWrapper);
      
      this.scrollToBottom();
    }

    removeTypingIndicator() {
      const indicator = document.getElementById("cb-typing-indicator-wrapper");
      if (indicator) {
        indicator.remove();
        this.isTyping = false;
      }
    }

    createStreamingMessage() {
      const messagesContainer = this.chat.querySelector("#cb-messages");
      
      const messageWrapper = document.createElement("div");
      messageWrapper.className = "cb-message-with-avatar";
      messageWrapper.id = "cb-streaming-message";
      
      const avatarDiv = document.createElement("div");
      avatarDiv.className = "cb-message-avatar";
      
      const avatarHtml = this.config.botAvatar 
        ? `<img src="${this.config.botAvatar}" alt="${this.config.botName}" />` 
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
           </svg>`;
      
      avatarDiv.innerHTML = avatarHtml;
      
      const messageDiv = document.createElement("div");
      messageDiv.className = "cb-message bot";
      messageDiv.id = "cb-streaming-content";
      messageDiv.innerHTML = "";
      
      messageWrapper.appendChild(avatarDiv);
      messageWrapper.appendChild(messageDiv);
      messagesContainer.appendChild(messageWrapper);
      
      this.currentStreamingMessage = messageDiv;
      this.scrollToBottom();
      
      return messageDiv;
    }

    async streamText(text, messageElement, isHTML = true) {
      if (!this.config.enableStreaming) {
        // Si el streaming está deshabilitado, mostrar todo de una vez
        if (isHTML) {
          messageElement.innerHTML = this.sanitizeHTML(text);
        } else {
          messageElement.textContent = text;
        }
        this.scrollToBottom();
        return;
      }

      // Streaming habilitado: mostrar carácter por carácter
      if (isHTML) {
        // Para HTML, necesitamos procesar las etiquetas correctamente
        const sanitized = this.sanitizeHTML(text);
        let currentText = "";
        let buffer = "";
        let inTag = false;
        
        for (let i = 0; i < sanitized.length; i++) {
          const char = sanitized[i];
          buffer += char;
          
          if (char === '<') {
            inTag = true;
          } else if (char === '>') {
            inTag = false;
            currentText += buffer;
            buffer = "";
            messageElement.innerHTML = currentText;
            this.scrollToBottom();
            continue;
          }
          
          if (!inTag) {
            currentText += char;
            messageElement.innerHTML = currentText;
            
            // Solo hacer delay en caracteres visibles, no en etiquetas
            await new Promise(resolve => setTimeout(resolve, this.config.streamingSpeed));
            this.scrollToBottom();
          }
        }
        
        // Asegurar que todo el contenido se muestre
        messageElement.innerHTML = currentText + buffer;
      } else {
        // Para texto plano, más simple
        let currentText = "";
        for (let i = 0; i < text.length; i++) {
          currentText += text[i];
          messageElement.textContent = currentText;
          await new Promise(resolve => setTimeout(resolve, this.config.streamingSpeed));
          this.scrollToBottom();
        }
      }
      
      // Hacer los enlaces seguros
      const links = messageElement.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
      
      this.scrollToBottom();
    }

    async handleStreamingResponse(response) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      
      this.removeTypingIndicator();
      const messageElement = this.createStreamingMessage();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          
          // Actualizar el mensaje con el texto acumulado
          messageElement.innerHTML = this.sanitizeHTML(accumulatedText);
          
          // Hacer los enlaces seguros
          const links = messageElement.querySelectorAll('a');
          links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
          });
          
          this.scrollToBottom();
        }
        
        // Agregar timestamp fuera del mensaje
        const messageWrapper = messageElement.parentElement;
        const messagesContainer = messageWrapper.parentElement;
        const timeSpan = document.createElement("span");
        timeSpan.className = "cb-message-time bot-time";
        timeSpan.textContent = this.formatTime(new Date());
        messagesContainer.appendChild(timeSpan);
        
        // Guardar en el historial
        this.messages.push({ 
          content: accumulatedText, 
          sender: "bot", 
          timestamp: new Date() 
        });
        
        // Limpiar referencia
        this.currentStreamingMessage = null;
        document.getElementById("cb-streaming-message").removeAttribute('id');
        messageElement.removeAttribute('id');
        
      } catch (error) {
        console.error("Error en streaming:", error);
        messageElement.innerHTML = this.sanitizeHTML(
          "<strong>Error:</strong> Hubo un problema al recibir la respuesta."
        );
      }
      
      this.isWaitingResponse = false;
    }

    startNewChat() {
      // Si ya hay mensajes (más que solo la tarjeta de bienvenida), mostrar confirmación
      if (this.messages.length > 0) {
        this.showConfirmModal(
          "¿Iniciar nuevo chat?",
          "Se eliminará la conversación actual. Esta acción no se puede deshacer.",
          () => {
            this.clearChat();
          }
        );
      } else {
        this.clearChat();
      }
    }

    clearChat() {
      const messagesContainer = this.chat.querySelector("#cb-messages");
      messagesContainer.innerHTML = "";
      this.messages = [];
      this.addWelcomeMessage();
    }

    showConfirmModal(title, message, onConfirm) {
      // Crear overlay
      const overlay = document.createElement("div");
      overlay.className = "cb-modal-overlay";
      
      // Crear modal
      const modal = document.createElement("div");
      modal.className = "cb-modal";
      
      modal.innerHTML = `
        <h3 class="cb-modal-title">${title}</h3>
        <p class="cb-modal-message">${message}</p>
        <div class="cb-modal-actions">
          <button class="cb-modal-btn cb-modal-btn-cancel" id="cb-modal-cancel">Cancelar</button>
          <button class="cb-modal-btn cb-modal-btn-confirm" id="cb-modal-confirm">Confirmar</button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      // Event listeners
      const cancelBtn = modal.querySelector("#cb-modal-cancel");
      const confirmBtn = modal.querySelector("#cb-modal-confirm");
      
      const closeModal = () => {
        overlay.remove();
      };
      
      cancelBtn.addEventListener("click", closeModal);
      
      confirmBtn.addEventListener("click", () => {
        closeModal();
        if (onConfirm) onConfirm();
      });
      
      // Cerrar al hacer click fuera del modal
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });
    }

    async handleSendMessage() {
      const input = this.chat.querySelector("#cb-input");
      const message = input.value.trim();

      if (!message || this.isWaitingResponse) return;

      // Agregar mensaje del usuario (sin HTML)
      this.addMessage(message, "user", { isHTML: false });
      input.value = "";
      this.chat.querySelector("#cb-send-btn").disabled = true;

      // Marcar que estamos esperando respuesta
      this.isWaitingResponse = true;

      // Mostrar indicador de escritura
      this.showTypingIndicator();

      try {
        // Preparar el payload con el mensaje y datos del usuario
        const payload = { message };
        
        // Agregar datos del usuario si están disponibles
        if (this.config.userId) payload.userId = this.config.userId;
        if (this.config.userName) payload.userName = this.config.userName;
        if (this.config.userEmail) payload.userEmail = this.config.userEmail;
        if (this.config.userToken) payload.userToken = this.config.userToken;
        if (this.config.customData) payload.customData = this.config.customData;
        
        // Preparar headers
        const headers = {
          "Content-Type": "application/json"
        };
        
        // Agregar API Key si está configurado
        if (this.config.apiKey) {
          headers.Authorization = this.config.apiKey;
        }
        
        // Enviar mensaje a la API
        const response = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Verificar si la respuesta es streaming
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("text/event-stream")) {
          // Respuesta en formato Server-Sent Events
          await this.handleStreamingResponse(response);
        } else if (response.body && typeof response.body.getReader === 'function') {
          // Verificar si el backend soporta streaming
          const reader = response.body.getReader();
          const firstChunk = await reader.read();
          
          // Cancelar el reader ya que solo queríamos verificar
          reader.releaseLock();
          
          if (!firstChunk.done && firstChunk.value) {
            // Parece ser streaming, procesarlo
            await this.handleStreamingResponse(response);
          } else {
            // Fallback a respuesta normal JSON
            const data = await response.json();
            this.handleNormalResponse(data);
          }
        } else {
          // Respuesta normal JSON
          const data = await response.json();
          this.handleNormalResponse(data);
        }
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        this.removeTypingIndicator();
        this.isWaitingResponse = false;
        this.addMessage(
          "<strong>Error:</strong> No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.",
          "bot",
          { isHTML: true }
        );
      }
    }

    async handleNormalResponse(data) {
      // El contenido del bot puede incluir HTML
      const botMessage = data.reply || data.message || data.response || data.text || "";
      
      if (botMessage) {
        // Remover indicador de escritura
        this.removeTypingIndicator();
        
        // Crear el mensaje
        const messagesContainer = this.chat.querySelector("#cb-messages");
        const messageWrapper = document.createElement("div");
        messageWrapper.className = "cb-message-with-avatar";
        
        const avatarDiv = document.createElement("div");
        avatarDiv.className = "cb-message-avatar";
        
        const avatarHtml = this.config.botAvatar 
          ? `<img src="${this.config.botAvatar}" alt="${this.config.botName}" />` 
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
             </svg>`;
        
        avatarDiv.innerHTML = avatarHtml;
        
        const messageDiv = document.createElement("div");
        messageDiv.className = "cb-message bot";
        
        messageWrapper.appendChild(avatarDiv);
        messageWrapper.appendChild(messageDiv);
        messagesContainer.appendChild(messageWrapper);
        
        // Aplicar streaming al texto
        await this.streamText(botMessage, messageDiv, true);
        
        // Agregar timestamp fuera del mensaje
        const timeSpan = document.createElement("span");
        timeSpan.className = "cb-message-time bot-time";
        timeSpan.textContent = this.formatTime(new Date());
        messagesContainer.appendChild(timeSpan);
        
        // Guardar en historial
        this.messages.push({ content: botMessage, sender: "bot", timestamp: new Date() });
      } else {
        this.removeTypingIndicator();
        this.addMessage("Respuesta recibida sin contenido.", "bot", { isHTML: false });
      }
      
      this.isWaitingResponse = false;
    }

    // Métodos públicos para actualizar datos del usuario
    setUser(userData) {
      if (userData.userId !== undefined) this.config.userId = userData.userId;
      if (userData.userName !== undefined) this.config.userName = userData.userName;
      if (userData.userEmail !== undefined) this.config.userEmail = userData.userEmail;
      if (userData.userToken !== undefined) this.config.userToken = userData.userToken;
      if (userData.customData !== undefined) this.config.customData = userData.customData;
    }

    clearUser() {
      this.config.userId = null;
      this.config.userName = null;
      this.config.userEmail = null;
      this.config.userToken = null;
      this.config.customData = null;
    }

    getUser() {
      return {
        userId: this.config.userId,
        userName: this.config.userName,
        userEmail: this.config.userEmail,
        userToken: this.config.userToken,
        customData: this.config.customData
      };
    }
  }

  // Variable para almacenar la instancia del bot
  let botInstance = null;

  window.ChatBot = {
    init: function (config) {
      botInstance = new ChatBotSDK(config);
      botInstance.init();
      return botInstance;
    },
    
    // Métodos públicos para manejar datos del usuario
    setUser: function (userData) {
      if (botInstance) {
        botInstance.setUser(userData);
      } else {
        console.warn('ChatBot no ha sido inicializado. Llama a ChatBot.init() primero.');
      }
    },
    
    clearUser: function () {
      if (botInstance) {
        botInstance.clearUser();
      }
    },
    
    getUser: function () {
      if (botInstance) {
        return botInstance.getUser();
      }
      return null;
    },
    
    getInstance: function () {
      return botInstance;
    }
  };
})();
