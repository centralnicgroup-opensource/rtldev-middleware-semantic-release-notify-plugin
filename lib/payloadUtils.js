import { promises as fs } from 'fs';
import { execSync } from 'child_process';

// Function to update values based on matching key-value pairs
const updateValues = (payload, customValues) => {
    if (typeof payload === 'object') {
        for (const prop in payload) {
            updateValues(payload[prop], customValues);

            const matchingFind = customValues.find(({ find }) => isObjectMatch(payload[prop], find));

            if (matchingFind) {
                const { replace } = matchingFind;

                for (const replaceKey in replace) {
                    if (replace[replaceKey] === "") {
                        delete payload[prop];
                    } else if (payload[prop][replaceKey] !== undefined) {
                        payload[prop][replaceKey] = replace[replaceKey];
                    } else {
                        findAndReplaceNestedKey(payload[prop], replaceKey, replace[replaceKey]);
                    }
                }
            }
        }
        payload = removeNulls(payload);
    }
};

// Helper function to find and replace a nested key dynamically
const findAndReplaceNestedKey = (obj, targetKey, replacement) => {
    for (const key in obj) {
        if (typeof obj[key] === 'object') {
            findAndReplaceNestedKey(obj[key], targetKey, replacement);
        } else if (key === targetKey) {
            obj[key] = replacement;
        }
    }
};

// Helper function to check if two objects match
const isObjectMatch = (obj, criteria) =>
    Object.entries(criteria).every(([key, value]) => obj && obj.hasOwnProperty(key) && obj[key] === value);

const readPackageJson = async () => {
    try {
        const { repository, name } = JSON.parse(await fs.readFile('package.json', 'utf8'));

        const [prefix, repo] = repository?.split(':') || [];
        let repoUrl;
        if (prefix === 'github' && repo) {
            // Check if the repository name ends with '.git' and remove it
            const sanitizedRepo = repo.endsWith('.git') ? repo.slice(0, -4) : repo;

            // Construct the GitHub URL
            repoUrl = `https://github.com/${sanitizedRepo}`;
        } else {
            // Handle the case of an invalid GitHub string format
            console.error('Invalid GitHub string format. Please provide a valid GitHub repository string in the format "github:username/repo.git".');

            // Optionally, set repoUrl to a default value or handle the error accordingly
            repoUrl = undefined;
        }
        return { projectName: name || "", repoUrl };
    } catch (error) {
        console.error('Error reading or parsing package.json file:', error);
        throw new SemanticReleaseError(error, 'FETCH ERROR');

    }
};

const fetchPullRequestInfo = (repoUrl, token) => {
    const usernameAndRepo = repoUrl.split('/').slice(-2).join('/');
    const commitSHA = process.env?.COMMIT_SHA ?? "";
    const githubToken = token ?? process.env?.RTLDEV_MW_CI_TOKEN ?? process.env?.GH_TOKEN ?? process.env?.GITHUB_TOKEN;

    if (!githubToken || !commitSHA || !usernameAndRepo) {
        return;
    }

    try {
        const result = JSON.parse(execSync(`curl -s -L -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ${githubToken}" -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/${usernameAndRepo}/commits/${commitSHA}/pulls`, { encoding: 'utf-8' }))[0];

        if (result?.title || result?.head?.ref) {
            const jiraID = result?.title.match(/(RSRMID|GI)-\d+/g) || result?.head?.ref.match(/(RSRMID|GI)-\d+/g);
            return jiraID ? `https://centralnic.atlassian.net/browse/${jiraID}` : "";
        }
        return;
    } catch (error) {
        console.error(error.toString());
        return;
    }
};

const removeNulls = (obj) => {
    if (obj && typeof obj === "object") {
        if (Array.isArray(obj)) {
            // Remove null entries from arrays
            obj = obj.filter(item => item !== null);
        } else {
            // Remove null entries from objects
            for (const key in obj) {
                if (obj[key] === null) {
                    delete obj[key];
                } else {
                    obj[key] = removeNulls(obj[key]);
                }
            }
        }
    }
    return obj;
};

export { readPackageJson, updateValues, fetchPullRequestInfo };