import { AuthSteps } from 'step';
import { Signin, Signup, Project } from 'pages';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';
import { UserTypes, projects } from 'data';
import { User, Allure } from 'helpers';

Feature('Redirects');

After(async ({ I }) => {
  await Allure.createStepsChain()
    .step('Очищение кук', async () => {
      await I.clearCookie();
    })
    .run();
});

Scenario('Redirect from create-project page', async ({ I }) => {
  const createProjectPage = `${BASE_URL}/project/create`;
  const user = User.create();

  await Allure.createStepsChain()
    .step('Незарегистрированный пользователь на странице создания проекта', async () => {
      await I.amOnPage(createProjectPage);
    })
    .step('Заполнение формы регистрации', async () => {
      await AuthSteps.auth(Signup, user);
    })
    .step('Редирект на страницу создания проекта', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitInUrl(createProjectPage);
    })
    .run();
});

Scenario('Callback saving while reg/auth switching', async ({ I }) => {
  const concreteProjectPage = projects.project1.url;
  const user = User.create(UserTypes.free);

  await Allure.createStepsChain()
    .step('Незарегистрированный пользователь на странице конкретного проекта', async () => {
      await I.amOnPage(concreteProjectPage);
    })
    .step('Пользователь кликает на вкладку с уровнями подписки', async () => {
      await I.click(Project.levelsTab);
    })
    .step('Пользователь кликает на кнопку подписки', async () => {
      await I.scrollTo(Project.paidSubscriptionButton);
      await I.click(Project.paidSubscriptionButton);
    })
    .step('Заполнение формы авторизации', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Signup.switchToAuth);
      await I.click(Signup.switchToAuth);
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Signin.authEmailInput);
      await AuthSteps.auth(Signin, user);
    })
    .step('Редирект на страницу конкретного проекта', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitInUrl(concreteProjectPage);
    })
    .run();
});

Scenario(
  'Redirect from project/manage to project/create if user has no projects',
  async ({ I }) => {
    const manageProjectPage = `${BASE_URL}/project/manage`;
    const createProjectPage = `${BASE_URL}/project/create`;
    const user = User.create(UserTypes.free);

    await Allure.createStepsChain()
      .step('Незарегистрированный пользователь на странице Мои проекты', async () => {
        await I.amOnPage(manageProjectPage);
      })
      .step('Заполнение формы авторизации', async () => {
        await AuthSteps.auth(Signin, user);
      })
      .step('Редирект на страницу создания проекта', async () => {
        await I.retry(PAGE_LOADING_RETRY_PARAMS).waitInUrl(createProjectPage);
      })
      .run();
  }
);

Scenario('Redirect from concrete project page', async ({ I }) => {
  const concreteProjectPage = projects.project1.url;
  const user = User.create();

  await Allure.createStepsChain()
    .step('Незарегистрированный пользователь на странице конкретного проекта', async () => {
      await I.amOnPage(concreteProjectPage);
    })
    .step('Пользователь кликает на кнопку подписки', async () => {
      await I.click(Project.subscribeButton);
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitInUrl('signup');
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Signup.regNameInput);
    })
    .step('Заполнение формы регистрации', async () => {
      await AuthSteps.auth(Signup, user);
    })
    .step('Редирект на страницу конкретного проекта', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitInUrl(concreteProjectPage);
    })
    .run();
});
