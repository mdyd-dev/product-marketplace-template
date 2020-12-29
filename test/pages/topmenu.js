import { Selector } from 'testcafe';

export default class TopMenuBtns {
  constructor() {
    this.buttons = {
      logo: Selector('span').withText('MVP Marketplace'),
      listItem: Selector('a').withText('Add'),
      menuDropdown: Selector('header').find('button').withAttribute('data-menu-dropdown'),
      dashboard: Selector('a').withText('Dashboard'),
      logIn: Selector('header').find('a').withText('Log in'),
      logOut: Selector('header').find('button').withText('Log out'),
      adminPanel: Selector('header').find('a').withText('Admin'),
      items: Selector('header').find('a').withText('Items'),
      questions: Selector('a').withText('Questions'),
      groups: Selector('a').withText('Groups'),
      feed: Selector('a').withText('Feed'),
      chat: Selector('a').withText('Chat')
    }
  }
}
