import { type TSESLint } from '@typescript-eslint/utils';

import rules from '../../lib/rules';
import {
	SUPPORTED_TESTING_FRAMEWORKS,
	SupportedTestingFramework,
} from '../../lib/utils';

import { LinterConfig, writeConfig } from './utils';

const RULE_NAME_PREFIX = 'testing-library/';

const getRecommendedRulesForTestingFramework = (
	framework: SupportedTestingFramework
): Record<string, TSESLint.Linter.RuleEntry> =>
	Object.entries(rules)
		.filter(
			([
				_,
				{
					meta: { docs },
				},
			]) => Boolean(docs.recommendedConfig[framework])
		)
		.reduce((allRules, [ruleName, { meta }]) => {
			const name = `${RULE_NAME_PREFIX}${ruleName}`;
			const recommendation = meta.docs.recommendedConfig[framework];

			return {
				...allRules,
				[name]: recommendation,
			};
		}, {});

(async () => {
	for (const framework of SUPPORTED_TESTING_FRAMEWORKS) {
		const specificFrameworkConfig: LinterConfig = {
			plugins: ['testing-library'],
			rules: getRecommendedRulesForTestingFramework(framework),
		};

		await writeConfig(specificFrameworkConfig, framework);
	}
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
