import { CompletionItem, CompletionItemKind, InsertTextFormat, SignatureHelp, TextDocuments } from 'vscode-languageserver';
import { DocumentCache } from '.';
import { TextDocument } from 'vscode-languageserver-textdocument';

export type Objects = {
	args: Type[];
	name: string;
};
export interface Type{
	name: string,
	tipo: string
};
export function complectionObject(obj: Objects[]): CompletionItem[] {
	return obj.map((obj, index) => ({
			label: `${obj.name}(${obj.args.length > 0 ? '...' : ''})`,
			kind: CompletionItemKind.Class,
			data: index,
			insertText: `${obj.name}(${obj.args.map((a, i) => `\${${i + 1}:${a.name}:}`).join(', ')});`,
			insertTextFormat: InsertTextFormat.Snippet,
			documentation: `This is a class named ${obj.name}`
	}));
}
export function complectionObjectArgs(obj: Objects[]): CompletionItem[] {
	return obj.flatMap((obj, index) => 
		obj.args.map((arg, argIndex) => ({
			label: arg.name,
			kind: CompletionItemKind.Property,
			data: { objIndex: index, argIndex },
			detail: `Property: ${arg.name}`,
			documentation: `This is a property named ${arg.name} of class ${obj.name}`
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
export function onSignatureHelpObject(params: any, documentCache: DocumentCache, documents: TextDocuments<TextDocument> ): SignatureHelp | null{
	const uri = params.textDocument.uri;
		const cached = documentCache.get(uri);
		if (!cached) return null;

		const { objects } = cached;

		const document = documents.get(uri);
		if (!document) return null;

		const text = document.getText();
		const position = params.position;

		const line = text.split('\n')[position.line];
		const beforeCursor = line.substring(0, position.character);


		const match = beforeCursor.match(/(\w+)\(([^()]*)$/);
		if (!match) return null;

		const objName = match[1];
		const typedArgs = match[2];


		const obj = objects.find(o => o.name === objName);
		if (!obj) return null;

		const activeParameter = typedArgs.split(',').length - 1;

		return {
			
			signatures: [
				{
					
					label: `${obj.name}(${obj.args.map((a:Type) => a.name + ":" + a.tipo).join(', ')})`,
					parameters: obj.args.map((arg: Type) => ({
						
						label: `${arg.name}: ${arg.tipo}`
					}))
				}
			],
			activeSignature: 0,
			activeParameter: activeParameter

		};
}