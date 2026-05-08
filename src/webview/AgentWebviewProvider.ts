import * as vscode from 'vscode';
import { OllamaClient } from '../ollama/client';
import * as tools from '../agent/tools';

export class AgentWebviewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'ollama-agent-view';
    private _view?: vscode.WebviewView;
    private _ollamaClient: OllamaClient;
    private _messages: any[] = [];

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) {
        this._ollamaClient = new OllamaClient();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Initial model fetch
        this._ollamaClient.listModels().then(models => {
            webviewView.webview.postMessage({ type: 'setModels', models });
        });

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage': {
                    await this._handleUserMessage(data.value, data.model);
                    break;
                }
                case 'refreshModels': {
                    const models = await this._ollamaClient.listModels();
                    webviewView.webview.postMessage({ type: 'setModels', models });
                    break;
                }
                case 'clearChat': {
                    this._messages = [];
                    break;
                }
            }
        });
    }

    private async _handleUserMessage(text: string, selectedModel?: string) {
        if (!this._view) { return; }

        try {
            const models = await this._ollamaClient.listModels();
            const model = selectedModel || 
                          (models.includes('deepseek-coder-v2:16b') ? 'deepseek-coder-v2:16b' : 
                          models.includes('llama3.1:8b') ? 'llama3.1:8b' : 
                          models[0] || 'llama3');

            if (this._messages.length === 0) {
                this._messages.push({ 
                    role: 'system', 
                    content: `You are an expert Full Stack Web Developer Agent. Your goal is to build, debug, and manage web projects. 
                    You have full access to the file system and terminal. You should be proactive and autonomous.
                    
                    When asked to build a project, create all necessary files and folders systematically.
                    
                    To use a tool, respond ONLY with a JSON object:
                    {"tool": "writeFile", "args": {"filePath": "src/App.js", "content": "..."}}
                    
                    Available tools:
                    - readFile(filePath: string)
                    - writeFile(filePath: string, content: string): Creates file and parent folders.
                    - deleteFile(filePath: string): Deletes a file.
                    - moveFile(oldPath: string, newPath: string): Renames or moves a file. Use this for renames.
                    - createDirectory(dirPath: string): Creates a folder recursively.
                    - listFiles(dirPath: string): Lists files in a directory.
                    - runTerminalCommand(command: string): Use for npm install, git, etc.
                    - searchFiles(pattern: string)
                    - getDiagnostics(): Returns all current errors/warnings.
                    - getActiveFileContent(): Returns content of the current open file.
                    
                    Important: You have "Full Access". 
                    - Before renaming or deleting, use listFiles or searchFiles to verify the exact path.
                    - To rename a file, use the moveFile tool.
                    - Follow best practices for web development.` 
                });
            }

            this._messages.push({ role: 'user', content: text });

            let iterations = 0;
            const maxIterations = 10; 

            while (iterations < maxIterations) {
                const response = await this._ollamaClient.chat(model, this._messages);
                this._messages.push({ role: 'assistant', content: response });

                try {
                    let jsonStr = response.trim();
                    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                    if (jsonMatch) {
                        jsonStr = jsonMatch[1];
                    } else {
                        const start = jsonStr.indexOf('{');
                        const end = jsonStr.lastIndexOf('}');
                        if (start !== -1 && end !== -1) {
                            jsonStr = jsonStr.substring(start, end + 1);
                        }
                    }

                    let toolCall;
                    try {
                        toolCall = JSON.parse(jsonStr);
                    } catch (err) {
                        const fixedJson = jsonStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
                        toolCall = JSON.parse(fixedJson);
                    }

                    if (toolCall && toolCall.tool) {
                        this._view.webview.postMessage({ type: 'addMessage', role: 'assistant', content: `[Tool] ${toolCall.tool}: ${JSON.stringify(toolCall.args)}` });
                        
                        let result: any;
                        if (toolCall.tool === 'readFile') {
                            result = await tools.readFile(toolCall.args.filePath);
                        } else if (toolCall.tool === 'writeFile') {
                            result = await tools.writeFile(toolCall.args.filePath, toolCall.args.content);
                        } else if (toolCall.tool === 'deleteFile') {
                            result = await tools.deleteFile(toolCall.args.filePath);
                        } else if (toolCall.tool === 'moveFile') {
                            result = await tools.moveFile(toolCall.args.oldPath, toolCall.args.newPath);
                        } else if (toolCall.tool === 'createDirectory') {
                            result = await tools.createDirectory(toolCall.args.dirPath);
                        } else if (toolCall.tool === 'listFiles') {
                            result = await tools.listFiles(toolCall.args.dirPath);
                        } else if (toolCall.tool === 'runTerminalCommand') {
                            result = await tools.runTerminalCommand(toolCall.args.command);
                        } else if (toolCall.tool === 'searchFiles') {
                            result = await tools.searchFiles(toolCall.args.pattern);
                        } else if (toolCall.tool === 'getDiagnostics') {
                            result = await tools.getDiagnostics();
                        } else if (toolCall.tool === 'getActiveFileContent') {
                            result = await tools.getActiveFileContent();
                        }

                        this._messages.push({ role: 'user', content: `Tool result: ${JSON.stringify(result)}` });
                        iterations++;
                        continue;
                    }
                } catch (e) {
                    // Final response
                }

                this._view.webview.postMessage({ type: 'addMessage', role: 'assistant', content: response });
                break;
            }

        } catch (error: any) {
            this._view.webview.postMessage({ type: 'addMessage', role: 'assistant', content: `Error: ${error.message}` });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'chat.css'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${styleUri}" rel="stylesheet">
                <title>Ollama Agent</title>
            </head>
            <body>
                <div id="chat-container">
                    <div id="header">
                        <select id="model-select">
                            <option value="">Loading models...</option>
                        </select>
                        <button id="refresh-models" title="Refresh Models">↻</button>
                    </div>
                    <div id="messages"></div>
                    <div id="input-container">
                        <textarea id="user-input" placeholder="Ask anything..."></textarea>
                        <button id="send-button">Send</button>
                    </div>
                </div>
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }
}
