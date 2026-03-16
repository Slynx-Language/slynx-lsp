import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

export type Function = {
	name: string;
};

export function complectionFunc(functions: Function[]): CompletionItem[] {
	return functions.map((func, index) => ({
			label: func.name,
			kind: CompletionItemKind.Function,
			data: index,
			detail: `Function: ${func.name}`,
			documentation: `This is a function named ${func.name}`
	}));
}

export function resolveFunction(item: CompletionItem, functions: Function[]): CompletionItem {
	const index = typeof item.data === 'number' ? item.data : undefined;
		const func = typeof index === 'number' ? functions[index] : undefined;

		if (func) {
			item.detail = `Function: ${func.name}`;
			item.documentation = `This is a function named ${func.name}`;
		}

		return item;
}