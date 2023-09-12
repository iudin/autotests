import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
import { users } from 'data/users';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: 'tests/*/*.spec.ts',
  output: 'output',
  helpers: {
    Playwright: {
      url: 'https://some-url.com',
      show: true,
      browser: 'chromium',
      basicAuth: { username: 'username', password: 'passwd' },
      keepCookies: true,
      windowSize: '1920x1080',
    },
  },
  plugins: {
    autoLogin: {
      enabled: true,
      saveToFile: true,
      inject: 'login',
      users: users.reduce((acc, userName) => {
        acc[userName] = {
          login: (I) => I.loginUser(userName, userName),
          check: (I) => I.seeElement(locate('.header-name')),
          restore: (I, cookies) => I.restore(cookies),
        };
        return acc;
      }, {}),
    },
    allure: {
      enabled: true,
      deleteSuccessful: false,
      screenshotsForAllureReport: true,
      outputDir: './output/allure',
      require: '@codeceptjs/allure-legacy',
    },
    allureMeta: {
      enabled: true,
      require: './plugins/allureMeta.ts',
    },
  },
  include: {
    I: 'steps_file',
  },
  name: 'e2e',
  fullPromiseBased: true,
};
