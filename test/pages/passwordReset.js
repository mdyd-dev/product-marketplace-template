import { Selector } from 'testcafe';

export default class PasswordReset {
  constructor() {
    this.inputs = {
      newPassword: Selector('[name="password[password]"]'),
      newPasswordConfirmation: Selector('[name="password[password_confirmation]"]')
    }
    this.buttons = {
      submit: Selector('button').withText('Update Password')
    }
  }
}