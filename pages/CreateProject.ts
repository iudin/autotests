import { CreateProjectData } from 'data';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class CreateProjectPage {
  private static page: CreateProjectPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new CreateProjectPage();
    }
    return this.page;
  }

  title = locate('h1').withText('Some text');
  createProjectForm = locate('#form').withAttr({ action: '/project/create' });

  projectTitleInput = locate('#title').inside(this.createProjectForm);
  projectUrlInput = locate('#url').inside(this.createProjectForm);
  projectCategories = locate('p').withDescendant(locate('b').withText('Some text'));
  projectDescriptionEditor = locate('#editor').inside(this.createProjectForm);
  createProjectSubmitButton = locate('input')
    .inside(this.createProjectForm)
    .withAttr({ type: 'submit', value: 'Some text' });

  async checkIsCreateProjectPage() {
    await I.seeInCurrentUrl('/project/create');
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.title, 3);
    await I.seeElement(this.createProjectForm);
  }

  getCategoryCheckboxByName(name: string) {
    return locate('b').inside(
      locate('label').inside(this.projectCategories).withChild('i').withText(name)
    );
  }

  async createNewProject(data: CreateProjectData) {
    await I.scrollTo(this.projectTitleInput);
    await I.fillField(this.projectTitleInput, data.name);

    await I.scrollTo(this.projectUrlInput);
    await I.fillField(this.projectUrlInput, data.url);

    await I.scrollTo(this.projectCategories);
    const checkboxes = data.categories.map<CodeceptJS.Locator>(
      this.getCategoryCheckboxByName.bind(this)
    );
    for (const checkbox of checkboxes) {
      await I.click(checkbox);
    }

    await I.scrollTo(this.projectDescriptionEditor);
    await I.click(this.projectDescriptionEditor);
    await I.type(data.description);

    await I.scrollTo(this.createProjectSubmitButton);
    await I.click(this.createProjectSubmitButton);
  }
}

export const CreateProject = CreateProjectPage.getPage();
