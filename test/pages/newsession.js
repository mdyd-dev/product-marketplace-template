import { Selector } from 'testcafe';

export default class NewSessionForm {
  constructor() {
    this.emailInput = Selector('label #email')
    this.passInput = Selector('label #password')
    this.emailLabel = Selector('label').withText('E-mail')
    this.passwordLabel = Selector('label').withText('Password')
    this.usernameLabel = Selector('label[for="username"]')
    this.logInBtn = Selector('button').withText('Log In')
    this.usernameInput = Selector('label #username')
    this.regBtn = Selector('a').withText('Register')
    this.submitBtn = Selector('button').withText('Sign Up')
    this.resetBtn = Selector('a').withText('Reset')
    this.resetPasswordSubmit = Selector('button').withText('Send email with')
  }
}