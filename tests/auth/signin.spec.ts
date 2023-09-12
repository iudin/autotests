import { AuthSteps, MainSteps } from 'step';
import { UserTypes } from 'data';
import { User } from 'helpers';
import { Signin } from 'pages';
import { BASE_URL } from 'tests/constants';

Feature('Signin');

Before(async ({ I }) => {
  await I.amOnPage(`${BASE_URL}/signin`);
});

After(async ({ I }) => {
  await I.clearCookie();
});

Scenario('Page is avaliable', async ({ I }) => {
  await I.see('Some text');
});

Scenario('User successfully signed in', async () => {
  const user = User.create(UserTypes.author);
  await AuthSteps.auth(Signin, user);

  await MainSteps.userOnPage(user);
});
