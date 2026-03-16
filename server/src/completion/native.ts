import { CompletionItem, CompletionItemKind, Connection } from 'vscode-languageserver';

export function native(): CompletionItem[] {

	return [
		{
			label: "let",
			kind: CompletionItemKind.Keyword,
		},
		{
			label: "func",
			kind: CompletionItemKind.Function,
			
		},
		{
			label: "object",
			kind: CompletionItemKind.Class,
			
		},
		{
			label: "pub",
			kind: CompletionItemKind.Keyword,
			
		},
		{
			label: "prop",
			kind: CompletionItemKind.Property,
			
		},
		{
			label: "if",
			kind: CompletionItemKind.Keyword,
			
		},
		{
			label: "else",
			kind: CompletionItemKind.Keyword,
			
		},
		{
			label: "while",
			kind: CompletionItemKind.Keyword,
			
		},
		{
			label: "mut",
			kind: CompletionItemKind.Keyword,
			
		}
	]

}