import { AuthSteps } from 'step';
import { Project, Signin, Main, Post } from 'pages';
import { projects, UserTypes } from 'data';
import { User } from 'helpers';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('Project availability').retry(2);

const project = projects.project1;

Before(async ({ I }) => {
  await I.clearCookie();
  await I.amOnPage(project.url);
});

Scenario('Project is available', async () => {
  await Project.checkProjectIsAvailable(project);
});

Scenario('Filters on page', async ({ I }) => {
  const filters = [Project.reviewTab, Project.levelsTab, Project.filtersTab, Project.projectTab];
  await Project.checkFiltersAreVisible();
  await I.wait(1);
  for (const filter of filters) {
    await Project.checkFilterIsInteractive(filter);
  }
});

Scenario('Pagination is working', async ({ I }) => {
  const posts = Project.article;
  await I.seeNumberOfElements(posts, 20);
  await I.scrollTo(Project.showMore);
  await I.click(Project.showMore);
  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForResponse(
    `${BASE_URL}/project/${project.id}/posts/?offset=20`
  );
  await I.wait(1);
  await I.seeNumberOfElements(posts, 40);
});

Scenario('Comments', async ({ I }) => {
  const user = User.create(UserTypes.subscriber);
  await Main.goToSigninPageThroughBurger();
  await AuthSteps.auth(Signin, user);

  await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Project.comments, 3);
  await I.scrollTo(Project.comments);
  await I.click(Project.comments);
  await I.seeInCurrentUrl('#comment-list');

  await Post.checkCommentsAreAvailable();
});

Scenario(`Post on project's page`, async ({ I }) => {
  const id = project.posts[0]?.id;
  const title = project.posts[0]?.title;
  const post = Project.findPostById(id);
  const postTitle = Project.getPostTitle(post);
  await I.seeElement(post);
  await I.seeElement(postTitle.withText(title));
  await I.click(postTitle);
  await I.seeInCurrentUrl(`${id}`);
});
