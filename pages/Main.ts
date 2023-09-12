import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class MainPage {
  private static page: MainPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new MainPage();
    }
    return this.page;
  }

  resetPassword = locate('a[href="/reset/"]');
  sendConfirmation = locate('#send');

  headerName = locate('.header');
  burger = locate('.burger');
  authLinkSignin = locate('.auth').withText('Some text');

  profile = locate('.profile');
  profileNav = locate('.profile-nav');
  newProjectInProfile = locate('a').withText('Some text');
  balanceInProfile = locate('a').withText('Some text');
  myProjects = locate('a').withText('Some text');

  whatIsBlock = locate('.what').withDescendant('h2').withText('Some text');
  newProjectInWhatIs = locate('a').withText('Some text');

  howToBlock = locate('.class').withDescendant('h2').withText('Some text');
  newProjectInHowTo = locate('a').withText('Some text');

  allProjects = locate("a[href='/projects/']").withText('Some text');
  allCategories = locate("a[href='/projects/']").withText('Some text');
  joinProject = locate('.btn').withText('Some text');
  projectItem = locate('.project');
  projectsHeader = locate('.header');
  linkToProjectOnHover = locate(`${this.projectItem} .card`);

  footer = locate('footer');
  footerAccountMenu = locate('div').withChild('h3').withText('Some text');
  newProjectInFooterAccountMenu = locate('a').withText('Some text');
  newProjectButtonInFooter = locate('a.btn').withText('Some text');
  progressBar = locate('.p-bar');

  async getUserName() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.headerName);
    return await I.grabTextFrom(this.headerName);
  }

  async goToSigninPageThroughBurger() {
    await I.click(Main.authLinkSignin);
    await I.wait(1);
    await I.seeInCurrentUrl('/signin');
  }

  async goToProjectManagePageThroughBurger() {
    await I.waitForElement(this.profile, 10);
    await I.moveCursorTo(this.profile);
    await I.waitForElement(this.myProjects, 10);
    await I.click(this.myProjects);
  }

  async goToResetPage() {
    await I.scrollTo(this.resetPassword);
    await I.click(this.resetPassword);
    await I.seeInCurrentUrl('/reset');
  }

  async goToCreateProjectPageThroughProfileMenu() {
    await I.moveCursorTo(this.profile);
    await I.moveCursorTo(this.profileNav);
    await I.scrollTo(this.newProjectInProfile);
    await I.click(this.newProjectInProfile);
  }

  async goToCreateProjectPageThroughWhatIsBlock() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.whatIsBlock);
    await I.scrollTo(this.whatIsBlock);
    await I.click(this.newProjectInWhatIs);
  }

  async goToCreateProjectPageThroughHowToBlock() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Main.howToBlock);
    await I.scrollTo(this.newProjectInHowTo);
    await I.click(this.newProjectInHowTo);
  }

  async goToCreateProjectPageThroughFooterAccountMenu() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.footer);
    await I.scrollTo(this.footer);
    await I.click(this.newProjectInFooterAccountMenu);
  }

  async goToCreateProjectPageThroughFooterButton() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.footer);
    await I.scrollTo(this.footer);
    await I.click(this.newProjectButtonInFooter);
  }

  async getBalanceFromProfileMenu() {
    await I.moveCursorTo(this.profile);
    const currentAmount = await I.grabTextFrom(locate('b').inside(this.balanceInProfile));
    return Number(currentAmount.replace(/[\s₽]/g, ''));
  }
}

export const Main = MainPage.getPage();
