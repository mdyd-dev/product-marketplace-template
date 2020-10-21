import { Selector, Role } from 'testcafe';
import NewSessionForm from './pages/newsession'
import TopMenuBtns from './pages/topmenu'
import { John, Admin, SellerRandomUser, myUrl, loginConfirmation } from './fixtures'

const topMenu = new TopMenuBtns()
const loginForm = new NewSessionForm()

export const buyerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.buttons.logIn)
    .typeText(loginForm.inputs.email, John.email)
    .typeText(loginForm.inputs.password, John.password)
    .click(loginForm.buttons.logIn)
})

export const sellerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.buttons.logIn)
    .typeText(loginForm.inputs.email, SellerRandomUser.email)
    .typeText(loginForm.inputs.password, SellerRandomUser.password)
    .click(loginForm.buttons.logIn)

  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export const adminRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.buttons.logIn)
    .typeText(loginForm.inputs.email, Admin.email)
    .typeText(loginForm.inputs.password, Admin.newPassword)
    .click(loginForm.buttons.logIn)
})

