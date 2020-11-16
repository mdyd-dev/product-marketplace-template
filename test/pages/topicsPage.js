import { Selector } from 'testcafe';

export default class TopicsPage {
  constructor() {
    this.buttons = {
      addQuestion: Selector('a').withText('Add Question'),
      postQuestion: Selector('button').withText('Add Question'),
      postAnswer: Selector('button').withText("Post answer")
    }
    this.inputs = {
      questionTitle: Selector('#title'),
      questionBody: Selector('label[for="body"]'),
      //questionBody: Selector('div').find('textarea'),
      answerBody: Selector('.EasyMDEContainer').find('div').nth(1),
      questionTags: Selector('#tags')
    }
    this.vote = {
      pointUpQuestion: Selector('form[action="/dashboard/posts/vote"]'),
      pointUpAnswer: Selector('form[action="/dashboard/posts/vote"]').nth(2),
    }
    this.fields = {
      questionBody: Selector('div').find('p'),
      answerBody: Selector('div').find('p'),
    }
    this.ratings = {
      question: Selector('main').find('div').find('span').withText('1').nth(0),
      firstAnswer: Selector('main').find('div').find('span').withText('1').nth(1)
    }
  }
}