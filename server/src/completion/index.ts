import { Connection } from 'vscode-languageserver';
import { native } from './native';

export function completion(params:Connection) {
	native(params)
}