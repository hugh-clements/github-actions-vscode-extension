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
	// Get the path of the server
	const serverModule = Uri.joinPath(context.extensionUri, 'server', 'Actions-Security-Language-Server-1.0-SNAPSHOT.jar').fsPath;
	// Configuration for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6011'], cwd: process.cwd() };

	// Server configuration
	const serverOptions: ServerOptions = {
		run: {
			command: 'java',
			args: ['-jar',serverModule],
			transport: TransportKind.stdio,
			options: { cwd: process.cwd() }
		},
		debug: {
			command: 'java',
			args: ['-jar', serverModule],
			options: debugOptions,
		},
	};
	// Define the requests for communication with the LSP
	const clientOptions: LanguageClientOptions = {
		// Specify the types of files or extensions to target
		documentSelector: [
			{ scheme: 'file', language: 'yaml' },
			{ scheme: 'untitled', language: 'yaml' }
		],
		// Display name in the warning panel
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
