export default function getTeamsVars(config) {
  const {
    teamsWebhookEnVar = 'TEAMS_NOTIFICATION_URI',
    teamsWebhook = process.env[teamsWebhookEnVar],
    githubTokenEnVar = 'GITHUB_TOKEN',
    githubToken = process.env[githubTokenEnVar]
  } = config;

  return {
    teamsWebhookEnVar,
    teamsWebhook,
    githubTokenEnVar,
    githubToken,
  };
}
