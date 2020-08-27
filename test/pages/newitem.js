import { Selector } from 'testcafe';

export default class NewItemForm {
  constructor() {
    this.nameField = Selector('#name')
    this.descField = Selector('#description')
    this.priceField = Selector('#price')
    this.browseBtn = Selector('button').withText('browse your computer')
    this.submitBtn = Selector('button').withText('Submit')
  }
}