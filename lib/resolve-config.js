import { readPackageJson } from './payloadUtils.js';
import getConfigToUse from './getConfigToUse.js';

export default async (pluginConfig, context) => {
  // Read package.json to get project details
  const { projectName } = await readPackageJson();

  // get the repo related information
  const configToUse = getConfigToUse(pluginConfig, context);
  const { packageName } = configToUse;

  return {
      teamsWebhook: context.env.TEAMS_NOTIFICATION_URI || false,
      githubToken: context.env.GH_TOKEN || context.env.GITHUB_TOKEN || false,
      commitSHA: context.env.COMMIT_SHA || false,
      packageName: context.env.SEMANTIC_RELEASE_PACKAGE || context.env.npm_package_name || packageName || projectName || false,
      notificationType: context.env.TEAMS_NOTIFICATION_TYPE || false,
      debug: (context.env.DEBUG && /^semantic-release:(\*|whmcs)$/.test(context.env.DEBUG)) || false,
  };
};