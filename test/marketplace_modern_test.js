import { Selector, ClientFunction } from 'testcafe'
import { buyerRole, sellerRole, adminRole, newEmail, newPassword } from './roles'
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

const newUsername = faker.name.firstName().toLowerCase()
const myUrl = process.env.MPKIT_URL
const getURL = ClientFunction(() => window.location.href)
const editURL = '/items/edit?id='
const signupConfirmation = 'Your account has been created'
const notAuthorizedUser = 'Permission denied'
//pages
const adminPage = new AdminPanel()
const newSessionForm = new NewSessionForm()
const itemShow = new ItemShowPage(item)
const editPage = new ItemShowEdit(editedItem)
const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const itemSearch = new ItemSearch(item, editedItem)
const dashboard = new DashboardPage()
const profileEdit = new profileEditPage()


  fixture`Happy path scenario`.page(myUrl)

/*test.page(myUrl + '/sign-up')(`Register admin`, async (t) => {
    await t
    .maximizeWindow()
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.signUpBtn)
    .typeText(profileEdit.usernameField, 'imAdmin')
    .typeText(profileEdit.firstnameField, 'adminFirstName')
    .typeText(profileEdit.lastnameField, 'adminLastName')
    .click(profileEdit.saveButton)
})*/

test.page(myUrl + '/sign-up')(`Register seller`, async (t) => {
  await t
    .typeText(newSessionForm.emailInput, newEmail)
    .typeText(newSessionForm.passInput, newPassword)
    .click(newSessionForm.signUpBtn)
    .typeText(profileEdit.usernameField, newUsername)
    .typeText(profileEdit.firstnameField, 'Tony')
    .typeText(profileEdit.lastnameField, 'Montana')
    .click(profileEdit.saveButton)
 // await t.expect(Selector('main').withText(signupConfirmation).exists).ok() (FOR LATER)
})


test.page(myUrl + '/sign-up')(`Register buyer`, async (t) => {
  await t
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.signUpBtn)
    .typeText(profileEdit.usernameField, 'JohnSmith')
    .typeText(profileEdit.firstnameField, 'John')
    .typeText(profileEdit.lastnameField, 'Smith')
    .click(profileEdit.saveButton)
})


test.page(myUrl + '/sessions/new')(`Trying to register with taken data and log in with wrong data`, async (t) => {
  await t
    .click(newSessionForm.logInBtn)
    .expect(newSessionForm.emailLabel.textContent).contains('cannot be blank')
    .expect(newSessionForm.passwordLabel.textContent).contains('cannot be blank')
    .typeText(newSessionForm.emailInput, 'admin@email.com')
    .typeText(newSessionForm.passInput, 'wrongpassword')
    .click(newSessionForm.logInBtn)
    .expect(newSessionForm.emailLabel.textContent).contains('Invalid email or password')
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'wrongpassword')
    .click(newSessionForm.signUpBtn)
    .expect(newSessionForm.emailLabel.textContent).contains('already taken')
})


test('Creating item then self follow try', async (t) => {
    await t.useRole(sellerRole)
    await t.click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, item.name)
    .typeText(newItemForm.descField, item.description)
    .typeText(newItemForm.priceField, item.price, { replace: true })
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), [
      '_uploads_/testimage.png',
    ])
    .click(newItemForm.submitBtn)
    //checks if all data is correct
    await t.expect(itemShow.name.exists).ok()
    await t.expect(itemShow.description.exists).ok()
    await t.expect(itemShow.price.innerText).eql('$10,000', 'check element text')
    await t.expect('img[src="_uploads_/testimage.png"]').ok()
    .expect(Selector('button').withAttribute('data-follow-user').exists).notOk()
})


test('Editing item and search', async (t) => {
  await t
    //item search
    .useRole(sellerRole)
    .click(topMenu.dashboardBtn)
    .click(dashboard.goProfile)
    const sellerProfilePage = ClientFunction(() => document.location.href)
    await t.expect(sellerProfilePage()).contains(myUrl+'profile/' + newUsername) // checks if href contains slugified username
    .click(Selector('a').withText("User's items"))  // goes on your list from profile view
    await t.expect(Selector('p').withText('You are now on your list').exists).ok()
    .click(itemSearch.sortButton)
    .click(Selector('option').withText('The Most Recent'))
    .click(itemSearch.searchBtn)
    .click(itemSearch.itemLink)
    .click(Selector('a').withText("Browse this user's items")) // goes on your list from item show
    .click(itemSearch.itemLink)
    await t.debug()

  //change of item information
  await t.click(itemShow.editbutton)
    .typeText(newItemForm.nameField, editedItem.name, { replace: true })
    .typeText(newItemForm.descField, editedItem.description, { replace: true })
    .typeText(newItemForm.priceField, editedItem.price, { replace: true })
    .click(newItemForm.submitBtn)
    await t.expect(editPage.name.exists).ok()
    await t.expect(editPage.description.exists).ok()
    await t.expect(editPage.price.innerText).eql('$5,000', 'check element text')
})


test('Deleting item', async (t) => {
  await t
    .useRole(sellerRole)
    .click(topMenu.dashboardBtn)
    .click(dashboard.goYourItems)
    .setNativeDialogHandler(() => true)
    .click(editPage.deleteBtn)
})


test('Creating new item for sell', async (t) => {
    await t.useRole(sellerRole)
    await t.click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, item.name)
    .typeText(newItemForm.descField, item.description)
    .typeText(newItemForm.priceField, item.price, { replace: true })
    .click(newItemForm.submitBtn)
})


test('Buying an item and following the seller', async (t) => {
    await t
    .useRole(buyerRole)
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .expect(itemSearch.itemLink.exists).ok()
    .click(itemSearch.itemLink)
    .click(itemShow.followButton)
    .expect(itemShow.alreadyFollowedButton.exists).ok()
    .click(itemShow.buyBtn)
    //nie dziala checkout itemu
    .click(Selector('button').withText('Checkout'))
    .click(Selector('button').withText('Pay'))
    await t.debug()
    await t.click(topMenu.dashboardBtn)
    .click(dashboard.goProfile)
    .click(Selector('a').withText('Following'))
    .expect(Selector('h2').find('a').withText(newUsername).exists).ok("Followed list not shown")
    .click(topMenu.dashboardBtn)
    .click(dashboard.yourBuyingOrders)
    .click(Selector('a').withText(item.name))
  await t.expect(Selector('div').withText('Ordered').exists).ok()
    .useRole(sellerRole) // seller checks if his order shown as paid
    .click(topMenu.dashboardBtn)
    .click(dashboard.yourSellingOrders)
    // expect here
})


test(`Admin Panel test`, async (t) => {
  await t
    .useRole(adminRole)
    .click(topMenu.adminBtn)
    .click(adminPage.users)
  const usersTableRow = Selector('tbody').find('tr')
  await t.expect(usersTableRow.count).gte(3)
    .click(adminPage.orders)
  const ordersTableRow = Selector('tbody').find('tr')
  await t.expect(ordersTableRow.count).gte(1)
    .click(adminPage.items)
  const itemsTableRow = Selector('tbody').find('tr')
  await t.expect(itemsTableRow.count).gt(5)
    .click(adminPage.categories)
  const categoriesTableRow = Selector('tbody').find('tr')
  await t.expect(categoriesTableRow.count).gt(5)
    .click(adminPage.activities)
    .click(adminPage.setup)
  })


test('Breakin-in test, edition by none user', async (t) => {
    await t.useRole(buyerRole)
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

test('Profile Edit Test', async (t) => {
  await t.useRole(sellerRole)
  await t.debug()
  .click(topMenu.dashboardBtn)
  .click(dashboard.editProfile)
  .typeText(profileEdit.firstnameField, 'John Lee', { replace: true })
  .typeText(profileEdit.lastnameField, 'Hooker', { replace: true })
  .click(profileEdit.saveButton)
  .click(topMenu.dashboardBtn)
  .click(dashboard.goProfile)
  .expect(Selector('main').find('#user-name').withText('John Lee Hooker').exists).ok()
  .expect(Selector('main').find('#username').withText(newUsername).exists).ok()
})

