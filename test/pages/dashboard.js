import { Selector } from 'testcafe';

export default class DashboardPage {
  constructor() {
    this.nav = {
      publicProfile: Selector('a').withText('Public Profile'),
      editProfile: Selector('a').withText('Edit Profile'),
      sold: Selector('a').withText('Sold'),
      itemsForSell: Selector('main').find('a').withText('Items for sell'),
      listAnItem: Selector('a').withText('List an Item'),
      purchases: Selector('a').withText('Purchases'),
      itemsToBuy: Selector('a').withText('Items to buy'),
      bankAccount: Selector('a').withText('Bank Account'),
      activityFeed: Selector('main').find('a').withText('Activity Feed'),
      myGroups: Selector('a').withText('My Groups'),
      questions: Selector('main').find('a').withText('Questions'),
      inbox: Selector('a').withText('Inbox')
    }
  }
}
