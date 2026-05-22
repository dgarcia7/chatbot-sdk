# 🤖 Chatbot SDK

Un SDK ligero y personalizable para integrar un chatbot moderno en cualquier sitio web. Con diseño minimalista, animaciones suaves y soporte para streaming de respuestas.

[![Demo Interactiva](https://img.shields.io/badge/🚀_Ver-Demo_Interactiva-blue?style=for-the-badge)](https://dgarcia7.github.io/chatbot-sdk/)

> **💡 Ver la demo localmente:** Abre el archivo `index.html` directamente en tu navegador o usa `python -m http.server` / `npx serve` en el directorio del proyecto.

## ✨ Características

- 💬 **Interfaz moderna y responsive** - Diseño elegante que se adapta a cualquier dispositivo
- 🎨 **Totalmente personalizable** - Colores, textos, avatares y más
- ⚡ **Ligero y rápido** - Sin dependencias externas
- 🔄 **Soporte para streaming** - Respuestas en tiempo real con efecto de escritura
- 🎭 **Animaciones suaves** - Transiciones y efectos visuales profesionales
- 👤 **Información de usuario** - Integración con datos de usuarios logueados
- 📱 **Mobile-first** - Optimizado para dispositivos móviles

## 🚀 Instalación

### Vía CDN (Recomendado)

Agrega este script en tu HTML antes del cierre de la etiqueta `</body>`:

```html
<script src="https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js"></script>
```

### Descarga Local

También puedes descargar el archivo `chatbot.js` y alojarlo en tu servidor:

```html
<script src="./ruta/a/chatbot.js"></script>
```

## 📖 Uso Básico

### HTML Puro

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Sitio Web</title>
</head>
<body>

  <h1>Bienvenido a mi sitio</h1>
  <p>Contenido de tu página...</p>

  <!-- Cargar el SDK -->
  <script src="https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js"></script>
  
  <!-- Inicializar el chatbot -->
  <script>
    ChatBot.init({
      title: "Asistente Virtual",
      subtitle: "Estamos aquí para ayudarte",
      botName: "Bot de Soporte",
      botAvatar: "https://ejemplo.com/avatar.png",
      placeholder: "Escribe tu mensaje...",
      welcomeMessage: "¡Hola! ¿En qué puedo ayudarte?",
      color: "#0ea5e9",
      apiUrl: "https://tu-api.com/chat",
      apiKey: "tu-api-key"
    });
  </script>

</body>
</html>
```

## ⚙️ Configuración

### Opciones Disponibles

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `title` | String | "Chat de Soporte" | Título del header del chat |
| `subtitle` | String | "Normalmente respondemos en minutos" | Subtítulo del header |
| `botName` | String | "Asistente Virtual" | Nombre del bot |
| `botAvatar` | String | null | URL de la imagen del avatar del bot |
| `placeholder` | String | "Escribe tu mensaje..." | Placeholder del input |
| `welcomeMessage` | String | "¡Hola! ¿En qué podemos ayudarte hoy?" | Mensaje de bienvenida |
| `color` | String | "#0ea5e9" | Color principal del chat (hexadecimal) |
| `apiUrl` | String | requerido | URL de tu API de chatbot |
| `apiKey` | String | "" | API key para autenticación |
| `enableStreaming` | Boolean | true | Habilitar streaming de respuestas |
| `streamingSpeed` | Number | 20 | Velocidad del streaming (ms entre caracteres) |
| `userId` | String | null | ID del usuario logueado |
| `userName` | String | null | Nombre del usuario logueado |
| `userEmail` | String | null | Email del usuario logueado |
| `userToken` | String | null | Token de sesión del usuario |
| `customData` | Object | null | Datos personalizados adicionales |

### Ejemplo Completo

```javascript
ChatBot.init({
  // Apariencia
  title: "Soporte Técnico",
  subtitle: "En línea ahora",
  botName: "TechBot",
  botAvatar: "https://ejemplo.com/bot-avatar.png",
  color: "#7c3aed",
  
  // Mensajes
  placeholder: "¿Cómo podemos ayudarte?",
  welcomeMessage: "¡Hola! Soy TechBot 🤖\n\nEstoy aquí para resolver tus dudas técnicas.",
  
  // API
  apiUrl: "https://api.ejemplo.com/chat",
  apiKey: "sk_live_xxx",
  
  // Streaming
  enableStreaming: true,
  streamingSpeed: 15,
  
  // Usuario (opcional)
  userId: "user_123",
  userName: "Juan Pérez",
  userEmail: "juan@ejemplo.com",
  userToken: "eyJhbGciOiJIUzI1NiIs...",
  
  // Datos personalizados
  customData: {
    plan: "premium",
    region: "LATAM"
  }
});
```

## 🔧 Integración con Frameworks

### React

#### Opción 1: Componente Funcional

```jsx
import React, { useEffect, useRef } from 'react';

const Chatbot = ({ config }) => {
  const chatbotInitialized = useRef(false);

  useEffect(() => {
    // Evitar inicialización múltiple
    if (chatbotInitialized.current) return;

    // Cargar el script del SDK
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js';
    script.async = true;
    
    script.onload = () => {
      // Inicializar el chatbot
      window.ChatBot.init(config);
      chatbotInitialized.current = true;
    };

    document.body.appendChild(script);

    // Cleanup al desmontar
    return () => {
      const chatButton = document.querySelector('.cb-button');
      const chatBox = document.querySelector('.cb-chat');
      if (chatButton) chatButton.remove();
      if (chatBox) chatBox.remove();
    };
  }, [config]);

  return null;
};

// Uso del componente
function App() {
  const chatbotConfig = {
    title: "Asistente Virtual",
    subtitle: "Soporte en línea",
    botName: "Assistant",
    color: "#3b82f6",
    placeholder: "Escribe tu mensaje...",
    welcomeMessage: "¡Hola! ¿Cómo puedo ayudarte?",
    apiUrl: "https://api.ejemplo.com/chat",
    apiKey: "tu-api-key",
    userName: "Usuario React"
  };

  return (
    <div className="App">
      <h1>Mi Aplicación React</h1>
      <p>Contenido de tu app...</p>
      
      <Chatbot config={chatbotConfig} />
    </div>
  );
}

export default App;
```

#### Opción 2: Hook Personalizado

```jsx
import { useEffect, useRef } from 'react';

// Hook personalizado para el chatbot
const useChatbot = (config) => {
  const chatbotInitialized = useRef(false);

  useEffect(() => {
    if (chatbotInitialized.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js';
    script.async = true;
    
    script.onload = () => {
      if (window.ChatBot) {
        window.ChatBot.init(config);
        chatbotInitialized.current = true;
      }
    };

    document.body.appendChild(script);

    return () => {
      const chatButton = document.querySelector('.cb-button');
      const chatBox = document.querySelector('.cb-chat');
      if (chatButton) chatButton.remove();
      if (chatBox) chatBox.remove();
    };
  }, [config]);
};

// Uso del hook
function App() {
  useChatbot({
    title: "Mi Chatbot",
    subtitle: "Estamos aquí para ayudarte",
    botName: "Bot React",
    color: "#10b981",
    apiUrl: "https://api.ejemplo.com/chat",
    apiKey: "tu-api-key"
  });

  return (
    <div>
      <h1>Mi App</h1>
      {/* Tu contenido aquí */}
    </div>
  );
}

export default App;
```

### Vue.js

#### Vue 3 - Composition API

```vue
<template>
  <div class="app">
    <h1>Mi Aplicación Vue</h1>
    <p>Contenido de tu aplicación...</p>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const chatbotConfig = {
  title: "Soporte Vue",
  subtitle: "Asistencia en línea",
  botName: "VueBot",
  color: "#42b883",
  placeholder: "Escribe aquí...",
  welcomeMessage: "¡Hola! Bienvenido al soporte",
  apiUrl: "https://api.ejemplo.com/chat",
  apiKey: "tu-api-key",
  userName: "Usuario Vue"
};

let chatbotInitialized = false;

onMounted(() => {
  // Verificar si ya está cargado
  if (window.ChatBot) {
    window.ChatBot.init(chatbotConfig);
    chatbotInitialized = true;
    return;
  }

  // Cargar el script
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js';
  script.async = true;
  
  script.onload = () => {
    if (window.ChatBot && !chatbotInitialized) {
      window.ChatBot.init(chatbotConfig);
      chatbotInitialized = true;
    }
  };

  document.body.appendChild(script);
});

onBeforeUnmount(() => {
  // Limpiar elementos del chatbot
  const chatButton = document.querySelector('.cb-button');
  const chatBox = document.querySelector('.cb-chat');
  if (chatButton) chatButton.remove();
  if (chatBox) chatBox.remove();
});
</script>

<style scoped>
.app {
  padding: 20px;
}
</style>
```

#### Vue 3 - Componente Reutilizable

```vue
<!-- ChatbotWidget.vue -->
<template>
  <div class="chatbot-widget"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, defineProps } from 'vue';

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
});

let chatbotInitialized = false;

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js';
  script.async = true;
  
  script.onload = () => {
    if (window.ChatBot && !chatbotInitialized) {
      window.ChatBot.init(props.config);
      chatbotInitialized = true;
    }
  };

  document.body.appendChild(script);
});

onBeforeUnmount(() => {
  const chatButton = document.querySelector('.cb-button');
  const chatBox = document.querySelector('.cb-chat');
  if (chatButton) chatButton.remove();
  if (chatBox) chatBox.remove();
});
</script>
```

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <h1>Mi App Vue</h1>
    <ChatbotWidget :config="chatbotConfig" />
  </div>
</template>

<script setup>
import ChatbotWidget from './components/ChatbotWidget.vue';

const chatbotConfig = {
  title: "Asistente Vue",
  subtitle: "Soporte técnico",
  botName: "Assistant",
  color: "#42b883",
  apiUrl: "https://api.ejemplo.com/chat",
  apiKey: "tu-api-key"
};
</script>
```

#### Vue 2 - Options API

```vue
<template>
  <div class="app">
    <h1>Mi Aplicación Vue 2</h1>
    <p>Contenido de la aplicación</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  
  data() {
    return {
      chatbotConfig: {
        title: "Soporte Vue 2",
        subtitle: "Estamos en línea",
        botName: "Bot Vue 2",
        color: "#42b883",
        apiUrl: "https://api.ejemplo.com/chat",
        apiKey: "tu-api-key",
        welcomeMessage: "¡Hola! ¿Cómo puedo ayudarte?"
      },
      chatbotInitialized: false
    };
  },
  
  mounted() {
    this.loadChatbot();
  },
  
  beforeDestroy() {
    this.cleanupChatbot();
  },
  
  methods: {
    loadChatbot() {
      if (window.ChatBot) {
        window.ChatBot.init(this.chatbotConfig);
        this.chatbotInitialized = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/dgarcia7/chatbot-sdk@v1.0.0/sdk/chatbot.js';
      script.async = true;
      
      script.onload = () => {
        if (window.ChatBot && !this.chatbotInitialized) {
          window.ChatBot.init(this.chatbotConfig);
          this.chatbotInitialized = true;
        }
      };

      document.body.appendChild(script);
    },
    
    cleanupChatbot() {
      const chatButton = document.querySelector('.cb-button');
      const chatBox = document.querySelector('.cb-chat');
      if (chatButton) chatButton.remove();
      if (chatBox) chatBox.remove();
    }
  }
};
</script>
```

## 📡 API Backend

El chatbot espera que tu API responda en el siguiente formato:

### Request

```javascript
POST /chat
Content-Type: application/json

{
  "message": "Hola, necesito ayuda",
  "userId": "user_123",        // opcional
  "userName": "Juan Pérez",    // opcional
  "userEmail": "juan@ejemplo.com", // opcional
  "userToken": "token_xxx",    // opcional
  "customData": {              // opcional
    "plan": "premium"
  }
}
```

### Response (Sin Streaming)

```javascript
{
  "message": "¡Hola Juan! ¿En qué puedo ayudarte?",
  "success": true
}
```

### Response (Con Streaming)

Para streaming, usa Server-Sent Events (SSE):

```javascript
// Node.js / Express ejemplo
app.post('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const message = "Esta es una respuesta con streaming...";
  let index = 0;

  const interval = setInterval(() => {
    if (index < message.length) {
      res.write(`data: ${JSON.stringify({ 
        chunk: message[index],
        done: false 
      })}\n\n`);
      index++;
    } else {
      res.write(`data: ${JSON.stringify({ 
        chunk: '',
        done: true 
      })}\n\n`);
      clearInterval(interval);
      res.end();
    }
  }, 50);
});
```

## 🎨 Personalización Avanzada

### Cambiar Colores Dinámicamente

```javascript
// Después de inicializar
const chatbot = ChatBot.init({ /* config */ });

// Cambiar color más tarde (requiere reinicialización)
ChatBot.init({
  ...configAnterior,
  color: "#ff0000"  // Nuevo color
});
```

### Múltiples Instancias

El SDK solo soporta una instancia por página. Si necesitas reiniciar:

```javascript
// Remover instancia actual
const oldButton = document.querySelector('.cb-button');
const oldChat = document.querySelector('.cb-chat');
if (oldButton) oldButton.remove();
if (oldChat) oldChat.remove();

// Crear nueva instancia
ChatBot.init({ /* nueva config */ });
```

## 🌐 Soporte de Navegadores

- ✅ Chrome (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Edge (últimas 2 versiones)
- ✅ Opera (últimas 2 versiones)
- ⚠️ IE11 (soporte limitado)

## 📱 Responsive Design

El chatbot está optimizado para todos los tamaños de pantalla:

- **Desktop**: 384px de ancho
- **Tablet**: Se adapta con max-width
- **Mobile**: Ocupa casi todo el ancho de la pantalla

## 🔒 Seguridad

### Mejores Prácticas

1. **No expongas tu API Key en el frontend** - Usa autenticación del lado del servidor
2. **Valida todas las entradas** en tu backend
3. **Usa HTTPS** para todas las comunicaciones
4. **Implementa rate limiting** en tu API
5. **Sanitiza las respuestas** del bot para prevenir XSS

### Ejemplo Seguro

```javascript
ChatBot.init({
  title: "Chat Seguro",
  apiUrl: "https://tu-dominio.com/api/chat",
  // No incluyas API keys sensibles aquí
  // Usa tokens de sesión del usuario
  userToken: obtenerTokenDeSesion(),
  userId: obtenerUserId()
});
```

## 🐛 Debugging

Activa el modo debug en la consola del navegador:

```javascript
localStorage.setItem('chatbot-debug', 'true');
```

## 📄 Licencia

MIT License - Libre para uso personal y comercial

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

- 📧 Email: soporte@ejemplo.com
- 💬 Issues: [GitHub Issues](https://github.com/dgarcia7/chatbot-sdk/issues)
- 📚 Documentación: [Docs](https://github.com/dgarcia7/chatbot-sdk)

## 🙏 Agradecimientos

Gracias a todos los que han contribuido a este proyecto.

## 🌐 Publicar la Demo con GitHub Pages

Para que el botón de demo funcione en tu repositorio:

1. **Sube tu proyecto a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/dgarcia7/chatbot-sdk.git
   git push -u origin main
   ```

2. **Activa GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Click en **Settings** (Configuración)
   - En el menú lateral, click en **Pages**
   - En **Source**, selecciona la rama `main` y carpeta `/ (root)`
   - Click en **Save**
   - Espera unos minutos y tu demo estará disponible en: `https://dgarcia7.github.io/chatbot-sdk/`

3. **Ver la demo localmente** (sin necesidad de servidor):
   ```bash
   # Opción 1: Abrir directamente
   # Simplemente haz doble clic en index.html
   
   # Opción 2: Con Python
   python -m http.server 8000
   # Abre http://localhost:8000
   
   # Opción 3: Con Node.js
   npx serve
   # Abre la URL que muestra
   
   # Opción 4: Con PHP
   php -S localhost:8000
   ```

---

Hecho con ❤️ por [dgarcia7](https://github.com/dgarcia7)
