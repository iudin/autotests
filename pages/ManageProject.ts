import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class ManageProjectPage {
  private static page: ManageProjectPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new ManageProjectPage();
    }
    return this.page;
  }

  header = locate('.project-header');
  title = locate('h1').withText('Some text');

  notActiveProject = locate('article');
  waitingForLaunch = locate('a[data-close="data"]').inside(this.notActiveProject);
  notActiveProjectTitle = locate('a').inside('h2').inside(this.notActiveProject);

  launchButton = locate('a.btn').withText('Some text');
  editButton = locate('a').withText('Some text');
  createPostButtonForNonActiveProject = locate('a')
    .withText('Some text')
    .inside(this.notActiveProject);
  createPostButton = locate("a[href*='new']");

  async checkIsManageProjectPage() {
    await I.seeInCurrentUrl('/project/manage');
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.header, 3);
    await I.seeElement(this.title);
  }

  async checkNotActiveProjectControls() {
    await I.seeElement(this.launchButton);
    await I.seeElement(this.editButton);
    await I.seeElement(this.createPostButtonForNonActiveProject);
  }

  async createNewPost() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.createPostButton);
    await I.scrollTo(this.createPostButton);
    await I.click(this.createPostButton);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).seeInCurrentUrl('/post/new/');
  }
}

export const ManageProject = ManageProjectPage.getPage();
