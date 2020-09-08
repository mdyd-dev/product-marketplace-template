import { Selector, Role } from 'testcafe';
import NewSessionForm from './pages/newsession'
import faker from 'faker'
import TopMenuBtns from './pages/topmenu'

const topMenu = new TopMenuBtns()
const newSessionForm = new NewSessionForm()
const loginConfirmation = 'Logged in'
export const newEmail = faker.internet.email().toLowerCase()
export const newPassword = faker.internet.password()

const myUrl = 'https://damcikinstance.staging.oregon.platform-os.com/'

export const buyerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export const sellerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(newSessionForm.emailInput, newEmail)
    .typeText(newSessionForm.passInput, newPassword)
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export const adminRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

