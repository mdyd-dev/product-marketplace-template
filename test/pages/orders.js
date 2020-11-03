import { Selector } from 'testcafe';

export default class OrdersPage {
  constructor() {
    this.buttons = {
      checkout: Selector('a').withText('CHECKOUT'),
      pay: Selector('button').withText('Pay Manually')
    }
    this.tableRows = {
      orders: Selector('tbody').find('tr'),
      firstLink: Selector('tbody').find('tr').nth(0).find('a'),
      firstRow: Selector('tbody').find('tr').nth(0)
    }
  }
}
