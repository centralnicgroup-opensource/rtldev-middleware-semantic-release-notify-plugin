import { getArguments, getNotes, getReleaseDate } from './notes.js';
import { updateValues, readPackageJson, fetchPullRequestInfo } from './payloadUtils.js';
import getTeamsVars from './getTeamsVars.js';
import getRepoInfo from './getRepoInfo.js';
import getConfigToUse from './getConfigToUse.js';
import postMessage from './postMessage.js';
import fs from 'fs';

export default async (pluginConfig, context) => {
    const {
        logger,
        nextRelease,
        options,
        env: { SEMANTIC_RELEASE_PACKAGE, npm_package_name }
    } = context;

    // Read package.json to get project details
    const { projectName, repoUrl } = await readPackageJson();

    const configToUse = getConfigToUse(pluginConfig, context);
    const { packageName } = configToUse;
    const {
        teamsWebhook,
        githubToken,
    } = getTeamsVars(configToUse);

    const package_name =
        SEMANTIC_RELEASE_PACKAGE || packageName || npm_package_name || projectName;

    if (!configToUse.notifyOnSuccess) {
        logger.log('Notifying on success skipped');
        return;
    }

    logger.log('Sending teams notification on success');

    const repo = getRepoInfo(options.repositoryUrl);
    // Fetch Jira issue link based on the repository URL
    const jiraIssueLink = fetchPullRequestInfo(repo.URL);
    // Get version information and release details
    const { versionNumber, releaseType, releaseUrl, headerColor, repoImg } = getArguments(repo.URL, nextRelease);

    const notificationType = process.env.TEAMS_NOTIFICATION_TYPE ?? "";
    const messagePayloadPath = notificationType ? './lib/messagecard_payload.json' : './lib/default_payload.json';
    const messagePayloadContent = fs.readFileSync(messagePayloadPath, 'utf8');
    const messagePayload = JSON.parse(messagePayloadContent);

    let releaseNotes = nextRelease.notes;

    // Function to create a custom value object with 'find' and 'replace' keys
    const createCustomValue = (find, replace) => ({ find, replace });

    const customValues = [];
    const pushCustomValue = (nameKey, titleKey) => (label, value) => {
        const key = notificationType ? nameKey : titleKey;
        customValues.push(createCustomValue({ [key]: label }, value));
    };

    const pushValue = pushCustomValue("name", "id");

    if (!notificationType) {
        pushValue("projectName", { text: package_name });
        pushValue("releaseInfo", { text: `${releaseType} v${versionNumber} ${getReleaseDate(releaseNotes)}` });
        pushValue("changeLog", { text: getNotes(releaseNotes) });
        pushValue("header", { style: headerColor });
        pushValue("releaseNotes", { url: releaseUrl ?? "" });
        pushValue("githubRepository", { url: repoUrl ?? "" });
        pushValue("jiraIssue", { url: jiraIssueLink ?? "" });
        pushValue("productImage", { url: repoImg ?? "" });
    } else {
        pushValue("Project:", { value: package_name });
        pushValue("Release Type:", { "title": releaseType, value: versionNumber });
        pushValue("Release Notes", { uri: releaseUrl ?? "" });
        pushValue("Github Repository", { uri: repoUrl ?? "" });
        pushValue("Jira Issue", { uri: jiraIssueLink ?? "" });
    }

    // Override values of the messagePayload directly based on customValues
    if (Object.keys(customValues).length !== 0) {
        updateValues(messagePayload, customValues);
    }

    return await postMessage(messagePayload, logger, { teamsWebhook });
};
