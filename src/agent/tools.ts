import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function readFile(filePath: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder open');
    }
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(workspaceFolders[0].uri.fsPath, filePath);
    return fs.readFileSync(fullPath, 'utf8');
}

export async function writeFile(filePath: string, content: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder open');
    }
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(workspaceFolders[0].uri.fsPath, filePath);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    return `Successfully wrote to ${filePath}`;
}

export async function createDirectory(dirPath: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder open');
    }
    const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(workspaceFolders[0].uri.fsPath, dirPath);
    
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
    return `Successfully created directory ${dirPath}`;
}

export async function listFiles(dirPath = '.'): Promise<string[]> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder open');
    }
    const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(workspaceFolders[0].uri.fsPath, dirPath);
    return fs.readdirSync(fullPath);
}

export async function runTerminalCommand(command: string): Promise<string> {
    return new Promise((resolve) => {
        const terminal = vscode.window.createTerminal('Ollama Agent');
        terminal.show();
        terminal.sendText(command);
        resolve('Command sent to terminal');
    });
}

export async function deleteFile(filePath: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder open');
    }
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(workspaceFolders[0].uri.fsPath, filePath);
    
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return `Successfully deleted ${filePath}`;
    }
    return `File ${filePath} does not exist`;
}

export async function searchFiles(pattern: string): Promise<string[]> {
    const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 10);
    return files.map(f => vscode.workspace.asRelativePath(f));
}
