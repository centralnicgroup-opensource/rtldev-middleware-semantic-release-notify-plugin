import { getArguments, getNotes, getReleaseDate } from './notes.js';
import { updateValues, fetchPullRequestInfo } from './payloadUtils.js';
import getRepoInfo from './getRepoInfo.js';
import postMessage from './postMessage.js';
import resolveConfig from "./resolve-config.js";
const loadPayload = () => import('./default_payload.json', {
    with: { type: 'json' }
}).catch(() => import('./default_payload.json', {
    assert: { type: 'json' }
}));


export default async (pluginConfig, context) => {
    const {
        logger,
        nextRelease,
        options,
    } = context;

    const cfg = await resolveConfig(pluginConfig, context);

    const package_name = cfg.packageName;

    logger.log('Sending teams notification on success');

    const repo = getRepoInfo(options.repositoryUrl);
    // Fetch Jira issue link based on the repository URL
    const jiraIssueLink = fetchPullRequestInfo(repo.URL);
    // Get version information and release details
    const { versionNumber, releaseType, releaseUrl, headerColor, repoImg } = getArguments(repo.URL, nextRelease);

    const notificationType = cfg.notificationType;
    const messagePayload = (await loadPayload()).default;

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
        pushValue("githubRepository", { url: repo.URL ?? "" });
        pushValue("jiraIssue", { url: jiraIssueLink ?? "" });
        pushValue("productImage", { url: repoImg ?? "" });
    } else {
        pushValue("Project:", { value: package_name });
        pushValue("Release Type:", { "title": releaseType, value: versionNumber });
        pushValue("Release Notes", { uri: releaseUrl ?? "" });
        pushValue("Github Repository", { uri: repo.URL ?? "" });
        pushValue("Jira Issue", { uri: jiraIssueLink ?? "" });
    }

    // Override values of the messagePayload directly based on customValues
    if (Object.keys(customValues).length !== 0) {
        updateValues(messagePayload, customValues);
    }

    return await postMessage(messagePayload, logger, cfg.teamsWebhook, cfg.githubToken);
};
