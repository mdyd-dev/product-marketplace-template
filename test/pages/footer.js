import { Selector } from 'testcafe';

export default class Footer {
  constructor() {
    this.support = {
      contactUs: Selector('li').find('a').withText('Contact Us'),
    }
  }
}
