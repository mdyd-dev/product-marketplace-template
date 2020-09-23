import { ClientFunction } from 'testcafe'
import faker from 'faker'
import NewSessionForm from './pages/newsession'
import NewItemForm from './pages/newitem'
import ItemShowPage from './pages/itemshow'
import ItemShowEdit from './pages/itemedit'
import ItemSearch from './pages/itemsearch'
import AdminPanel from './pages/adminp'
import TopMenuBtns from './pages/topmenu'
import DashboardPage from './pages/dashboard'
import profileEditPage from './pages/profileEdit'

export const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.lorem.sentence(),
  price: '10000',
}

export const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.lorem.sentence(),
  price: '5000',
}

export const newUsername = faker.name.firstName().toLowerCase()
export const loremSentence = (faker.lorem.lines() + " " + faker.lorem.lines() + " " + faker.lorem.lines())
export const myUrl = process.env.MPKIT_URL
export const getURL = ClientFunction(() => window.location.href)
export const editURL = '/items/edit?id='
export const notAuthorizedUser = 'Permission denied'
//pages
export const adminPage = new AdminPanel()
export const registerForm = new NewSessionForm()
export const loginForm = new NewSessionForm()
export const itemShow = new ItemShowPage(item)
export const editPage = new ItemShowEdit(editedItem)
export const newItemForm = new NewItemForm()
export const topMenu = new TopMenuBtns()
export const itemSearch = new ItemSearch(item, editedItem)
export const dashboard = new DashboardPage()
export const profileEdit = new profileEditPage()
export const profileFilling = new profileEditPage()