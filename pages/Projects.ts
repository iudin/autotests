export class ProjectsPage {
  private static page: ProjectsPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new ProjectsPage();
    }
    return this.page;
  }

  chooseCategory = locate('.select');
  randomAuthor = locate('a[href]').withText('Some text');
  numberOfPostsMonthly = locate('a[href]').withText('Some text');
  popularAuthor = locate('a[href]').withText('Some text');
  projectItemsList = locate('.list');
  currentCategory = locate('.current');
  tagList = locate('#tag-list');
  returnToPreviousPage = locate('.back');
  statValue = locate('.stat');

  getTagById = (id: number) => locate(`.td-m-hide #tag-list a[data-id="${id}"]`);

  getCategoryByName = (categoryName: string) => locate('.select label').withText(categoryName);

  getProjectItemHeaderByIndex = (postIndex: number) => locate('.short h2').at(postIndex);
}

export const Projects = ProjectsPage.getPage();
