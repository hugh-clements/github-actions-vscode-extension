import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

suite('Should get all diagnostics', () => {
  const docUri = getDocUri('fulldiagnostics1.yaml');

  test('Diagnostics Full Diagnostics', async () => {
    const expectedCodes = [
		'COMMAND_EXECUTION',
		'UNPINNED_ACTION',
		'UNSAFE_INPUT_ASSIGNMENT',
		'RUNNER_HIJACKER',
		'OUTDATED_REFERENCE'
	  ];

    // Activate the extension on this document
    await activate(docUri);

    // Grab whatever diagnostics the server sent
    const actualDiagnostics = vscode.languages.getDiagnostics(docUri);

    assert.strictEqual(actualDiagnostics.length, expectedCodes.length,
      `Expected ${expectedCodes.length} diagnostics but got ${actualDiagnostics.length}`);


    expectedCodes.forEach(code => {
      const found = actualDiagnostics.some(d => d.code && d.code.toString() === code);
      assert.ok(found, `Expected to find a diagnostic with code "${code}"`);
    });
  });
});
