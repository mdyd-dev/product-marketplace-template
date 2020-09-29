import { Selector, Role } from 'testcafe';
import NewSessionForm from './pages/newsession'
import TopMenuBtns from './pages/topmenu'
import { John, Admin, SellerRandomUser, myUrl, loginConfirmation } from './fixtures'

const topMenu = new TopMenuBtns()
const loginForm = new NewSessionForm()

export const buyerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, John.email)
    .typeText(loginForm.passInput, John.password)
    .click(loginForm.logInBtn)
})

export const sellerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, SellerRandomUser.email)
    .typeText(loginForm.passInput, SellerRandomUser.password)
    .click(loginForm.logInBtn)

  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export const adminRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, Admin.email)
    .typeText(loginForm.passInput, Admin.password)
    .click(loginForm.logInBtn)
})

