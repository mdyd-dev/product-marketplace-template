import { Selector } from 'testcafe';
import NewSessionForm from './pages/newsession';
import TopMenuBtns from "./pages/topmenu";

const newSessionForm = new NewSessionForm();
const topMenu = new TopMenuBtns();


fixture`Basic complete happy scenario`.page(process.env.MPKIT_URL);

test(`Logging attempt with empty data`, async (t) => {
    await t
      .click(topMenu.logInBtn)
      .click(newSessionForm.logInBtn)
      .expect(Selector('label').withText('E-mail').textContent)
      .contains('cannot be blank')
      .expect(Selector('label').withText('Password').textContent)
      .contains('cannot be blank');
  });

  test(`Registration attempt with taken data`, async (t) => {
    await t
      .click(topMenu.logInBtn)
      .click(newSessionForm.regBtn)
      .typeText(newSessionForm.emailInput, 'user@email.com')
      .typeText(newSessionForm.passInput, 'password')
      .typeText(newSessionForm.usernameInput, 'arnold01')
      .click(newSessionForm.signUpBtn)
      .expect(Selector('html').textContent)
      .contains('already taken');
  });

  test(`Logging attempt with wrong data`, async (t) => {
    await t
      .click(topMenu.logInBtn)
      .typeText(newSessionForm.emailInput, 'user@email.com')
      .typeText(newSessionForm.passInput, 'wrongpassword')
      .click(newSessionForm.logInBtn)
      .expect(Selector('html').textContent)
      .contains('Invalid email or password');
  });