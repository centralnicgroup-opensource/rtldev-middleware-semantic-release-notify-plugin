import micromatch from 'micromatch';

export default function getBranchConfig(pluginConfig, context) {
  const {
    branch: { name }
  } = context;

  const { branchesConfig = [], ...globalPluginConfig } = pluginConfig;
  const { pattern, ...branchConfig } =
    branchesConfig.find(({ pattern }) => micromatch.isMatch(name, pattern)) ||
    {};

  return { ...globalPluginConfig, ...branchConfig };
}
