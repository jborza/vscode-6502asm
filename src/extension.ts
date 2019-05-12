// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {EmulatorPanel} from './emulatorPanel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	

	context.subscriptions.push(vscode.commands.registerCommand('6502asm.emulate', () => {
		EmulatorPanel.createOrShow(context.extensionPath);

		EmulatorPanel.setCodeFromActiveEditor();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {

}
