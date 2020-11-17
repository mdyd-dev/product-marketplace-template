import { Selector } from 'testcafe';

export default class OrdersPage {
  constructor() {
    this.buttons = {
      checkout: Selector('a').withText('CHECKOUT'),
      pay: Selector('button').withText('Pay Manually')
    }
    this.tableRows = {
      firstLink: Selector('section').find('a'),
      firstRow: Selector('section').find('div'),
    }
  }
}
