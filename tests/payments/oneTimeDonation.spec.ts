import { Allure, User } from 'helpers';
import { UserTypes, defaultMastercard, projects } from 'data';
import { Signin } from 'pages';
import { AuthSteps, PaymentSteps } from 'step';
import { BASE_URL } from 'tests/constants';

Feature('One-time donation');

const project = projects.project2;

Before(async ({ I }) => {
  await Allure.createStepsChain()
    .step(`Логин с юзером ${UserTypes.subscriber}`, async () => {
      await I.amOnPage(`${BASE_URL}/signin`);
      const user = User.create(UserTypes.subscriber);
      await AuthSteps.auth(Signin, user);
      await I.wait(3);
    })
    .run();
});

After(async ({ I }) => {
  await Allure.createStepsChain()
    .step('Очищение кук', async () => {
      await I.clearCookie();
    })
    .run();
});

Scenario('No access to paid content after one-time donation', async () => {
  await PaymentSteps.makeOneTimeDonationFromNewCard(project, defaultMastercard);
});
