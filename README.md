# Ollama Agent for VS Code

[![GitHub](https://img.shields.io/github/license/AbdurRahim91/Ollama-Agent)](https://github.com/AbdurRahim91/Ollama-Agent/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/AbdurRahim91/Ollama-Agent)](https://github.com/AbdurRahim91/Ollama-Agent/stargazers)

An agentic coding assistant powered by local LLMs via Ollama. This extension provides a sidebar chat interface where an AI agent can autonomously explore your workspace, read/write files, and execute terminal commands.

## Features

- **Local-First**: Runs entirely on your machine. No API keys or internet connection required (other than Ollama).
- **Agentic Capabilities**: The AI can use tools to interact with your code, not just talk about it.
- 🤖 **Agentic Capabilities**: Autonomous file reading, writing, searching, and terminal execution.
- 🎨 **Premium UI**: Modern sidebar interface with smooth animations, auto-expanding input, and responsive design.
- 🧠 **Conversation History**: Remembers context within the current session for smarter interactions.
- 🔌 **Local LLMs**: Powered by Ollama—your data never leaves your machine.
- 🎯 **Model Selection**: Easily switch between installed Ollama models directly from the sidebar.
- 💻 **Terminal**: Run commands directly in the integrated terminal.

## 🚀 Getting Started

Follow these steps to get the Ollama Agent running on your machine.

### 1. Install Ollama
Ollama is the engine that runs the AI models locally.
- **Linux**: Run `curl -fsSL https://ollama.com/install.sh | sh`
- **macOS**: [Download the App](https://ollama.com/download/Ollama-darwin.zip)
- **Windows**: [Download the Preview](https://ollama.com/download/OllamaSetup.exe)
- Verify installation by running `ollama --version` in your terminal.

### 2. Download a Coding Model
For an "agentic" experience, you need a model that understands code and tool-calling. We recommend:
```bash
# Recommended: High performance for coding
ollama pull deepseek-coder-v2:16b

# Alternative: Fast and lightweight
ollama pull llama3.1:8b
```
*Note: Ensure Ollama is running (`ollama serve`) before pulling.*

### 3. Clone and Setup the Extension
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/AbdurRahim91/Ollama-Agent.git
    cd Ollama-Agent
    ```
2.  **Install dependencies**:
    Make sure you have [Node.js](https://nodejs.org/) installed, then run:
    ```bash
    npm install
    ```
3.  **Open in VS Code**:
    ```bash
    code .
    ```

### 4. Run the Extension
1.  Inside VS Code, press **F5** (or go to the **Run and Debug** sidebar and click the Play button).
2.  A new window called **[Extension Development Host]** will open.
3.  In this new window, look for the **Ollama Agent** icon (robot) in the Activity Bar on the left.
4.  Start chatting with your local AI!

## Usage

1.  Open the **Ollama Agent** view from the Activity Bar.
2.  Select your preferred model from the dropdown at the top.
3.  Type your request in the "Ask anything..." box.
4.  The agent will process your request, using tools automatically if needed (e.g., "Create a new React component for a login page").
5.  If you want to start fresh, you can clear the conversation history or refresh the model list using the `↻` button.
    - *"Create a new file called tests/example.test.ts with a basic test case."*
    - *"Read src/extension.ts and explain how the webview is registered."*
    - *"Run 'npm test' and show me the results."*

## Configuration

The extension currently defaults to `http://localhost:11434`. Ensure your Ollama server is accessible at this address.

## Architecture

- **Frontend**: Vanilla JS/CSS Webview for a lightweight, native feel.
- **Backend**: TypeScript-based VS Code extension.
- **Communication**: Axios for Ollama API interaction.
- **Bundling**: `esbuild` for near-instant builds.

## Contributing

Contributions are welcome! If you have ideas for new tools or improvements, feel free to open an issue or submit a pull request on [GitHub](https://github.com/AbdurRahim91/Ollama-Agent).

## Publishing

For instructions on how to publish this extension to the VS Code Marketplace, see [publish-guide.md](./publish-guide.md).

## License

MIT
