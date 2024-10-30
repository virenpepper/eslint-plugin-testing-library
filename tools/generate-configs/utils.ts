import { writeFile } from 'fs/promises';
import { resolve } from 'path';

import { type TSESLint } from '@typescript-eslint/utils';
import { format, resolveConfig } from 'prettier';

const prettierConfig = resolveConfig(__dirname);

const addAutoGeneratedComment = (code: string) =>
	[
		'// THIS CODE WAS AUTOMATICALLY GENERATED',
		'// DO NOT EDIT THIS CODE BY HAND',
		'// YOU CAN REGENERATE IT USING npm run generate:configs',
		'',
		code,
	].join('\n');

/**
 * Helper function writes configuration.
 */
export const writeConfig = async (
	config: TSESLint.Linter.ConfigType,
	configName: string
): Promise<void> => {
	// note: we use `export =` because ESLint will import these configs via a commonjs import
	const code = `export = ${JSON.stringify(config)};`;
	const configStr = await format(addAutoGeneratedComment(code), {
		parser: 'typescript',
		...(await prettierConfig),
	});
	const filePath = resolve(__dirname, `../../lib/configs/${configName}.ts`);

	await writeFile(filePath, configStr);
};
