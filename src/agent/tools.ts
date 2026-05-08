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
    return `Error: File ${filePath} does not exist and could not be deleted. Check the path.`;
}

export async function moveFile(oldPath: string, newPath: string): Promise<string> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder open');
    }
    const oldFullPath = path.isAbsolute(oldPath) ? oldPath : path.join(workspaceFolders[0].uri.fsPath, oldPath);
    const newFullPath = path.isAbsolute(newPath) ? newPath : path.join(workspaceFolders[0].uri.fsPath, newPath);
    
    if (!fs.existsSync(oldFullPath)) {
        return `Error: Source file ${oldPath} does not exist.`;
    }

    const dir = path.dirname(newFullPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.renameSync(oldFullPath, newFullPath);
    return `Successfully moved/renamed ${oldPath} to ${newPath}`;
}

export async function searchFiles(pattern: string): Promise<string[]> {
    const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 10);
    return files.map(f => vscode.workspace.asRelativePath(f));
}

export async function getDiagnostics(): Promise<string> {
    const diagnostics = vscode.languages.getDiagnostics();
    let result = '';
    for (const [uri, diagArray] of diagnostics) {
        for (const diag of diagArray) {
            if (diag.severity === vscode.DiagnosticSeverity.Error || diag.severity === vscode.DiagnosticSeverity.Warning) {
                result += `File: ${vscode.workspace.asRelativePath(uri)}\nLine: ${diag.range.start.line + 1}\nMessage: ${diag.message}\n\n`;
            }
        }
    }
    return result || 'No errors or warnings found.';
}

export async function getActiveFileContent(): Promise<{ filePath: string, content: string } | string> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return 'No active editor found.';
    }
    return {
        filePath: vscode.workspace.asRelativePath(editor.document.uri),
        content: editor.document.getText()
    };
}
