import { Connection, TextDocuments } from 'vscode-languageserver';
import { native } from './native';
import { complection, Variable } from './variable';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { extractFunctionsFromTokens, extractObjectsFromTokens, extractVariablesFromTokens, lexer } from '../lexer/lexer';
import { complectionFunc } from './fuctions';
import { complectionObject, complectionObjectArgs, convertStringInObjects } from './objects';


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
				else{
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
}