import { Selector } from 'testcafe';

export default class NewSessionForm {
  constructor() {
    this.inputs = {
      email: Selector('input[name="user[email]"]'),
      password: Selector('input[name="user[password]"]'),
    }
    this.labels = {
      email: Selector('label').withText('E-mail'),
      password: Selector('label').withText('Password'),
      username: Selector('label[for="username"]')
    }
    this.buttons = {
      logIn: Selector('button').withText('Log In'),
      regSubmit: Selector('button').withText('Sign Up'),
      register: Selector('a').withText('Register'),
      resetPassword: Selector('a').withText('Reset')
    }






    /*
    this.emailInput = Selector('label #email')
    this.passInput = Selector('label #password')
    this.usernameInput = Selector('label #username')
    this.emailLabel = Selector('label').withText('E-mail')
    this.passwordLabel = Selector('label').withText('Password')
    this.usernameLabel = Selector('label[for="username"]')
    this.logInBtn = Selector('button').withText('Log In')
    this.regBtn = Selector('a').withText('Register')
    this.submitBtn = Selector('button').withText('Sign Up')
    this.resetBtn = Selector('a').withText('Reset')
    this.resetPasswordSubmit = Selector('button').withText('Send email with')
    */
  }
}