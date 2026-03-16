import { Function } from '../completion/fuctions';
import { Variable } from '../completion/variable';

export function lexer(text: string): string[] {
	return text
		.split(/(\s+|:|\(|\)|\{|\})/)
		.map(t => t.trim())
		.filter(Boolean);
}
const indedifiy = /^[a-zA-Z_]\w*$/;
export function extractVariablesFromTokens(tokens: string[]): Variable[] {
  const variables: Variable[] = [];

  for (let i = 0; i < tokens.length; i++) {

    if (tokens[i] === "let") {

      let j = i + 1;

      
      if (tokens[j] === "mut") {
        j++;
      }

      
      if (tokens[j] && indedifiy.test(tokens[j])) {
        variables.push({
          name: tokens[j]
        });
      }
    }
  }

  return variables;
}
export function extractFunctionsFromTokens(tokens: string[]): Function[] {
	const functions: Function[] = [];

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i] === "func") {
			let j = i + 1;

			if (tokens[j] && indedifiy.test(tokens[j])) {
				functions.push({
					name: tokens[j]
				});
			}
		}
		
	}

	return functions;
}