import { assert } from 'chai';
import { User } from 'helpers';
import { UserTypes } from 'data';
import { Projects, Signin } from 'pages';
import { AuthSteps } from 'step';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('Projects page content').retry(2);

Before(async ({ I }) => {
  await I.amOnPage(`${BASE_URL}/signin`);
  const user = User.create(UserTypes.subscriber);
  await AuthSteps.auth(Signin, user);
  await I.wait(3);
  await I.amOnPage(`${BASE_URL}/projects/`);
});

After(async ({ I }) => {
  await I.clearCookie();
});

Scenario('Choose category', async ({ I }) => {
  await I.click(Projects.chooseCategory);
  const categoryName = 'Блог';
  await I.click(Projects.getCategoryByName(categoryName));
  await I.waitForVisible(Projects.chooseCategory, 5);
  const title = await I.grabTextFrom(Projects.currentCategory);
  assert.include(title, categoryName, `Категория ${categoryName} не была выбрана`);
});

Scenario('Posts by tags', async ({ I }) => {
  const post = `${BASE_URL}/post-about-something`;
  const medicineTagId = 1145;
  const tagElement = Projects.getTagById(medicineTagId);

  await I.amOnPage(post);
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Projects.tagList, 5);
  const numberOfPosts = parseInt(await I.grabTextFrom(`${tagElement} i`));
  await I.click(tagElement);
  await I.wait(5);
  await I.click(Projects.getProjectItemHeaderByIndex(numberOfPosts));
  await I.seeInCurrentUrl(post);
  await I.waitForVisible(Projects.returnToPreviousPage, 10);
  await I.click(Projects.returnToPreviousPage);
  await I.waitForVisible(Projects.getProjectItemHeaderByIndex(numberOfPosts), 10);
  await I.click(tagElement);
  await I.wait(5);
  await I.click(Projects.getProjectItemHeaderByIndex(numberOfPosts + 1));
  await I.waitForVisible(Projects.returnToPreviousPage, 10);
  await I.dontSeeInCurrentUrl(post);
});
