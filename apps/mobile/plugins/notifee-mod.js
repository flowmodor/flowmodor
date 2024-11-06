const { withProjectBuildGradle } = require('expo/config-plugins');

module.exports = function withNotifeeRepo(config) {
  return withProjectBuildGradle(config, async (config) => {
    const contents = config.modResults.contents;

    if (!contents.includes('@notifee/react-native')) {
      const replacement = `maven { url 'https://www.jitpack.io' }
        maven {
            url "$rootDir/../../../node_modules/@notifee/react-native/android/libs"
        }`;
      config.modResults.contents = contents.replace(
        "maven { url 'https://www.jitpack.io' }",
        replacement,
      );
    }

    return config;
  });
};
