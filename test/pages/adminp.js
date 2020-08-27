import { Selector } from 'testcafe';

export default class AdminPanel {
  constructor() {
    this.users = Selector('a').withText('Users')
    this.home = Selector('a').withText('Home')
    this.activities = Selector('a').withText('Activities')
    this.categories = Selector('a').withText('Categories')
    this.orders = Selector('a').withText('Orders')
    this.items = Selector('a').withText('Items')
    this.setup = Selector('a').withText('Setup')
  }
}