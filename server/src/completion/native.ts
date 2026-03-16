import {  CompletionItem, Connection, TextDocumentPositionParams } from 'vscode-languageserver';

export function native(params:Connection) {
	params.onCompletion((_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		return [
			{
				label: "let",
				kind: 14,
				data: 1
			},
			{
				label: "func",
				kind: 14,
				data: 2
			}
		]
	})
}