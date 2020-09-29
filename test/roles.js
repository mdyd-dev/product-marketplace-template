import { Selector, Role } from 'testcafe';
import NewSessionForm from './pages/newsession'
import faker from 'faker'
import TopMenuBtns from './pages/topmenu'
import DashboardPage from './pages/dashboard'
import ProfileEditForm from './pages/profileEdit'

const topMenu = new TopMenuBtns()
const loginForm = new NewSessionForm()
const loginConfirmation = 'Logged in'
const profileEditForm = new ProfileEditForm()
const dashboard = new DashboardPage()

export const John = {
  email: 'johnsmith@example.com',
  password: 'password',
  name: 'johnsmith',
  firstName: 'John',
  lastName: 'Smith'
}

export const Admin = {
  email: 'admin@example.com',
  password: 'password'
}

const randomFirstName = faker.name.firstName()
export const SellerRandomUser = {
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
  name: randomFirstName.toLowerCase(),
  firstName: randomFirstName,
  lastName: 'Porter'
}

const myUrl = process.env.MPKIT_URL

export const buyerRole = Role(myUrl, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(loginForm.emailInput, John.email)
    .typeText(loginForm.passInput, John.password)
    .click(loginForm.logInBtn)
    .click(topMenu.dashboardBtn)
    .click(dashboard.editProfile)
    .typeText(profileEditForm.name, John.name, { replace: true })
    .typeText(profileEditForm.firstName, John.firstName, { replace: true })
    .typeText(profileEditForm.lastName, John.lastName, { replace: true })
    .click(profileEditForm.saveButton)
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

