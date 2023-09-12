import { assert } from 'chai';
import { ManageProject } from 'pages';
import { CreateProjectData } from 'data';

const { I } = inject();

export class ManageProjectSteps {
  static async checkHasNotActiveProject(project: CreateProjectData) {
    await I.seeElement(ManageProject.notActiveProject);
    await I.scrollTo(ManageProject.notActiveProject);
    await I.seeElement(ManageProject.waitingForLaunch);

    const title = await I.grabTextFrom(ManageProject.notActiveProjectTitle);
    const href = await I.grabAttributeFrom(ManageProject.notActiveProjectTitle, 'href');

    assert.strictEqual(title, project.name, `Название проекта не совпадает с ${project.name}`);
    assert.include(href, project.url, `Ссылка на проект не совпадает с ${project.url}`);
  }
}
