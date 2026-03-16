import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

export type Variable = {
	name: string;
};

export function complection(variables: Variable[]): CompletionItem[] {
	return variables.map((variable, index) => ({
			label: variable.name,
			kind: CompletionItemKind.Variable,
			data: index,
		}));
}

export function resolveVariable(item: CompletionItem, variables: Variable[]): CompletionItem {
	const index = typeof item.data === 'number' ? item.data : undefined;
		const variable = typeof index === 'number' ? variables[index] : undefined;

		if (variable) {
			item.detail = `Variable: ${variable.name}`;
			item.documentation = `This is a variable named ${variable.name}`;
		}

		return item;
}


