# Ollama Agent for VS Code

An agentic coding assistant powered by local LLMs via Ollama. This extension provides a sidebar chat interface where an AI agent can autonomously explore your workspace, read/write files, and execute terminal commands.

## Features

- **Local-First**: Runs entirely on your machine. No API keys or internet connection required (other than Ollama).
- **Agentic Capabilities**: The AI can use tools to interact with your code, not just talk about it.
- **Sidebar Chat**: Seamlessly integrated into the VS Code activity bar.
- **Multi-Tool Support**:
  - 📂 **File System**: Read, write, and list files.
  - 🔍 **Search**: Find files matching specific patterns.
  - 💻 **Terminal**: Run commands directly in the integrated terminal.
- **Model Awareness**: Automatically detects and uses your local Ollama models (prefers `deepseek-coder-v2`, `llama3.1`, etc.).

## Prerequisites

1.  **Ollama**: Must be installed and running on your system. [Download Ollama](https://ollama.ai/).
2.  **Models**: For best results, pull a coding-optimized model:
    ```bash
    ollama pull deepseek-coder-v2:16b
    # or
    ollama pull llama3.1:8b
    ```

## Installation

### For Developers (Running from Source)

1.  Clone this repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Open the project in VS Code.
4.  Press `F5` to launch the "Extension Development Host".

## Usage

1.  Click the **Ollama Agent** icon (robot) in the Activity Bar.
2.  Type a request in the chat box.
3.  **Examples**:
    - *"List the files in this project and tell me what the entry point is."*
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

## Publishing

For instructions on how to publish this extension to the VS Code Marketplace, see [publish-guide.md](./publish-guide.md).

## License

MIT
