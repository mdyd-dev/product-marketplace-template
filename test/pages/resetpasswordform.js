import { Selector } from 'testcafe';

export default class ResetPasswordForm {
  constructor() {
    this.submit = Selector('button').withText('Send email with authentication link')
  }
}