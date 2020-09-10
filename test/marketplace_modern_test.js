import { Selector, ClientFunction } from 'testcafe'
import { buyerRole, sellerRole, adminRole } from './roles'
import faker from 'faker'
import ItemShowPage from './pages/itemshow'
import ItemShowEdit from './pages/itemedit'
import AdminPanel from './pages/adminp'
import NewSessionForm from './pages/newsession'
import NewItemForm from './pages/newitem'
import TopMenuBtns from './pages/topmenu'
import ItemSearch from './pages/itemsearch'
import { newEmail, newPassword, newUsername } from './roles'

const myUrl = process.env.MPKIT_URL



const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '10000',
}

const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '5000',
}

const adminPage = new AdminPanel()
const newSessionForm = new NewSessionForm()
const itemShow = new ItemShowPage(item)
const editPage = new ItemShowEdit(editedItem)
const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const itemSearch = new ItemSearch(item)
const clearField = 'ctrl+a delete'
const signupConfirmation = 'Your account has been created'
const notAuthorizedUser = 'Permission denied'
const getURL = ClientFunction(() => window.location.href)
const editURL = '/items/edit?id='

fixture`Register scenario`.page(myUrl + 'sessions/new')

test(`Register admin`, async (t) => {
  await t
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'admin')
    .click(newSessionForm.signUpBtn)
})

test(`Register seller`, async (t) => {
  await t
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, newEmail)
    .typeText(newSessionForm.passInput, newPassword)
    .typeText(newSessionForm.usernameInput, newUsername)
    .click(newSessionForm.signUpBtn)
  await t.expect(Selector('main').withText(signupConfirmation).exists).ok('message ' + signupConfirmation + " doesn't exists")
})

test(`Register buyer`, async (t) => {
  await t
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'johnsmith')
    .click(newSessionForm.signUpBtn)
})

fixture`Wrong data scenario`.page(myUrl+ 'sessions/new')

test(`Logging attempt with empty data`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('label').withText('E-mail').textContent).contains('cannot be blank')
  await t.expect(Selector('label').withText('Password').textContent).contains('cannot be blank')
})

test(`Registration attempt with taken data`, async (t) => {
  await t
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'arnold01')
    .click(newSessionForm.signUpBtn)
  await t.expect(Selector('html').textContent).contains('already taken')
})

test(`Logging attempt with wrong data`, async (t) => {
  await t
    .typeText(newSessionForm.emailInput, 'admin@email.com')
    .typeText(newSessionForm.passInput, 'wrongpassword')
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('html').textContent).contains('Invalid email or password')
})

fixture`Trade scenario`.page(myUrl)

test('New Item', async (t) => {
  //listing the item for sale
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
})

test('Editing item and search', async (t) => {
  await t
    //searching item by its name
    .useRole(sellerRole)
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .expect(itemSearch.itemAhref.exists)
    .ok("'Item#name could not be found")
    .click(itemSearch.itemLink)
    //checks if all data is correct
  await t.expect(itemShow.name.exists).ok()
  await t.expect(itemShow.description.exists).ok()
  await t.expect(itemShow.price.innerText).eql('$10,000', 'check element text')
  await t.expect('img[src="_uploads_/testimage.png"]').ok()
    .click(topMenu.dashboardBtn)
    .click(Selector('a').withText('Profile'))
    .click(Selector('a').withText('Your list'))
  await t.expect(Selector('p').withText('You are now on your list').exists).ok()
    .click(Selector('#sort'))
    .click(Selector('option').withText('The Most Recent'))
    .click(itemSearch.searchBtn)
  await t.expect(itemSearch.itemAhref.exists).ok("'Item#name could not be found")
    .click(itemSearch.itemLink)
    .click(Selector('a').withText("Browse this user's items"))
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .click(itemSearch.itemLink)

  //change of item information
  await t
    .click(itemShow.editbutton)
    .doubleClick(newItemForm.nameField)
    .pressKey(clearField)
    .typeText(newItemForm.nameField, editedItem.name)
    .doubleClick(newItemForm.descField)
    .pressKey(clearField)
    .typeText(newItemForm.descField, editedItem.description)
    .doubleClick(newItemForm.priceField)
    .pressKey(clearField)
    .typeText(newItemForm.priceField, editedItem.price)
    .click(newItemForm.submitBtn)

  await t.expect(editPage.name.exists).ok()
  await t.expect(editPage.description.exists).ok()
  await t.expect(editPage.price.innerText).eql('$5,000', 'check element text')
    .click(topMenu.logOutBtn)
    //logging at buyer account and checks if seller item after edit exists then buying item
    .useRole(buyerRole)
    .typeText(itemSearch.searchField, editedItem.name)
    .click(itemSearch.searchBtn)
    .click(Selector('a').withText(editedItem.name))
    .click(itemShow.buyBtn)
})

test('Deleting item', async (t) => {
  await t
    .useRole(sellerRole)
    .click(topMenu.dashboardBtn)
    .click(Selector('main').find('a').withText('Your items'))
    .setNativeDialogHandler(() => true)
    .click(editPage.deleteBtn)
    .click(topMenu.logOutBtn)
})

test('Creating new item for sell', async (t) => {
  await t.useRole(sellerRole)
    await t.click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, item.name)
    .typeText(newItemForm.descField, item.description)
    .doubleClick(newItemForm.priceField)
    .pressKey(clearField)
    .typeText(newItemForm.priceField, item.price)
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), [
      '_uploads_/testimage.png',
    ])
    .click(newItemForm.submitBtn)
  await t.expect('img[src="_uploads_/testimage.png"]').ok()
    .click(topMenu.logOutBtn)
})

test('Orders check and item checkout as buyer', async (t) => {
    await t
    .useRole(buyerRole)
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .click(itemSearch.itemLink)
    .click(itemShow.buyBtn)
    .click(Selector('button').withText('Checkout'))
    .click(Selector('button').withText('Pay'))
    .click(topMenu.dashboardBtn)
    .click(Selector('a').withText('Your orders').nth(1))
    .click(Selector('a').withText(item.name))
  await t.expect(Selector('div').withText('Ordered').exists).ok("message 'Ordered x times' doesn't exists")
    .click(topMenu.logOutBtn)
})


test('Payout check', async (t) => {
  await t
    .useRole(sellerRole)
    .click(topMenu.dashboardBtn)
    .click(Selector('a').withText('Your orders').nth(0))
  await t.expect(Selector('tbody').find('td').withText('paid').exists).ok("message 'paid' doesn't exists")
})

fixture`Other`.page(myUrl)

test(`Admin Panel test`, async (t) => {
  await t.useRole(adminRole)
    .click(topMenu.adminBtn)
  await t.click(adminPage.users)
  const userTable = Selector('tbody').find('td')
  await t.expect(userTable.count).gt(5)
    .click(adminPage.items)
  const itemTable = Selector('div').find('.flex')
  await t.expect(itemTable.count).gt(5)
    .click(adminPage.orders)
  const orderTable = Selector('tbody').find('tr')
  await t.expect(orderTable.count).gt(0)
    .click(adminPage.categories)
  const categoriesTable = Selector('tbody').find('tr')
  await t.expect(categoriesTable.count).gt(15)
    .click(adminPage.home)
    .click(adminPage.activities)
    .click(adminPage.setup)
})

test('Breakin-in test, edition by none user', async (t) => {
  await t
    .useRole(buyerRole)
    .click(topMenu.logoBtn)
    .typeText(itemSearch.searchField, 'Watch')
    .click(itemSearch.searchBtn)
    .click(Selector('a').withText('Watch'))
  await t
  var itemEditUrl = await getURL()
  var itemEditUrl = itemEditUrl.split('-')
  var editItemId = itemEditUrl[itemEditUrl.length - 1]
  await t.navigateTo(editURL + editItemId)
  await t.expect(Selector('div').withText(notAuthorizedUser).exists).ok('message ' + notAuthorizedUser + " doesn't exists")
})