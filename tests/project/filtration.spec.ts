import { assert } from 'chai';
import { projects } from 'data';
import { Project } from 'pages';

Feature('Project posts filtration');

const project = projects.project1;

Before(async ({ I }) => {
  await I.clearCookie();
  await I.amOnPage(project.url);
});

Scenario('Show all tags', async ({ I }) => {
  const numberOfHiddenTags = (await I.grabAttributeFromAll(Project.hiddenTags, 'data-id')).length;
  assert.isAbove(
    numberOfHiddenTags,
    0,
    `Список тегов для проекта ${project.name} не содержит скрытых тегов`
  );
  await I.scrollTo(Project.showAllTags);
  await I.click(Project.showAllTags);
  await I.dontSeeElement(Project.showAllTags);
  await I.seeNumberOfElements(Project.hiddenTags, 0);
});

Scenario('Filter projects by tag', async ({ I }) => {
  const tag = project.tags[0];
  const tagElement = Project.findTag(tag);
  await I.scrollTo(tagElement);
  await I.click(tagElement);

  await I.wait(1);
  const postsWithTag = Project.getPostsByTag(tag);
  await I.seeNumberOfElements(postsWithTag, 20);
});

Scenario('Filter projects by calendar', async ({ I }) => {
  Project.pickYearAndMonth('Янв', '2023');

  const postsInDay = 3;
  const date = '4';
  const dateValue = '04.01.2023';

  const dateElement = Project.getDateElement(date);
  await I.seeElement(dateElement.withChild(`i[data-count="${postsInDay}"]`));
  await I.click(dateElement);

  await I.seeInCurrentUrl('?post_date=');
  await I.wait(2);
  const posts = Project.article;
  await I.seeNumberOfElements(posts, postsInDay);

  const dateValues = await I.grabTextFromAll(Project.postDateValue);
  assert.isTrue(
    dateValues.every((value) => value.includes(dateValue)),
    `Не все посты имеют выбранную дату, ${dateValues}`
  );
});
