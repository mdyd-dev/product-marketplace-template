import { Selector } from 'testcafe';

export default class ItemShowEdit {
  constructor(editedItem) {
    this.fields = {
      name: Selector('h1').withText(editedItem.name),
      description: Selector('div p').withText(editedItem.description),
      price: Selector('div span').withText(
        (5000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
      ),
      editedPrice: Selector('div span').withText(
        (10000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
      )
    }

    this.buttons = {
      delete: Selector('button').withText('Delete')
    }

    /*
    this.name = Selector('h1').withText(editedItem.name)
    this.description = Selector('div p').withText(editedItem.description)
    this.price = Selector('div span').withText(
      (5000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    )
    this.deleteBtn = Selector('button').withText('Delete')
    */
  }
}