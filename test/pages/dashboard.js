import { Selector } from 'testcafe';

export default class DashboardPage {
  constructor() {
    this.activityFeed = Selector('main').find('a').withText('Activity Feed')
    this.editProfile = Selector('a').withText('Edit Profile')
    this.goProfile = Selector('a').withText('Public Profile')
    this.goYourItems = Selector('main').find('a').withText('Items for sell')
    this.yourBuyingOrders = Selector('a').withText('Purchases').nth(1)
    this.yourSellingOrders = Selector('a').withText('Sold').nth(0)
    this.yourGroups = Selector('a').withText('My Groups')
  }
}
