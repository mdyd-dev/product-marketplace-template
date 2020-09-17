import { Selector } from 'testcafe';

export default class DashboardPage {
  constructor() {
      this.goProfile = Selector('a').withText('Your Profile')
      this.goYourItems = Selector('main').find('a').withText('Your items')
      this.yourBuyingOrders = Selector('a').withText('Your orders').nth(1)
      this.yourSellingOrders = Selector('a').withText('Your orders').nth(0)
  }
}