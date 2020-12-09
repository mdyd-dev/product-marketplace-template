import { Selector } from 'testcafe';

export default class NewItemForm {
  constructor() {
    this.inputs = {
      name: Selector('input[name="item[name]"]'),
      description: Selector('textarea[name="item[description]"]'),
      price: Selector('input[name="item[price]"]')
    }
    this.buttons = {
      browseImages: Selector('button').withText('browse your computer'),
      submit: Selector('button').withText('Submit')
    }
  }
}