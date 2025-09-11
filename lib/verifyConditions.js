import AggregateError from "aggregate-error";
import resolveConfig from "./resolve-config.js";
import getError from "./get-error.js";

export default async (pluginConfig, context) => {
    const cfg = await resolveConfig(pluginConfig, context);

    const errors = [];
    
    // Check if Teams webhook is provided
    if (cfg.teamsWebhook === false) {
        errors.push(getError("NoTeamsWebhook"));
    } else if (cfg.teamsWebhook) {
        // If provided, validate URL format
        try {
            new URL(cfg.teamsWebhook);
        } catch (e) {
            errors.push(getError("InvalidTeamsWebhook"));
        }
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