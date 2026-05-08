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

    sendButton.addEventListener('click', () => {
        const text = userInput.value.trim();
        const model = modelSelect.value;
        if (text) {
            vscode.postMessage({ type: 'sendMessage', value: text, model: model });
            userInput.value = '';
        }
    });

    refreshModels.addEventListener('click', () => {
        vscode.postMessage({ type: 'refreshModels' });
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
                addMessage(message.role, message.content);
                break;
            case 'setModels':
                modelSelect.innerHTML = message.models.map(m => `<option value="${m}">${m}</option>`).join('');
                break;
        }
    });
})();
