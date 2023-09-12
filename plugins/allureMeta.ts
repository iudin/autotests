import { event, output, container } from 'codeceptjs';

module.exports = function () {
  let currentSuiteTitle = '';

  event.dispatcher.on(event.suite.before, ({ title }) => {
    currentSuiteTitle = title;
  });

  event.dispatcher.on(event.test.started, () => {
    try {
      const allure = container.plugins('allure');
      allure.feature(currentSuiteTitle);
    } catch (error) {
      output.error((error as Error).message);
    }
  });

  event.dispatcher.on(event.suite.after, () => {
    currentSuiteTitle = '';
  });
};
