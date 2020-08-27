import { Selector } from 'testcafe';
import faker from 'faker';
import { ClientFunction } from 'testcafe';
import { Role } from 'testcafe';
import ItemShowPage from './pages/itemshow';
import ItemShowEdit from './pages/itemedit';
import AdminPanel from './pages/adminp';
import NewSessionForm from './pages/newsession';
import NewItemForm from './pages/newitem';
import TopMenuBtns from './pages/topmenu';
import ItemSearch from './pages/itemsearch';

fixture`Basic complete happy scenario`.page(process.env.MPKIT_URL);

const signupConfirmation = 'Your account has been created';
const loginConfirmation = 'Logged in';
const notAuthorizedUser = 'Permission denied';
const getURL = ClientFunction(() => window.location.href);
const editURL = '/items/edit?id=';
const NewEmail = faker.internet.email().toLowerCase();
const NewPassword = faker.internet.password();
const NewUsername = faker.name.findName();
const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '10000',
};

const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  price: '5000',
};

const adminPage = new AdminPanel();
const newSessionForm = new NewSessionForm();
const page = new ItemShowPage(item);
const editPage = new ItemShowEdit(editedItem);
const newItemForm = new NewItemForm();
const topMenu = new TopMenuBtns();
const itemSearch = new ItemSearch(item);
const clearField = 'ctrl+a delete';

const buyerRole = Role(process.env.MPKIT_URL + 'sessions/new', async (t) => {
  await t
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.logInBtn)
    .expect(Selector('main').withText(loginConfirmation).exists)
    .ok('message ' + loginConfirmation + " doesn't exists");
});

const sellerRole = Role(process.env.MPKIT_URL + 'sessions/new', async (t) => {
  await t
    .typeText(newSessionForm.emailInput, NewEmail)
    .typeText(newSessionForm.passInput, NewPassword)
    .click(newSessionForm.logInBtn)
    .expect(Selector('main').withText(loginConfirmation).exists)
    .ok('message ' + loginConfirmation + " doesn't exists");
});

const adminRole = Role(process.env.MPKIT_URL + 'sessions/new', async (t) => {
  await t
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.logInBtn)
    .expect(Selector('main').withText(loginConfirmation).exists)
    .ok('message ' + loginConfirmation + " doesn't exists");
});

test(`Register seller`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, NewEmail)
    .typeText(newSessionForm.passInput, NewPassword)
    .typeText(newSessionForm.usernameInput, NewUsername)
    .click(newSessionForm.signUpBtn)
    .expect(Selector('main').withText(signupConfirmation).exists)
    .ok('message ' + signupConfirmation + " doesn't exists")
});

test(`Register buyer`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'johnsmith')
    .click(newSessionForm.signUpBtn);
});

test(`Register admin`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'admin')
    .click(newSessionForm.signUpBtn)
});

test(`Logging attempt with empty data`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(newSessionForm.logInBtn)
    .expect(Selector('label').withText('E-mail').textContent)
    .contains('cannot be blank')
    .expect(Selector('label').withText('Password').textContent)
    .contains('cannot be blank');
});

test(`Registration attempt with taken data`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(newSessionForm.regBtn)
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .typeText(newSessionForm.usernameInput, 'arnold01')
    .click(newSessionForm.signUpBtn)
    .expect(Selector('html').textContent)
    .contains('already taken');
});

test(`Logging attempt with wrong data`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .typeText(newSessionForm.emailInput, 'admin@email.com')
    .typeText(newSessionForm.passInput, 'wrongpassword')
    .click(newSessionForm.logInBtn)
    .expect(Selector('html').textContent)
    .contains('Invalid email or password');
});

test('Item listing', async (t) => {
  //listing the item for sale
  await t.useRole(sellerRole);
  await t
    .click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, item.name)
    .typeText(newItemForm.descField, item.description)
    .doubleClick(newItemForm.priceField)
    .pressKey(clearField)
    .typeText(newItemForm.priceField, item.price)
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png'])
    .click(newItemForm.submitBtn);
  await t.expect('img[src="_uploads_/testimage.png"]').ok().click(topMenu.logoBtn);
});

test('Edit item', async (t) => {
  await t
    //searching item by its name
    .useRole(sellerRole)
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .expect(itemSearch.itemAhref.exists)
    .ok("'Item#name could not be found")
    .click(itemSearch.itemLink);
  await t
    .expect('img[src="_uploads_/testimage.png"]')
    .ok()
    //checks if all data is correct
    .expect(page.name.exists)
    .ok()
    .expect(page.description.exists)
    .ok()
    .expect(page.price.innerText)
    .eql('$10,000', 'check element text');

  //change of item information
  await t
    .click(page.editbutton)
    .doubleClick(newItemForm.nameField)
    .pressKey(clearField)
    .typeText(newItemForm.nameField, editedItem.name)
    .doubleClick(newItemForm.descField)
    .pressKey(clearField)
    .typeText(newItemForm.descField, editedItem.description)
    .doubleClick(newItemForm.priceField)
    .pressKey(clearField)
    .typeText(newItemForm.priceField, editedItem.price)
    .click(newItemForm.submitBtn);

  await t
    .expect(editPage.name.exists)
    .ok()
    .expect(editPage.description.exists)
    .ok()
    .expect(editPage.price.innerText)
    .eql('$5,000', 'check element text')
    .click(topMenu.logoBtn)
    //Logging out from seller account
    .click(topMenu.logOutBtn)
    //logging at buyer account and checks if seller item after edit exists
    .useRole(buyerRole)
    .typeText(itemSearch.searchField, editedItem.name)
    .click(itemSearch.searchBtn)
    .click(editPage.itemLink)
    //Checks if buy button works correctly
    .click(page.buyBtn)
    .click(topMenu.logOutBtn);
});

test('Delete item test', async (t) => {
  await t
    //checks if bought item still exists at auctions
    .useRole(sellerRole)
    .click(topMenu.dashboardBtn)
    .click(Selector('main').find('a').withText('Your items'))
    .click(editPage.itemLink)
    .setNativeDialogHandler(() => true)
    .click(editPage.deleteBtn)
    .click(topMenu.logOutBtn);
});

test('Sell test', async (t) => {
  await t.useRole(sellerRole);
  await t
    .click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, item.name)
    .typeText(newItemForm.descField, item.description)
    .doubleClick(newItemForm.priceField)
    .pressKey(clearField)
    .typeText(newItemForm.priceField, item.price)
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png'])
    .click(newItemForm.submitBtn);
  await t
    .expect('img[src="_uploads_/testimage.png"]')
    .ok()
    .click(topMenu.logOutBtn)
    .useRole(buyerRole)
    .typeText(itemSearch.searchField, item.name)
    .click(itemSearch.searchBtn)
    .click(itemSearch.itemLink)
    .click(page.buyBtn)
    .click(Selector('button').withText('Checkout'))
    .click(Selector('button').withText('Pay'))
    .click(topMenu.dashboardBtn)
    .click(Selector('a').withText('Your orders').nth(1))
    .click(Selector('a').withText(item.name))
    .expect(Selector('div').withText('Ordered').exists)
    .ok("message 'Ordered x times' doesn't exists")
    .click(topMenu.logOutBtn);
});

test('Payout check', async (t) => {
  await t
    .useRole(sellerRole)
    .click(topMenu.dashboardBtn)
    .click(Selector('a').withText('Your orders').nth(0))
    .expect(Selector('tbody').find('td').withText('paid').exists)
    .ok("message 'paid' doesn't exists");
});

test(`Admin Panel test`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .useRole(adminRole)
    .click(topMenu.adminBtn);
  await t.click(adminPage.users);
  const userTable = Selector('tbody').find('td');
  await t.expect(userTable.count).gt(5).click(adminPage.items);
  const itemTable = Selector('div').find('.flex');
  await t.expect(itemTable.count).gt(5).click(adminPage.orders);
  const orderTable = Selector('tbody').find('tr');
  await t.expect(orderTable.count).gt(0).click(adminPage.categories);
  const categoriesTable = Selector('tbody').find('tr');
  await t.expect(categoriesTable.count).gt(15).click(adminPage.home).click(adminPage.activities).click(adminPage.setup);
});

test('Breakin-in test, edition by none user', async (t) => {
  await t
    .useRole(buyerRole)
    .typeText(itemSearch.searchField, 'Watch')
    .click(itemSearch.searchBtn)
    .click(Selector('a').withText('Watch'));
  await t;
  var itemEditUrl = await getURL();
  var itemEditUrl = itemEditUrl.split('-');
  var editItemId = itemEditUrl[itemEditUrl.length - 1];
  await t.navigateTo(editURL + editItemId);
  await t
    .expect(Selector('div').withText(notAuthorizedUser).exists)
    .ok('message ' + notAuthorizedUser + " doesn't exists");
});
