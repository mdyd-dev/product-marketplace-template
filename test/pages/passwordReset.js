import { Selector } from 'testcafe';

export default class PasswordReset {
  constructor() {
    this.inputs = {
      email: Selector('input[name="authentication_link[email]"]'),
      newPassword: Selector('[name="password[password]"]'),
      newPasswordConfirmation: Selector('[name="password[password_confirmation]"]')
    }
    this.buttons = {
      submit: Selector('button').withText('Update Password'),
      resetPasswordSubmit: Selector('button').withText('Send email with')
    }
  }
}