import { assert } from 'chai';
import { UserTypes } from 'data';
import { User, Allure, Severity } from 'helpers';
import { Main, Project, Signin } from 'pages';
import { AuthSteps } from 'step';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('Main page content');

Before(async ({ I }) => {
  await Allure.createStepsChain()
    .step(`Логин с юзером ${UserTypes.free}`, async () => {
      await I.amOnPage(`${BASE_URL}/signin/?redirect_url=%2F`);
      const user = User.create(UserTypes.free);
      await AuthSteps.auth(Signin, user);
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

Scenario("Projects' header exists", async ({ I }) => {
  await Allure.severity(Severity.blocker)
    .createStepsChain()
    .step('На странице есть заголовок "Проекты"', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.projectsHeader);
      const header = await I.grabTextFrom(Main.projectsHeader);
      assert.include(header, 'Проекты', 'Заголовок блока Проекты не найден');
    })
    .run();
});

Scenario('Projects block contains items', async ({ I }) => {
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.projectItem);
  await I.seeNumberOfElements(Main.projectItem, 6);
});

Scenario('Click join to project', async ({ I }) => {
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.projectItem);
  await I.scrollTo(Main.projectItem);
  await I.moveCursorTo(Main.projectItem);
  await I.click(Main.joinProject);
  await I.seeInCurrentUrl('/join');
});

Scenario('Click on project', async ({ I }) => {
  await Allure.createStepsChain()
    .step('Клик по ховеру в первом проекте на главной', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.projectItem);
      await I.scrollTo(Main.projectItem);
      await I.moveCursorTo(Main.projectItem);
      await I.click(Main.linkToProjectOnHover);
    })
    .step('На странице есть информация о проекте', async () => {
      await I.waitForElement(Project.projectData, 10);
    })
    .run();
});

Scenario('Go to all categories', async ({ I }) => {
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.allCategories);
  await I.click(Main.allCategories);
  await I.seeInCurrentUrl('/projects');
});

Scenario('Go to all projects', async ({ I }) => {
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.allProjects);
  await I.scrollTo(Main.allProjects);
  await I.click(Main.allProjects);
  await I.seeInCurrentUrl('/projects');
});
