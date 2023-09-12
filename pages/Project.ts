import { ProjectData } from 'data';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class ProjectPage {
  private static page: ProjectPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new ProjectPage();
    }
    return this.page;
  }

  projectTab = locate('[data-tab="project"]');
  reviewTab = locate('[data-tab="review"]');
  levelsTab = locate('[data-tab="levels"]');
  filtersTab = locate('[data-tab="filters"]');

  projectData = locate('.project-data');
  projectTitle = locate('h1').inside(this.projectData);
  subscribeButton = locate('a').withText('Some text');
  paidSubscriptionButton = locate('a').withText('Some text');

  postList = locate('#list');
  showMore = locate('#show-more').withText('Some text');
  article = locate('article').inside(this.postList);
  comments = locate('.before').inside(this.article);
  postDateValue = locate('.post').inside(this.article);
  lockMessage = locate('.message').inside(this.article);

  tagList = locate('#tag').withChild('h3').withText('Some text');
  showAllTags = locate('#all').withText('Some text');
  hiddenTags = locate('.hidden').inside(this.tagList);

  datepicker = locate('.datepicker').inside(locate('div').after(this.tagList));
  datepickerTitle = locate('.datepicke-title').inside(this.datepicker);
  datepickerYear = locate('.datepicker-year').inside(this.datepicker);
  datepickerMonth = locate('.datepicker-month').inside(this.datepicker);
  datepickerDay = locate('.datepicker-day').inside(this.datepicker);

  oneTimeDonationItem = locate('.item')
    .withDescendant('h5')
    .withText('Some text')
    .inside(this.levelsTab);
  oneTimeDonationButton = locate('a[rel="nofollow"]')
    .withText('Some text')
    .inside(this.oneTimeDonationItem);

  async checkProjectIsAvailable(project: ProjectData) {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(
      this.projectTitle.withText(project.name)
    );
  }

  async checkFiltersAreVisible() {
    await I.seeElement(this.projectTab);
    await I.seeElement(this.reviewTab);
    await I.seeElement(this.levelsTab);
    await I.seeElement(this.filtersTab);
  }

  async checkFilterIsInteractive(filter: CodeceptJS.Locator) {
    await I.click(filter);
    await I.seeElement(filter.withAttr({ class: 'active' }));
  }

  findTag(text = '') {
    return locate('.filter-tag').inside(this.tagList).withText(text);
  }

  findPostById(id: number) {
    return this.article.withAttr({ id: `post${id}` });
  }

  findPostByTitle(title: string) {
    return this.article.withDescendant(`a[href*="${title}"]`);
  }

  getPostTitle(post: CodeceptJS.LocatorOrString) {
    return locate('a').inside('h2').inside(post);
  }

  getPostsByTag(tag = '') {
    return locate('a').withText(tag);
  }

  async pickYearAndMonth(month: string, year: string) {
    await I.scrollTo(this.datepickerTitle);
    await I.click(this.datepickerTitle);
    await I.click(this.datepickerTitle);
    await I.click(this.datepickerYear.withText(year));
    await I.click(this.datepickerMonth.withText(month));
  }

  getDateElement(date: string) {
    return this.datepickerDay.withAttr({ 'data-date': date });
  }

  async goToOneTimeDonation() {
    await I.click(this.levelsTab);
    await I.seeElement(this.oneTimeDonationItem);
    await I.scrollTo(this.oneTimeDonationButton);
    await I.click(this.oneTimeDonationButton);
  }

  findLevelByName(name: string) {
    return locate('.item').withDescendant('h5').withText(name);
  }

  async goToSubscriptionByLevelName(name: string) {
    await I.click(this.levelsTab);
    const levelItem = this.findLevelByName(name);
    await I.seeElement(levelItem);

    const levelSubscribeButton = locate('a[rel="nofollow"]').inside(levelItem);
    await I.scrollTo(levelSubscribeButton);
    await I.click(levelSubscribeButton);
  }
}

export const Project = ProjectPage.getPage();
