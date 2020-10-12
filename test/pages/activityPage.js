import { Selector } from 'testcafe';

export default class ActivityFeed {
  constructor() {
    this.menu = {
      activity: Selector('a').withText('Activity'),
      groups: Selector('a').withText('Groups'),
      following: Selector('a').withText('Following'),
      followers: Selector('a').withText('Followers'),
      products: Selector('a').withText('Products'),
    }
    this.inputs = {
      message: Selector('textarea'),
    }
    this.buttons = {
      send: Selector('button').withText('Send'),
    }
  }
}