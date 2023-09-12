import { UserTypes } from 'data';
import { User } from 'helpers';
import { Signin } from 'pages';
import { AuthSteps } from 'step';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('Feed');

Before(async ({ I }) => {
  await I.amOnPage(`${BASE_URL}/signin`);
  const user = User.create(UserTypes.author);
  await AuthSteps.auth(Signin, user);
  await I.wait(3);
  await I.amOnPage('/url');
});

Scenario('"Show more" avaliable at /url', async ({ I }) => {
  const showMore = locate('#show-more').withText('Some text');
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(showMore);
  await I.click(showMore);
});
