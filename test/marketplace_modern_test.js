import { Selector } from 'testcafe';
import faker from 'faker';
import { ClientFunction } from 'testcafe';

fixture`Basic complete happy scenario`.page(process.env.MPKIT_URL);

const getURL = ClientFunction(() => window.location.href);
const emailInput = 'label #email';
const passInput = 'label #password';
const nameField = '#name';
const descriptionField = '#description';
const tagsField = '#tags';
const priceField = '#price';
const editURL = '/items/edit?id='
const NewEmail = faker.internet.email();
const NewPassword = faker.internet.password();
const logInBtn = Selector('button').withText('Log in');
const item = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  tags: faker.commerce.product(),
  price: '10000',
};

const cheatedPrice = {
  price: '10',
};

const buyer = { email: 'JohnSmith@email.com', password: 'password' };

const editedItem = {
  name: faker.commerce.productName(),
  type: faker.commerce.productMaterial(),
  description: faker.commerce.productAdjective(),
  tags: faker.commerce.product(),
  price: '10000',
};
const clearField = 'ctrl+a delete';
const mainPage = Selector('header').find('span').withText('MVP Marketplace');

test(`Logging attempt with empty data`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .click(logInBtn)
    .expect(Selector('label').withText('E-mail').textContent)
    .contains('"cannot be blank"')
    .expect(Selector('label').withText('Password').textContent)
    .contains('"cannot be blank"');
});

test(`Registration attempt with taken data`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .click(Selector('p').withText('Register'))
    .typeText(emailInput, 'user@email.com')
    .typeText(passInput, 'password')
    .click(Selector('main').find('button').withText('Sign Up'))
    .expect(Selector('html').textContent)
    .contains('"already taken"');
});

test(`Logging attempt with wrong data`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, 'user@email.com')
    .typeText(passInput, 'wrongpassword')
    .click(logInBtn)
    .expect(Selector('html').textContent)
    .contains('"Invalid email or password"');
});

test(`Login Test`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .click(Selector('main').find('p').withText('Register'))
    .typeText(emailInput, NewEmail)
    .typeText(passInput, NewPassword)
    .click(Selector('button').withText('Sign Up'));
});

test('Item listing', async (t) => {
  await t

    //listing the item for sale
    .click(Selector('a').withText('List your item'))
    .typeText(emailInput, NewEmail)
    .typeText(passInput, NewPassword)
    .click(logInBtn)
    .click(Selector('a').withText('List your item'))
    .typeText(Selector(nameField), item.name)
    .typeText(descriptionField, item.description)
    .typeText(tagsField, item.tags)
    .doubleClick(Selector(priceField))
    .pressKey(clearField)
    .typeText(priceField, item.price)
    .click(Selector('button').withText('browse files'))
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png'])
    .click(Selector('button').withText('Submit'))
    .click(mainPage);
});

test('Edit item', async (t) => {
  await t

    //searching item by its name
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, NewEmail)
    .typeText(passInput, NewPassword)
    .click(logInBtn)
    .typeText('input[name="k"]', item.name)
    .click(Selector('main').find('button').withText('Search'))
    .expect(Selector('main').withText(item.name).exists)
    .ok("'Item#name could not be found")
    .click(Selector('main').find('h2 a').withText(item.name))
    //checks if all data is correct
    .expect(Selector('h1').withText(item.name).exists)
    .ok()
    .expect(Selector('ul.tags li:nth-child(2)').innerText)
    .eql(item.tags.toLowerCase(), 'check element text')
    .expect(Selector('div p').withText(item.description).exists)
    .ok()
    .expect(
      Selector('div span').withText(
        (10000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
      ).innerText
    )
    .eql('$10,000', 'check element text');
  await t.click(Selector('main').find('a').withText('Edit'));
  //change of item information

  await t
    .doubleClick(nameField)
    .pressKey(clearField)
    .typeText(nameField, editedItem.name)
    .doubleClick(descriptionField)
    .pressKey(clearField)
    .typeText(descriptionField, editedItem.description)
    .doubleClick(tagsField)
    .pressKey(clearField)
    .typeText(tagsField, editedItem.tags)
    .doubleClick(priceField)
    .pressKey(clearField)
    .typeText(priceField, editedItem.price)
    .click(Selector('button').withText('Submit'))
    .expect(Selector('h1').withText(editedItem.name).exists)
    .ok()
    .click(Selector('span').withText('MVP Marketplace'))
    .click(Selector('header').find('button').withText('Log out')) //Logging out from seller account
    //logging at buyer account and checks if seller item after edit exists
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, buyer.email)
    .typeText(passInput, buyer.password)
    .click(logInBtn)
    .typeText('input[name="k"]', editedItem.name)
    .click(Selector('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //Buying item, logging off from buyer account
    .click(Selector('button').withText('Buy'))
  await t
    //.click(Selector('main').find('button').withText('Checkout'))
    .click(Selector('header').find('a').withText('Dashboard'))
    //.click(Selector('main').find('a').withText('Your orders').nth(1))
    //.click(Selector('button').withText('Cancel'))
    .click(Selector('button').withText('Log out'));
});

test('Delete item test', async (t) => {
  await t
    //checks if bought item still exists at auctions
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, NewEmail)
    .typeText(passInput, NewPassword)
    .click(logInBtn)
    .click(Selector('header').find('a').withText('Dashboard'))
    .click(Selector('main').find('a').withText('Your items'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //deleting exist item
    .setNativeDialogHandler(() => true)
    .click(Selector('button').withText('Delete'))
    .click(Selector('button').withText('Log out'));
});


test('Breakin-in test, edition by none user', async (t) => {
  const notAuthorizedUser = 'Permission denied';
  await t.click(Selector('header').find('a').withText('Log in'))
  .typeText(emailInput, 'user@email.com')
  .typeText(passInput, 'password')
  .click(logInBtn)
  .typeText('input[name="k"]', 'Watch')
  .click(Selector('main').find('button').withText('Search'))
  .click(Selector('main').find('h2 a').withText('Watch'))
  await t
  var itemEditUrl = await getURL()
  var itemEditUrl = itemEditUrl.split('-')
  var editItemId = itemEditUrl[itemEditUrl.length -1]
  await t
  .navigateTo(editURL + editItemId)
  await t.expect(Selector('div').withText(notAuthorizedUser).exists).ok("message 'Permission denied' doesn't exists")

});
