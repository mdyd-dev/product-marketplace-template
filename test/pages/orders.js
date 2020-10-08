import { Selector } from 'testcafe';

export default class OrdersPage {
  constructor() {
    this.buttons = {
      checkout: Selector('button').withText('Checkout'),
      pay: Selector('button').withText('Pay')
    }
  }
}