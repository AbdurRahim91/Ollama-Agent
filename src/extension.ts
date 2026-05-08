import * as vscode from 'vscode';
import { AgentWebviewProvider } from './webview/AgentWebviewProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Ollama Agent extension is now active!');

	const provider = new AgentWebviewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(AgentWebviewProvider.viewType, provider)
	);

	const disposable = vscode.commands.registerCommand('ollama-agent.focus', () => {
		vscode.commands.executeCommand('ollama-agent-view.focus');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
    // Cleanup code
}
