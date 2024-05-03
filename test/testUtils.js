const getBaseConfig = packageName => {
  return {
      notifyOnSuccess: true,
      notifyOnFail: true,
      markdownReleaseNotes: true,
      packageName
  };
};

const getContext = (branchName = 'main') => {
  const version = '2.0.0';
  return {
      logger: console,
      nextRelease: {
          version,
          gitTag: `v${version}`,
          notes: 'hello'
      },
      options: {
          repositoryUrl:
              'git+https://github.com/centralnicgroup-opensource/rtldev-middleware-semantic-release-notify-plugin.git'
      },
      env: {
          npm_package_name: 'internal test',
          TEAMS_NOTIFICATION_URI: process.env.TEAMS_NOTIFICATION_URI,
          GITHUB_TOKEN: process.env.GITHUB_TOKEN,
          DEBUG: true
      },
      errors: ['Something went horribly wrong'],
      branch: {
          name: branchName
      }
  };
};

export { getBaseConfig, getContext };
