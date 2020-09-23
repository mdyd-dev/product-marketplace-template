import { Selector, Role } from 'testcafe';
import NewSessionForm from './pages/newsession'
import faker from 'faker'
import TopMenuBtns from './pages/topmenu'

const topMenu = new TopMenuBtns()
const loginForm = new NewSessionForm()
const loginConfirmation = 'Logged in'
export const newEmail = faker.internet.email().toLowerCase()
export const newPassword = faker.internet.password()

const myUrl = process.env.MPKIT_URL

export const buyerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, 'johnsmith@example.com')
    .typeText(loginForm.passInput, 'password')
    .click(loginForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export const sellerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, newEmail)
    .typeText(loginForm.passInput, newPassword)
    .click(loginForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export const adminRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, 'admin@example.com')
    .typeText(loginForm.passInput, 'password')
    .click(loginForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

