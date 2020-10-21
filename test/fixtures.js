import { ClientFunction, Selector } from 'testcafe'
import faker from 'faker'

import TopMenuBtns from './pages/topmenu'
import NewItemForm from './pages/newitem'
import DashboardPage from './pages/dashboard'
import ItemShowPage from './pages/itemshow'
import ItemSearch from './pages/itemsearch'
import OrdersPage from './pages/orders'
import GroupsPage from './pages/groupsPage'
import ProfileView from './pages/publicProfile'
import ProfileEditForm from './pages/profileEdit'
import ActivityFeed from './pages/activityPage'
import AdminPanel from './pages/adminp'
import Footer from './pages/footer'
import ContactUs from './pages/contactUsForm'
import PasswordReset from './pages/passwordReset'
import NewSessionForm from './pages/newsession'
import PaymentsAccountPage from './pages/paymentsAccountPage'


//variables
export const resetConfirmation = 'Please check your email.';
export const loginConfirmation = 'Logged in'
export const getURL = ClientFunction(() => window.location.href)
export const myUrl = process.env.MPKIT_URL
export const loremSentence = (faker.lorem.lines() + " " + faker.lorem.lines())
export const editURL = '/dashboard/items/edit?id='
export const notAuthorizedUser = 'Permission denied'
export const groupName = faker.lorem.words();
export const translationMissing = (Selector('body').withText("translation missing"))
export const newPassword = 'newpassword'
export const link = Selector('a')
export const commentText = "What's new bro?"
export const randomFirstName = faker.name.firstName()


//pages
export const paymentsAccountPage = new PaymentsAccountPage()
export const adminPage = new AdminPanel()
export const registerForm = new NewSessionForm()
export const loginForm = new NewSessionForm()
export const passwordResetForm = new PasswordReset()
export const newItemForm = new NewItemForm()
export const topMenu = new TopMenuBtns()
export const dashboard = new DashboardPage()
export const profileEditForm = new ProfileEditForm()
export const orders = new OrdersPage()
export const publicProfile = new ProfileView()
export const groupsPage = new GroupsPage()
export const footer = new Footer()
export const contactUsForm = new ContactUs()
export const activityFeed = new ActivityFeed()



export const John = {
  email: 'johnsmith@example.com',
  password: 'password',
  name: 'johnsmith',
  firstName: 'John',
  lastName: 'Smith',
  country: 'United States',
  mobilePhone: '0000000000',
  birthDay: '18',
  birthMonth: '12',
  birthYear: '1995',
  addressStreet: '2045 Evans Ave',
  addressCity: 'San Francisco',
  addressCode: '94124',
  state: 'California',
  ssn: '0000',
  site: 'www.company.com'
}

export const Admin = {
  email: 'admin@example.com',
  password: 'newpassword'
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
  commonName: "johnsmith watch"
}

export const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.lorem.word(),
  price: '5000',
}

export const itemShow = new ItemShowPage(item)
export const editedItemShow = new ItemShowPage(editedItem)
export const itemSearch = new ItemSearch(item, editedItem)



export const group = {
  name: groupName,
  commonName: "johnsmith group",
  audifans: "audi fans",
  summary: "fun-club",
  description: (loremSentence + " " + loremSentence + " " + loremSentence)
}
