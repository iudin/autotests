import { assert } from 'chai';
import { generate } from 'randomstring';
import { User, Allure } from 'helpers';
import { UserTypes } from 'data';
import { Signin, Post, Main, ManageProject } from 'pages';
import { AuthSteps, PostSteps } from 'step';
import { BASE_URL, PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

Feature('New post creation');

Before(async ({ I }) => {
  await Allure.createStepsChain()
    .step(`Логин с юзером ${UserTypes.author}`, async () => {
      await I.amOnPage(`${BASE_URL}/signin`);
      const user = User.create(UserTypes.author);
      await AuthSteps.auth(Signin, user);
    })
    .run();
});

After(async ({ I }) => {
  await Allure.createStepsChain()
    .step('Очищение кук', async () => {
      await I.clearCookie();
    })
    .run();
});

Scenario('Author creates a new post', async () => {
  let postTitle: string;
  await Allure.createStepsChain()
    .step('Создание простого поста', async () => {
      postTitle = await PostSteps.createPost();
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

Scenario('Reader sees a new public post', async ({ I }) => {
  let textOfPost: string;
  await Allure.createStepsChain()
    .step('Создание простого поста', async () => {
      textOfPost = await PostSteps.createPost();
    })
    .step('Очищение кук', async () => {
      await I.clearCookie();
    })
    .step(`Логин с юзером ${UserTypes.free}`, async () => {
      await I.amOnPage(`${BASE_URL}/signin`);
      const user = User.create(UserTypes.free);
      await AuthSteps.auth(Signin, user);
      await I.wait(3);
    })
    .step('Переход на страницу проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/`);
    })
    .step('Проверка видимости нового поста у подписчика', async () => {
      await I.seeTextEquals(textOfPost, Post.lastPublishedPost);
    })
    .run();
});

Scenario('Create post from my projects', async ({ I }) => {
  await Allure.createStepsChain()
    .step('Переход на страницу Мои проекты', async () => {
      await Main.goToProjectManagePageThroughBurger();
    })
    .step('Переход на страницу создания поста', async () => {
      await ManageProject.createNewPost();
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Post.postTitle);
    })
    .run();
});

Scenario('Create post from another post', async ({ I }) => {
  await Allure.createStepsChain()
    .step('Переход на страницу проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/`);
    })
    .step('Переход на последний опубликованный пост', async () => {
      await I.click(Post.lastPublishedPost);
    })
    .step('Переход на страницу создания поста', async () => {
      await ManageProject.createNewPost();
      await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Post.postTitle);
    })
    .run();
});

Scenario('Author creates a new post with image', async ({ I }) => {
  const image = 'data/artifacts/image.jpeg';
  let postTitle: string;

  await Allure.createStepsChain()
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление предыдущего поста', async () => {
      const lastPostTitle = await I.grabTextFrom(Post.lastPublishedPost);
      await PostSteps.deletePost(lastPostTitle.trim());
    })
    .step('Создание поста с изображением', async () => {
      postTitle = await PostSteps.createPost(Post.createPostWithImage, image);
    })
    .step('Переход на страницу поста', async () => {
      await PostSteps.goToPost(postTitle);
    })
    .step('Проверка доступности изображения', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).seeElement(Post.imageItem);
    })
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

Scenario('Author creates a new post with gallery', async ({ I }) => {
  const image = 'data/artifacts/image.jpeg';
  let postTitle: string;

  await Allure.createStepsChain()
    .step('Создание поста с галереей изображений', async () => {
      postTitle = await PostSteps.createPost(Post.createPostWithGallery, image);
    })
    .step('Переход на страницу поста', async () => {
      await PostSteps.goToPost(postTitle);
    })
    .step('Проверка доступности галереи', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).seeElement(Post.galleryItem);
      await I.seeElement(Post.imageInGalleryItem);
    })
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

Scenario('Author creates a new post with audio', async ({ I }) => {
  const audio = 'data/artifacts/audio.wav';
  let postTitle: string;

  await Allure.createStepsChain()
    .step('Создание поста с аудиофайлом', async () => {
      postTitle = await PostSteps.createPost(Post.createPostWithAudio, audio);
    })
    .step('Переход на страницу поста', async () => {
      await PostSteps.goToPost(postTitle);
    })
    .step('Проверка доступности аудиофайла', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).seeElement(
        Post.getAudioPlayerByFileName(audio.split('/')[2])
      );
    })
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

Scenario('Author creates a new post with poll', async ({ I }) => {
  const textOfPoll = generate(10);
  let postTitle: string;

  await Allure.createStepsChain()
    .step('Создание поста с опросом', async () => {
      postTitle = await PostSteps.createPost(Post.createPostWithPoll, textOfPoll);
    })
    .step('Переход на страницу поста', async () => {
      await PostSteps.goToPost(postTitle);
    })
    .step('Проверка доступности опроса', async () => {
      const pollTitle = await I.grabTextFrom(Post.pollItemTitle);
      assert.include(pollTitle, textOfPoll, `Опрос не содержит заголовок равный ${textOfPoll} `);

      await I.seeElement(Post.pollVote);

      const pollValue = await I.grabTextFrom(Post.pollValue);
      assert.include(pollValue, textOfPoll, `Опрос не содержит вариант равный ${textOfPoll} `);
    })
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

Scenario('Author creates a new post with attachment', async ({ I }) => {
  const file = 'data/artifacts/attachment.pdf';
  let postTitle: string;

  await Allure.createStepsChain()
    .step('Создание поста с прикрепленным файлом', async () => {
      postTitle = await PostSteps.createPost(Post.createPostWithAttachment, file);
    })
    .step('Переход на страницу поста', async () => {
      await PostSteps.goToPost(postTitle);
    })
    .step('Проверка доступности прикрепленного файла', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).seeElement(Post.fileItem);
    })
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

Scenario('Author creates a new post with youtube video', async ({ I }) => {
  const url = 'https://www.youtube.com/watch?v=some-video';
  let postTitle: string;

  await Allure.createStepsChain()
    .step('Создание поста с видео', async () => {
      postTitle = await PostSteps.createPost(Post.createPostWithVideo, url);
    })
    .step('Переход на страницу поста', async () => {
      await PostSteps.goToPost(postTitle);
    })
    .step('Проверка доступности видео', async () => {
      await I.retry(PAGE_LOADING_RETRY_PARAMS).seeElement(Post.videoItem);
    })
    .step('Переход на страницу опубликованных постов проекта', async () => {
      await I.amOnPage(`${BASE_URL}/autotest/manage/`);
    })
    .step('Удаление поста', async () => {
      await PostSteps.deletePost(postTitle);
    })
    .run();
});

const styles = [
  [Post.editorBold, Post.editorBoldTag],
  [Post.editorItalic, Post.editorItalicTag],
  [Post.editorLink, Post.editorLinkTag],
  [Post.editorHeader, Post.editorHeaderTag],
  [Post.editorBlockquote, Post.editorBlockquoteTag],
  [Post.editorListBullet, Post.editorListBulletTag],
  [Post.editorListOrdered, Post.editorListOrderedTag],
  [Post.editorCodeLine, Post.editorCodeLineTag],
  [Post.editorCodeBlock, Post.editorCodeBlockTag],
];

Scenario('Author changes font style', async () => {
  const checkAllStyles = async () => {
    for (const style of styles) {
      const [action, tag] = style;
      const checkStyle = Post.changeFontStyle(action, tag);
      await checkStyle();
    }
  };
  await PostSteps.createPost(checkAllStyles);
});
