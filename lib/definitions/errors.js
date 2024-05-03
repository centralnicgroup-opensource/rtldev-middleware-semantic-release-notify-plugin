export function NoGithubToken() {
    return {
        message: 'Github Token has not been defined.',
        details: `No Github token defined. Please create a \`GITHUB_TOKEN\` in repository secrets.`,
    };
}

export function NoTeamsWebhook() {
    return {
        message: 'Teams Notification Hook has not been defined.',
        details: `No Teams web-hook defined. A Teams Webhook must be created and set in the \`TEAMS_NOTIFICATION_URI\` environment variable on your CI environment. Alternatively, provide \`teamsWebhook\` as a configuration option.`,
    };
}

export function NoPackageName() {
    return {
        message: 'npm package name, config packageName and SEMANTIC_RELEASE_PACKAGE name are undefined',
        details: 'No name for the package defined. Run through npm (npm run <semantic-release-script> to use npm package name or define packageName in the plugin config or `SEMANTIC_RELEASE_PACKAGE` in the environment',
    };
}