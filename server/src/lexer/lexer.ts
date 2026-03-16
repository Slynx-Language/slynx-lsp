import { Function } from '../completion/fuctions';
import { Objects } from '../completion/objects';
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
			let name: string | undefined;
			let args = 0;
			let j = i + 1;

			if (tokens[j] && indedifiy.test(tokens[j])) {
				name = tokens[j];
			}

			if (tokens[j + 1] === "(") {
				let k = j + 2;
				while (tokens[k] && tokens[k] !== ")") {
					if (tokens[k] !== "," && indedifiy.test(tokens[k])) {
						args++;
					}
					k++;
				}
			}

			if (name) {
				functions.push({
					name,
					args
				});
			}
		}
	}

	return functions;
}

export function extractObjectsFromTokens(tokens: string[]): Objects[] {
  const objects: Objects[] = [];
  
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "object") {
      let name;
      let args: string[] = [];
      let j = i + 1;

      if (tokens[j] && indedifiy.test(tokens[j])) {
        name = tokens[j];
      }

      if (tokens[j + 1] === "{") {
        /**
         * object person{
         *  name: string,
         * }
         */
        let k = j + 2;
        while (tokens[k] && tokens[k] !== "}") {
          if (tokens[k] === "," ) {
            k++;
            continue;
          }

          if (tokens[k + 1] === ":" && indedifiy.test(tokens[k])) {
            args.push(tokens[k]);
            k += 2;
            continue;
          }

          k++;
        }
      }
      if (name) {
        objects.push({
          name,
          args
        });
      }
    }
  }
  return objects;
}