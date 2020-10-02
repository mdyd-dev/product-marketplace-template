import { ClientFunction, Selector } from 'testcafe'
import NewSessionForm from './pages/newsession'
import faker from 'faker'
import TopMenuBtns from './pages/topmenu'

export const topMenu = new TopMenuBtns()
export const loginForm = new NewSessionForm()
export const loginConfirmation = 'Logged in'
export const getURL = ClientFunction(() => window.location.href)
export const myUrl = process.env.MPKIT_URL
export const loremSentence = (faker.lorem.lines() + " " + faker.lorem.lines())
export const editURL = '/dashboard/items/edit?id='
export const notAuthorizedUser = 'Permission denied'
export const groupName = faker.lorem.words();
export const translationMissing = (Selector('body').withText("translation missing"))


export const randomFirstName = faker.name.firstName()

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

export const SellerRandomUser = {
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
  name: randomFirstName.toLowerCase(),
  firstName: randomFirstName,
  lastName: 'Porter'
}

export const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.lorem.word(),
  price: '10000',
}

export const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.lorem.word(),
  price: '5000',
}
