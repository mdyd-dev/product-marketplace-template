import { Selector } from 'testcafe';

export default class ItemShowEdit {
  constructor(editedItem) {
    this.name = Selector('h1').withText(editedItem.name)
    this.itemLink = Selector('a').withText(editedItem.name)
    this.description = Selector('div p').withText(editedItem.description)
    this.price = Selector('div span').withText(
      (5000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    )
    this.deleteBtn = Selector('button').withText('Delete')
  }
}