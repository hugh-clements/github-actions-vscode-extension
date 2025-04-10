'use strict';

import { ExtensionContext, window as Window, Uri } from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	RevealOutputChannelOn,
	ServerOptions,
	TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

// Called when the extension gets activated
export async function activate(context: ExtensionContext) {
	// サーバーのパスを取得
	const serverModule =  Uri.joinPath(context.extensionUri, 'server', 'out', 'server.js').fsPath;
	// デバッグ時の設定
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6011'], cwd: process.cwd() };

	// サーバーの設定
	const serverOptions: ServerOptions = {
		run: {
			module: serverModule,
			transport: TransportKind.stdio,
			options: { cwd: process.cwd() }
		},
		debug: {
			module: serverModule,
			transport: TransportKind.stdio,
			options: debugOptions,
		},
	};
	// LSPとの通信に使うリクエストを定義
	const clientOptions: LanguageClientOptions = {
		// 対象とするファイルの種類や拡張子
		documentSelector: [
			{ scheme: 'file' },
			{ scheme: 'untitled' }
		],
		// 警告パネルでの表示名
		diagnosticCollectionName: "github-actions-security-server",
		revealOutputChannelOn: RevealOutputChannelOn.Never,
		initializationOptions: {},
		progressOnInitialization: true,
	};

	try {
		// LSP
		client = new LanguageClient("github-actions-workflow-security-scanner",  "github-actions-security-server",  serverOptions, clientOptions);
	} catch (err) {
		void Window.showErrorMessage('Failed to activate the extension. Please refer to the Output panel for details.');
		return;
	}
	client.start().catch((error) => client.error(`Starting the server failed.`, error, 'force'));
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.stop();
	}
}