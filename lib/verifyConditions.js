import AggregateError from "aggregate-error";
import resolveConfig from "./resolve-config.js";
import getError from "./get-error.js";

export default async (pluginConfig, context) => {
    const cfg = await resolveConfig(pluginConfig, context);

    const errors = [];
    if (cfg.teamsWebhook === false) {
        errors.push(getError("NoTeamsWebhook"));
    }

    if (cfg.packageName === false) {
        errors.push(getError("NoPackageName"));
    }

    if (cfg.githubToken === false) {
        errors.push(getError("NoGithubToken"));
    }
    
    if (errors.length > 0) {
        throw new AggregateError(errors);
    }

    return true;
};