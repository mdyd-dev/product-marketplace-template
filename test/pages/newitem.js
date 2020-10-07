import { Selector } from 'testcafe';

export default class NewItemForm {
  constructor() {
    this.inputs = {
      name: Selector('#name'),
      description: Selector('#description'),
      price: Selector('#price')
    }
    this.buttons = {
      browseImages: Selector('button').withText('browse your computer'),
      submit: Selector('button').withText('Submit')
    }
  }
}