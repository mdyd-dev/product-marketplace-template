import { Selector } from 'testcafe';

export default class ItemShowPage {
  constructor(item) {
    this.name = Selector('h1').withText(item.name);
    this.description = Selector('div p').withText(item.description)
    this.price = Selector('div span').withText(
      (10000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
    )
    this.editbutton = Selector('main').find('a').withText('Edit')
    this.buyBtn = Selector('button').withText('Buy')
  }
}