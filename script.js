document.addEventListener('DOMContentLoaded', () => {
    const visualizeBtn = document.getElementById('visualize-btn');
    const productUrlInput = document.getElementById('product-url');
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendMessageBtn = document.getElementById('send-message-btn');

    // Function to add a message to the chat box
    function addMessage(message, sender = 'bot') {
        const messageElement = document.createElement('div');
        // These classes will be used for styling
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        // Scroll to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Initial welcome message from the bot
    addMessage("Hello! Paste a product link above, and I'll help you visualize it in your space.");

    // Handle Visualize button click
    visualizeBtn.addEventListener('click', async () => {
        const productUrl = productUrlInput.value.trim();
        if (productUrl) {
            addMessage(`Got it! Analyzing this link: ${productUrl}`, 'user');
            addMessage("Just a moment while I fetch the product details...");

            try {
                // The backend server is running on port 3000
                const response = await fetch(`http://localhost:3000/scrape?url=${encodeURIComponent(productUrl)}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Scraping request failed');
                }

                const product = await response.json();

                if (product.error) {
                    throw new Error(product.error);
                }

                if (!product.title) {
                    throw new Error('Could not find product details. The scraper might need to be adjusted for this website.');
                }

                addMessage(`I found this product: ${product.title}`);
                if(product.dimensions !== 'Not found') {
                    addMessage(`Its dimensions are roughly: ${product.dimensions}`);
                } else {
                    addMessage(`I couldn't find the dimensions for this product.`);
                }

                // Now, guide the user through environment checks
                addMessage("Great! Before we place the product, let's check your environment.");

                setTimeout(() => {
                    const lighting = checkLighting();
                    if (lighting === 'poor') {
                        addMessage("Please adjust lighting for better visualization. Your current lighting is a bit low, which can affect AR tracking.");
                    } else if (lighting === 'okay') {
                        addMessage("The lighting is okay. A little more light could improve the experience, but we can proceed.");
                    } else if (lighting === 'good') {
                        addMessage("Your lighting looks great for AR!");
                    }

                    addMessage("Now, for the best result, please find a clear, flat surface and point your camera at the HIRO marker.");
                }, 1000); // A small delay feels more conversational

                // Update the AR object with the scraped image
                const arPlaceholder = document.getElementById('ar-placeholder');
                if (product.image) {
                    arPlaceholder.setAttribute('material', `src: ${product.image}`);
                }

            } catch (error) {
                console.error('An error occurred:', error);
                addMessage(`Sorry, I ran into a problem. ${error.message}`);
            }
        } else {
            addMessage("It looks like you haven't pasted a product link yet. Please paste one to continue.");
        }
    });

    // Handle Send button click for chat
    sendMessageBtn.addEventListener('click', () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, 'user');
            chatInput.value = '';
            // Placeholder for chatbot response logic
            setTimeout(() => {
                addMessage("I'm currently focused on product visualization. Please use the input above for product links.");
            }, 500);
        }
    });

    // Allow sending chat messages with the Enter key
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessageBtn.click();
        }
    });
});

function checkLighting() {
    const sceneEl = document.querySelector('a-scene');
    // Ensure AR.js components are ready
    if (!sceneEl || !sceneEl.systems.arjs || !sceneEl.systems.arjs.video) {
        console.warn("AR.js video not ready for lighting check.");
        return 'unknown';
    }

    const video = sceneEl.systems.arjs.video;
    const canvas = document.createElement('canvas');
    // Using { willReadFrequently: true } is a performance hint for the browser
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Scaling down the canvas for much faster processing
    const scale = 0.25;
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let totalBrightness = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Using the HSP color model brightness formula, which is closer to human perception
            totalBrightness += Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        }

        const avgBrightness = totalBrightness / (data.length / 4);

        console.log(`Average brightness: ${avgBrightness}`); // For debugging purposes

        if (avgBrightness < 80) { // Thresholds tuned for the HSP formula
            return 'poor';
        } else if (avgBrightness < 130) {
            return 'okay';
        } else {
            return 'good';
        }
    } catch (e) {
        console.error("Could not get image data for lighting check.", e);
        // This can happen due to security restrictions (not an issue for webcams)
        return 'unknown';
    }
}
