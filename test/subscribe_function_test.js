import { Selector } from 'testcafe'
import { buyerRole, sellerRole, newEmail, newPassword } from './roles'
import faker from 'faker'
import NewSessionForm from './pages/newsession'
import NewItemForm from './pages/newitem'
import TopMenuBtns from './pages/topmenu'
import ItemSearch from './pages/itemsearch'

const myUrl = process.env.MPKIT_URL


const newUsername = faker.name.findName()
const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '1337',
}
const clearField = 'ctrl+a delete'


const newSessionForm = new NewSessionForm()
const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const itemSearch = new ItemSearch(item)

fixture`Register scenario`.page(myUrl + 'sessions/new')

test(`Register seller`, async (t) => {
  await t
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, newEmail)
    .typeText(newSessionForm.passInput, newPassword)
    .typeText(newSessionForm.usernameInput, newUsername)
    .click(newSessionForm.signUpBtn)
})

test(`Register buyer`, async (t) => {
  await t
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'johnsmith')
    .click(newSessionForm.signUpBtn)
})

fixture`Item listing then self follow attempt`.page(myUrl)

test('Creating item then self follow attempt', async (t) => {
  //listing the item for sale
  await t.click(topMenu.logoBtn)
  await t.useRole(sellerRole)
  await t
    .click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, item.name)
    .typeText(newItemForm.descField, item.description)
    .click(newItemForm.priceField)
    .pressKey(clearField)
    .typeText(newItemForm.priceField, item.price)
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), [
      '_uploads_/testimage.png',
    ])
    .click(newItemForm.submitBtn)
    // self follow attempt
    .expect(Selector('button').withAttribute('data-follow-user').exists).notOk()
})

test('Follow seller', async (t) => {
  await t
    .useRole(buyerRole)
    .click(topMenu.logoBtn)
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .expect(itemSearch.itemAhref.exists)
    .ok("'Item#name could not be found")
    .click(itemSearch.itemLink)
    .click(Selector('button').withAttribute('data-follow-user'))
    .expect(Selector('.following').exists).ok("button with class '.following' doesn't exists")
    .click(topMenu.dashboardBtn)
    .click(Selector('a').withText('Profile'))
    .expect(Selector('div').withText(newEmail).exists).ok("Followed list not shown")
    .click(topMenu.logOutBtn)
})


test('Following user as guest', async (t) => {
  await t
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .click(itemSearch.itemLink)
    .expect(Selector('button').withAttribute('data-follow-user').exists).notOk()
})