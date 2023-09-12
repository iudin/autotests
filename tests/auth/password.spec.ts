import { Main } from 'pages';
import { UserTypes } from 'data';
import { User } from 'helpers';
import { MainSteps, AuthSteps, UtilSteps } from 'step';
import { BASE_URL, TEST_MAILER_TIMEOUT } from 'tests/constants';

Feature('Reset password');

Before(async ({ I }) => {
  await I.amOnPage(BASE_URL);
});

After(async ({ I }) => {
  await I.clearCookie();
});

Scenario('User restores password from main page burger', async ({ I }) => {
  const user = User.create(UserTypes.free);
  await AuthSteps.goToResetPageFromMainPageBurger();
  await AuthSteps.resetPassword(user, null);
  await MainSteps.userOnPage(user);
  await I.wait(TEST_MAILER_TIMEOUT);
});

Scenario('User indicates short password while restoring', async ({ I }) => {
  const user = User.create(UserTypes.free).changePassword('1');
  await AuthSteps.goToResetPageFromMainPageBurger();

  const page = await AuthSteps.resetPassword(user, null);

  await I.wait(3);
  await I.seeElement('.error-message');
  await UtilSteps.approveActionByEmailLink(user.email, page);
  await I.switchToNextTab();
  await I.see('Some text');
  await I.click(Main.resetPassword);
});
