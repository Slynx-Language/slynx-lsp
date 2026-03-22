import { Connection, SignatureHelp, TextDocuments } from 'vscode-languageserver';
import { native } from './native';
import { complection, Variable } from './variable';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { extractFunctionsFromTokens, extractObjectsFromTokens, extractVariablesFromTokens, lexer } from '../lexer/lexer';
import { complectionFunc } from './fuctions';
import { complectionObject, complectionObjectArgs, convertStringInObjects, onSignatureHelpObject, Type } from './objects';
const documentCache: DocumentCache = new Map<string | undefined, {
	tokens: any[];
	variables: Variable[];
	functions: any[];
	objects: any[];
}>();
export type DocumentCache = Map<string | undefined, CacheData>;
export type CacheData = {
    tokens: any[];     
    variables: Variable[];
    functions: any[];  
    objects: any[];    
};
export function completion(params: Connection, documents: TextDocuments<TextDocument>) {
	params.onCompletion(async (_textDocumentPosition) => {

		const nativeItems = native();
		const document = documents.get(_textDocumentPosition.textDocument.uri);

		const text = document ? document.getText() : '';
		const tokens = lexer(text);
		const objects = extractObjectsFromTokens(tokens);
		const objectItems = complectionObject(objects);
		const variables = extractVariablesFromTokens(tokens, objects);
		const variableItems = complection(variables);

		const functions = extractFunctionsFromTokens(tokens);
		const functionItems = complectionFunc(functions).map((item, index) => {
			const args = functions[index].args;
			item.label = `${item.label}(${args > 0 ? '...' : ''})`;
			return item;
		});
		documentCache.set(document?.uri, {
			tokens,
			variables,
			functions,
			objects
		});


		if (_textDocumentPosition.context?.triggerCharacter === ".") {
			const position = _textDocumentPosition.position;
			const line = text.split('\n')[position.line];
			const beforeCursor = line.substring(0, position.character);

			const match = beforeCursor.match(/(\w+)\.$/);

			if (match) {
				const varName = match[1];


				const variable = variables.find(v => v.name === varName);

				if (variable?.type.type) {
					const obj = variable.type.type;


					return complectionObjectArgs([obj]);
				}
				else {
					return [];
				}
			}
		}




		return [...nativeItems
			?? [], ...functionItems
			?? [], ...variableItems
			?? [], ...objectItems
			?? []];
	});
	params.onSignatureHelp((params): SignatureHelp | null => {
		const Objects = onSignatureHelpObject(params, documentCache, documents);
		return Objects;
	});

}
