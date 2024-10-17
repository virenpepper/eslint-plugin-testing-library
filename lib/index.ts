import type { TSESLint } from '@typescript-eslint/utils';

import {
	name as packageName,
	version as packageVersion,
} from '../package.json';

import configs from './configs';
import rules from './rules';
import { type SupportedTestingFramework } from './utils';

const finalConfigs: Record<string, TSESLint.Linter.Config> = {};

// TODO: type properly when upgraded to ESLint v9
const plugin = {
	meta: {
		name: packageName,
		version: packageVersion,
	},
	configs: finalConfigs,
	rules,
};

/** Binds configs in flat format with a reference the plugin itself. */
function bindFlatConfigs() {
	Object.keys(configs).forEach((configKey) => {
		plugin.configs[configKey] = {
			...configs[configKey as SupportedTestingFramework],
			plugins: {
				// TODO: remove ignored error when properly typed with ESLint v9
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				'testing-library': plugin,
			},
		};
	});
}

/** Binds configs in RC format with "-legacy" suffix for backwards compatibility. */
function bindRcConfigs() {
	Object.keys(configs).forEach((configKey) => {
		plugin.configs[`${configKey}-legacy`] = {
			...configs[configKey as SupportedTestingFramework],
			plugins: ['testing-library'],
		};
	});
}

bindFlatConfigs();
bindRcConfigs();

export = plugin;
