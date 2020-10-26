import { Selector } from 'testcafe';

export default class ProfileView {
  constructor() {
    this.menu = {
      //activity:
      //groups:
      following: Selector('a').withText('Following'),
      followers: Selector('a').withText('Followers'),
      products: Selector('a').withText('Products'),
    }
    this.links = {
      userCard: Selector('div').find('a')
    }
    this.fields = {
      username: Selector('div[data-tc="user-name"]')
    }
  }
}