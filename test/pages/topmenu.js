import { Selector } from 'testcafe';

export default class TopMenuBtns {
  constructor() {
    this.logoBtn = Selector('span').withText('MVP Marketplace')
    this.listItemBtn = Selector('a').withText('Add')
    this.menuDropdown = Selector('header').find('button').withAttribute('data-menu-dropdown')
    this.dashboardBtn = Selector('a').withText('Dashboard')
    this.logInBtn = Selector('header').find('a').withText('Log in')
    this.logOutBtn = Selector('header').find('button').withText('Log out')
    this.adminBtn = Selector('header').find('a').withText('Admin')
    this.itemsBtn = Selector('header').find('a').withText('Items')
  }
}
