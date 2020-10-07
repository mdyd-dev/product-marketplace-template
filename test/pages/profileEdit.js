import { Selector } from 'testcafe';

export default class ProfileEditForm {
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
