(function() {
    const vscode = acquireVsCodeApi();
    const messagesContainer = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const modelSelect = document.getElementById('model-select');
    const refreshModels = document.getElementById('refresh-models');

    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function setLoading(isLoading) {
        sendButton.disabled = isLoading;
        userInput.disabled = isLoading;
        if (isLoading) {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loading-indicator';
            loadingDiv.className = 'loading-message';
            loadingDiv.innerHTML = `<span>Thinking</span> <div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
            messagesContainer.appendChild(loadingDiv);
        } else {
            const loadingDiv = document.getElementById('loading-indicator');
            if (loadingDiv) {
                loadingDiv.remove();
            }
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', () => {
        const text = userInput.value.trim();
        const model = modelSelect.value;
        if (text) {
            addMessage('user', text);
            setLoading(true);
            vscode.postMessage({ type: 'sendMessage', value: text, model: model });
            userInput.value = '';
            userInput.style.height = 'auto';
        }
    });

    refreshModels.addEventListener('click', () => {
        vscode.postMessage({ type: 'refreshModels' });
    });

    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'addMessage':
                if (message.role === 'assistant') {
                    setLoading(false);
                }
                addMessage(message.role, message.content);
                break;
            case 'setModels':
                modelSelect.innerHTML = message.models.map(m => `<option value="${m}">${m}</option>`).join('');
                break;
        }
    });
})();
