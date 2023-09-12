import { AuthSteps, MainSteps } from 'step';
import { Main, Signup } from 'pages';
import { User } from 'helpers';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('Register');

Before(async ({ I }) => {
  await I.amOnPage(BASE_URL);
});

After(async ({ I }) => {
  await I.clearCookie();
});

Scenario('User signed after Registration', async ({ I }) => {
  const user = User.create();
  await AuthSteps.auth(Signup, user);

  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.sendConfirmation);
  await MainSteps.userOnPage(user);
});

Scenario('User indicates wrong mail', async ({ I }) => {
  const user = User.create().wrongEmail();
  await AuthSteps.auth(Signup, user);

  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForText('Some text');
});
