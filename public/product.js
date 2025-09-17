document.addEventListener('DOMContentLoaded', () => {
    const productDetailsContainer = document.getElementById('product-details-container');
    const productId = new URLSearchParams(window.location.search).get('id');

    if (!productId) {
        if (productDetailsContainer) {
            productDetailsContainer.innerHTML = '<p>No product selected. Please go back to the <a href="/">homepage</a>.</p>';
        }
        return;
    }

    async function loadProduct() {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Product not found');
            }
            const product = await response.json();
            renderProduct(product);
        } catch (error) {
            console.error('Error loading product:', error);
            if (productDetailsContainer) {
                productDetailsContainer.innerHTML = `<p>Error loading product details: ${error.message}. Please try again later.</p>`;
            }
        }
    }

    function renderProduct(product) {
        if (!productDetailsContainer) return;

        document.title = `${product.name} - Avinya`; // Update the page title

        productDetailsContainer.innerHTML = `
            <div class="left-column">
                <div id="ar-container">
                    <a-scene
                        vr-mode-ui="enabled: false;"
                        renderer="logarithmicDepthBuffer: true;"
                        embedded
                        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;">
                        <a-assets>
                            <a-asset-item id="product-model-texture" src="${product.image}" crossOrigin="anonymous"></a-asset-item>
                        </a-assets>
                        <a-marker preset="hiro">
                            <a-box position='0 0.5 0' material='src: #product-model-texture'></a-box>
                        </a-marker>
                        <a-entity camera></a-entity>
                    </a-scene>
                </div>
            </div>
            <div class="right-column">
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="description">
                        <h3>Description</h3>
                        <p>${product.description}</p>
                        <p><strong>Dimensions:</strong> ${product.dimensions}</p>
                    </div>
                </div>
                <div id="chat-container">
                    <div id="chat-box"></div>
                    <div id="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Ask about this product...">
                        <button id="send-message-btn">Send</button>
                    </div>
                </div>
            </div>
        `;

        // Now that the DOM is updated, initialize the chat functionality
        initializeChat(product);
    }

    function initializeChat(product) {
        const chatBox = document.getElementById('chat-box');
        const chatInput = document.getElementById('chat-input');
        const sendMessageBtn = document.getElementById('send-message-btn');

        function addMessage(message, sender = 'bot') {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', `${sender}-message`);
            messageElement.textContent = message;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        addMessage(`Hello! I'm here to help with the ${product.name}. Ask me anything!`);

        sendMessageBtn.addEventListener('click', () => {
             const userMessage = chatInput.value.trim();
             if (userMessage) {
                 addMessage(userMessage, 'user');
                 chatInput.value = '';
                 // Simple hardcoded bot responses
                 setTimeout(() => {
                     if (userMessage.toLowerCase().includes('dimension')) {
                         addMessage(`The dimensions are ${product.dimensions}.`);
                     } else if (userMessage.toLowerCase().includes('price')) {
                         addMessage(`The price is $${product.price.toFixed(2)}.`);
                     } else {
                         addMessage("I'm sorry, I'm still a simple bot. I can tell you about the price and dimensions.");
                     }
                 }, 500);
             }
        });

        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessageBtn.click();
            }
        });
    }

    loadProduct();
});
