import { Connection, TextDocuments } from 'vscode-languageserver';
import { native } from './native';
import {  complection, Variable } from './variable';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { extractFunctionsFromTokens, extractVariablesFromTokens, lexer } from '../lexer/lexer';
import { complectionFunc } from './fuctions';


export function completion(params: Connection, documents: TextDocuments<TextDocument>) {
	params.onCompletion(async (_textDocumentPosition) => {
		const nativeItems = native();
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		const text = document ? document.getText() : '';
		const tokens = lexer(text);
		const variables = extractVariablesFromTokens(tokens);
		const functions = extractFunctionsFromTokens(tokens);
		const functionItems = complectionFunc(functions);
		const variableItems = complection(variables);
		return [...nativeItems, ...functionItems, ...variableItems];
	});
}