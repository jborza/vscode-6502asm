import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

//manages webview panels
export class EmulatorPanel{
    public static currentPanel: EmulatorPanel | undefined;
    public static readonly viewType = '6502emulator';
    public static readonly title = '6502 Emulator';
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionPath: string;

    public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
            : undefined;

    	// If we already have a panel, show it.
		if (EmulatorPanel.currentPanel) {
			EmulatorPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			EmulatorPanel.viewType,
			EmulatorPanel.title,
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
        );

        EmulatorPanel.currentPanel = new EmulatorPanel(panel, extensionPath);
    }

    private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Set the webview's initial html content
		this._update();
	}

	private generateUri(){
		return vscode.Uri.file(
			path.join(this._extensionPath, 'media')
		).with({scheme:'vscode-resource'});
	}

	private replaceAll(target:string, search:string, replacement:string) {
		return target.split(search).join(replacement);
	};
	
	private _update(){
		//load html file from media, replace local links due to content security policy
		let htmlPath = path.join(this._extensionPath, 'media', 'index.html');
		let content = fs.readFileSync(htmlPath, {encoding:'utf-8'});
		let uri = this.generateUri().toString();
		content = this.replaceAll(content,"{media}",this.generateUri().toString());
		this._panel.webview.html = content;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}