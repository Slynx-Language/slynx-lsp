import { CompletionItem, CompletionItemKind, InsertTextFormat } from 'vscode-languageserver';

export type Objects = {
	args: string[];
	name: string;
};
export function complectionObject(obj: Objects[]): CompletionItem[] {
	return obj.map((obj, index) => ({
			label: `${obj.name}(${obj.args.length > 0 ? '...' : ''})`,
			kind: CompletionItemKind.Class,
			data: index,
			insertText: `${obj.name}(${obj.args.map((a, i) => `\${${i + 1}:${a}:}`).join(', ')});`,
			insertTextFormat: InsertTextFormat.Snippet,
			detail: `Class: ${obj.name}`,
			documentation: `This is a class named ${obj.name}`
	}));
}
export function complectionObjectArgs(obj: Objects[]): CompletionItem[] {
	return obj.flatMap((obj, index) => 
		obj.args.map((arg, argIndex) => ({
			label: arg,
			kind: CompletionItemKind.Property,
			data: { objIndex: index, argIndex },
			detail: `Property: ${arg}`,
			documentation: `This is a property named ${arg} of class ${obj.name}`
		}))
	);
}

export function convertStringInObjects(str: string, objects: Objects[]): Objects {
	if(objects.some(o => o.name === str)) {
		const nameObject = objects.find(o => o.name === str);
		if(nameObject) {
			return nameObject;
		}
	}
	return { name: str, args: [] };
}

export function resolveObject(item: CompletionItem, objects: Objects[]): CompletionItem {
	const data = typeof item.data === 'object' ? item.data : undefined;
	const obj = typeof data?.objIndex === 'number' ? objects[data.objIndex] : undefined;
	const arg = typeof data?.argIndex === 'number' && obj ? obj.args[data.argIndex] : undefined;

	if (obj && !arg) {
		item.detail = `Class: ${obj.name}`;
		item.documentation = `This is a class named ${obj.name}`;
	} else if (obj && arg) {
		item.detail = `Property: ${arg}`;
		item.documentation = `This is a property named ${arg} of class ${obj.name}`;
	}

	return item;
}