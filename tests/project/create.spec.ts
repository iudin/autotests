import { User } from 'helpers';
import { UserTypes, createRandomNewProject } from 'data';
import { Main, Signin, Signup, CreateProject, ManageProject } from 'pages';
import { AuthSteps, ManageProjectSteps } from 'step';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('Create project');

Before(async ({ I }) => {
  await I.clearCookie();
});

Scenario('Check all create-project links on the main page', async ({ I }) => {
  const user = User.create(UserTypes.subscriber);

  await I.amOnPage(`${BASE_URL}/signin`);
  await AuthSteps.auth(Signin, user);
  await I.wait(3);

  await I.amOnPage(BASE_URL);
  await I.wait(3);

  await Main.goToCreateProjectPageThroughProfileMenu();
  await I.retry(PAGE_LOADING_RETRY_PARAMS).seeInCurrentUrl('/project/create');
  await I.executeScript('window.history.back();');

  await Main.goToCreateProjectPageThroughWhatIsBlock();
  await I.retry(PAGE_LOADING_RETRY_PARAMS).seeInCurrentUrl('/project/create');
  await I.executeScript('window.history.back();');

  await Main.goToCreateProjectPageThroughHowToBlock();
  await I.seeInCurrentUrl('/project/create');
  await I.executeScript('window.history.back();');

  await Main.goToCreateProjectPageThroughFooterAccountMenu();
  await I.retry(PAGE_LOADING_RETRY_PARAMS).seeInCurrentUrl('/project/create');
  await I.executeScript('window.history.back();');

  await Main.goToCreateProjectPageThroughFooterButton();
  await I.retry(PAGE_LOADING_RETRY_PARAMS).seeInCurrentUrl('/project/create');
});

Scenario('Create new project', async ({ I }) => {
  const user = User.create();

  await I.amOnPage(BASE_URL);
  await Main.goToCreateProjectPageThroughWhatIsBlock();

  await I.waitForElement(Signup.regEmailInput);
  await AuthSteps.auth(Signup, user);

  await CreateProject.checkIsCreateProjectPage();

  const projectData = createRandomNewProject(['Category 1', 'Category 2', 'Category 3']);
  await CreateProject.createNewProject(projectData);
  await I.wait(3);

  await ManageProject.checkIsManageProjectPage();

  await ManageProjectSteps.checkHasNotActiveProject(projectData);
  await ManageProject.checkNotActiveProjectControls();
});
