import * as vscode from "vscode"
import { GhostProvider } from "./GhostProvider"

export class GhostCodeActionProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = {
		quickfix: vscode.CodeActionKind.QuickFix,
	}

	public provideCodeActions(
		document: vscode.TextDocument,
		range: vscode.Range | vscode.Selection,
		context: vscode.CodeActionContext,
		token: vscode.CancellationToken,
	): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
		GhostProvider.getInstance().getDocumentStore().storeDocument(document)

		const action = new vscode.CodeAction(
			"Kilo Code - Ghost Writer",
			GhostCodeActionProvider.providedCodeActionKinds["quickfix"],
		)

		action.command = {
			command: "kilocode.ghost.codeActionQuickFix",
			title: "",
			arguments: [document.uri, range],
		}

		return [action]
	}

	public async resolveCodeAction(
		codeAction: vscode.CodeAction,
		token: vscode.CancellationToken,
	): Promise<vscode.CodeAction> {
		if (token.isCancellationRequested) {
			return codeAction
		}
		// Retrieve the document and range we stored earlier
		const [uri, range] = codeAction.command!.arguments as [vscode.Uri, vscode.Range]
		const document = await vscode.workspace.openTextDocument(uri)
		await GhostProvider.getInstance().provideCodeActionQuickFix(document, range)
		return codeAction
	}
}
