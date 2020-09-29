import { Selector } from 'testcafe';

export default class ProfileEditForm {
  constructor() {
    this.name = Selector('#name')
    this.firstName = Selector('#first-name')
    this.lastName = Selector('#last-name')
    this.saveButton = Selector('button').withText('Save')
  }
}
