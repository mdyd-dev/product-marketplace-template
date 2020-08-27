import { Selector } from 'testcafe';

export default class SignUpForm {
  constructor() {
    this.emailInput = Selector('label #email')
    this.passInput = Selector('label #password')
    this.usernameInput = Selector('label #username')
    this.logInBtn = Selector('button').withText('Sign Up')
  }
}