import { PAGE_LOADING_RETRY_PARAMS } from 'tests/constants';

const { I } = inject();

class PostPage {
  private static page: PostPage;

  private constructor() {}

  static getPage() {
    if (!this.page) {
      this.page = new PostPage();
    }
    return this.page;
  }

  commentForm = locate('#form');
  commentsCount = locate('#comments');
  commentList = locate('#comment-list');
  postTitle = locate('#title');
  editor = locate('#editor');
  publishButton = locate("input[type='submit']").withAttr({ value: 'Some text' });
  imageAttachButton = locate("label[for*='img']");
  galleryAttachButton = locate("label[for*='gallery']");
  videoTargetButton = locate("a[data-target*='video']");
  audioTargetButton = locate("a[data-target*='audio']");
  attachmentTargetButton = locate("a[data-target*='file']");
  pollTargetButton = locate("a[data-target*='pull']");
  videoUrlField = locate('.add-video');
  addVideo = locate('.add-video-tab');
  fileAttachButton = locate("label[for='select-file']");
  loadPercentage = locate('.post-file-row');
  pollTitle = locate('#poll');
  pollOption = locate(".poll input[type='text']");
  savePoll = locate('#post-poll');
  fileTitle = locate('.file');
  lastPublishedPost = locate('.short h2').first();
  videoItem = locate('.post');
  fileItem = locate('.attached');
  galleryItem = locate('.slider');
  imageInGalleryItem = locate('.slider .post');
  imageItem = locate('.post');
  pollItemTitle = locate('.post');
  pollValue = locate('.poll').first();
  pollVote = locate(".post input[type='submit']");
  bringBeauty = locate('.class');
  content = locate('.post p');
  editorBold = locate('.bold');
  editorItalic = locate('.italic');
  editorLink = locate('.link');
  editorHeader = locate('.header');
  editorBlockquote = locate('.blockquote');
  editorListBullet = locate('.list[value="bullet"]');
  editorListOrdered = locate('.list[value="ordered"]');
  editorCodeLine = locate('.code-block-line');
  editorCodeBlock = locate('.code-block');
  editorBoldTag = locate('p');
  editorItalicTag = locate('p');
  editorLinkTag = locate('p');
  editorHeaderTag = locate('h3');
  editorBlockquoteTag = locate('blockquote');
  editorListBulletTag = locate('ul li');
  editorListOrderedTag = locate('ol li');
  editorCodeLineTag = locate('.code');
  editorCodeBlockTag = locate('.code-block');
  editorLinkInput = locate('.editor input');
  editorLinkAddButton = locate('.add');

  getAudioPlayerByFileName = (fileName: string) => locate(`.class[data-title="${fileName}"]`);

  async checkCommentsAreAvailable() {
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(this.commentForm, 3);
    await I.seeElement(this.commentForm);
    await I.seeElement(this.commentsCount);
    await I.seeElement(this.commentList);
  }

  async createPostWithImage(image: string) {
    await I.attachFile(Post.imageAttachButton, image);
    await I.wait(10);
  }

  async createPostWithGallery(image: string) {
    await I.attachFile(Post.galleryAttachButton, image);
    await I.wait(10);
  }

  async createPostWithVideo(videoUrl: string) {
    await I.click(Post.videoTargetButton);
    await I.fillField(Post.videoUrlField, videoUrl);
    await I.click(Post.addVideo);
    await I.wait(10);
  }

  async createPostWithAudio(audio: string) {
    await I.click(Post.audioTargetButton);
    await I.attachFile(Post.fileAttachButton, audio);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForText('100%', 10, Post.loadPercentage);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(
      Post.getAudioPlayerByFileName('audio.wav'),
      10
    );
  }

  async createPostWithPoll(textOfPoll: string) {
    await I.click(Post.pollTargetButton);
    await I.fillField(Post.pollTitle, textOfPoll);
    await I.click(Post.pollOption);
    await I.fillField(Post.pollOption, textOfPoll);
    await I.click(Post.savePoll);
  }

  async createPostWithAttachment(file: string) {
    await I.click(Post.attachmentTargetButton);
    await I.attachFile(Post.fileAttachButton, file);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForText('100%', 10, Post.loadPercentage);
    await I.retry(PAGE_LOADING_RETRY_PARAMS).waitForElement(Post.fileTitle, 10);
  }

  bringBeautyToPost(rawText: string, resultText: string) {
    return async () => {
      await I.fillField(Post.editor, rawText);
      await I.click(Post.bringBeauty);
      await I.see(resultText, Post.editor);
    };
  }

  changeFontStyle(style: CodeceptJS.Locator, tag: CodeceptJS.Locator) {
    return async () => {
      await I.fillField(Post.editor, 'test');
      await I.pressKey(['Control', 'a']);
      await I.click(style);
      if (style === Post.editorLink) {
        await I.fillField(Post.editorLinkInput, 'test');
        await I.click(Post.editorLinkAddButton);
      }

      await I.waitForElement(`${Post.editor} ${tag}`);
    };
  }
}

export const Post = PostPage.getPage();
