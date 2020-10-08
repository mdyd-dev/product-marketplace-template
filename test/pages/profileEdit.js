import { Selector } from 'testcafe';

export default class ProfileView {
  constructor() {
    this.inputs = {
      name: Selector('#name'),
      firstName: Selector('#first-name'),
      lastName: Selector('#last-name'),
      bio: Selector('#bio')
    }
    this.buttons = {
      save: Selector('button').withText('Save')
    }
  }
}
