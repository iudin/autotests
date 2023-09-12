import { generate } from 'randomstring';
import { assert } from 'chai';
import { Main, Post, ManageProject, Project } from 'pages';
import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';
import { Allure } from 'helpers';

const { I } = inject();

export class PostSteps {
  static async createPost(action?: (param?) => Promise<void>, param?) {
    const textOfPost = generate(10);

    await Allure.createStepsChain()
      .step('Переход на страницу проектов', async () => {
        await Main.goToProjectManagePageThroughBurger();
      })
      .step('Переход на страницу создания поста', async () => {
        await ManageProject.createNewPost();
      })
      .step('Заполнение полей – название и текст', async () => {
        await I.waitForElement(Post.postTitle, 5);
        await I.fillField(Post.postTitle, textOfPost);
        if (action) {
          await action(param);
        }
        await I.fillField(Post.editor, textOfPost);
      })
      .step('Публикация поста', async () => {
        await I.click(Post.publishButton);
        await I.retry(PAGE_LOADING_RETRY_PARAMS).seeInCurrentUrl('/manage/');
      })
      .step('Просмотр опубликованного поста', async () => {
        await I.seeTextEquals(textOfPost, Post.lastPublishedPost);
      })
      .run();

    return textOfPost;
  }

  static async goToPost(postTitle: string) {
    const post = Project.findPostByTitle(postTitle);
    const link = Project.getPostTitle(post);
    await I.seeElement(link);
    await I.click(link);
  }

  static async deletePost(postTitle: string) {
    const post = Project.findPostByTitle(postTitle);
    const deletePostButton = locate('a.btn').withText('Some text');

    await Allure.createStepsChain()
      .step('Нажатие кнопки Удалить и подтверждение удаления', async () => {
        await I.usePlaywrightTo('check and close alert dialog', async ({ page }) => {
          try {
            page.on('dialog', (dialog) => {
              dialog.accept();
            });
          } catch (error) {
            assert.fail('alert dialog error', error);
          }
        });
        await I.click(deletePostButton);
      })
      .step('Проверка отсутствия поста на странице', async () => {
        await I.waitForInvisible(Main.progressBar, 10);
        await I.dontSeeElement(post);
      })
      .run();
  }
}
