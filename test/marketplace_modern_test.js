import { Selector } from 'testcafe';
import faker from 'faker';
import { ClientFunction } from 'testcafe';

fixture`Basic complete happy scenario`.page`https://getmarketplace.staging.gapps.platformos.com/`;

const getURL = ClientFunction(() => window.location.href);
const itemEditingUrl = 'https://getmarketplace.staging.gapps.platformos.com/items/edit?id=151';
const itemBeforeCheckout = 'https://getmarketplace.staging.gapps.platformos.com/items/3275';
const itemCheckoutUrl = 'https://getmarketplace.staging.gapps.platformos.com/orders/new?item_id=3275';
const emailInput = 'label #email';
const passInput = 'label #password';
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
    .typeText('input[name="user[email]"]', NewEmail)
    .typeText('input[name="user[password]"]', NewPassword)
    .click(logInBtn)
    .click(Selector('a').withText('List your item'))
    .typeText(Selector('input[name="item[name]"]'), item.name)
    .typeText('input[name="item[type]"]', item.type)
    .typeText('textarea[name="item[description]"]', item.description)
    .typeText('input[name="item[tags]"]', item.tags)
    .doubleClick(Selector('main').find('[name="item[price]"]'))
    .pressKey(clearField)
    .typeText(Selector('main').find('[name="item[price]"]'), item.price)
    .click(Selector('main').find('[name="item[cover_photo]"]'))
    .click(Selector('main').find('option').withText('Disc'));

  await t

    //upload file
    .click(Selector('main').find('button').withText('browse files'))
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png'])
    .wait(1000)
    .click(Selector('button[value="create"]'))
    .click(mainPage);
});

test('Edit item', async (t) => {
  await t

    //searching item by its tag
    .click(Selector('header').find('a').withText('Log in'))
    .typeText(emailInput, NewEmail)
    .typeText(passInput, NewPassword)
    .click(logInBtn)
    .typeText('input[name="k"]', item.name)
    .click(Selector('main').find('button').withText('Search'))
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

  const url = await getURL();

  await t
    .doubleClick(Selector('main').find('[name="item[name]"]'))
    .pressKey(clearField)
    .typeText('input[name="item[name]"]', editedItem.name)
    .doubleClick(Selector('main').find('[name="item[type]"]'))
    .pressKey(clearField)
    .typeText('input[name="item[type]"]', editedItem.type)
    .doubleClick(Selector('main').find('[name="item[description]"]'))
    .pressKey(clearField)
    .typeText('textarea[name="item[description]"]', editedItem.description)
    .doubleClick(Selector('main').find('[name="item[tags]"]'))
    .pressKey(clearField)
    .typeText('input[name="item[tags]"]', editedItem.description)
    .doubleClick(Selector('main').find('[name="item[price]"]'))
    .pressKey(clearField)
    .typeText(Selector('main').find('[name="item[price]"]'), editedItem.price)
    .click(Selector('main').find('[name="item[cover_photo]"]'))
    .click(Selector('main').find('option').withText('Copy'))
    .click(Selector('button[value="update"]'))
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
    .click(Selector('main').find('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //Buying item, logging off from buyer account
    .click(Selector('main').find('button'))
    .navigateTo(url);
  await t.expect(getURL()).contains(url);
  await t
    .doubleClick(Selector('main').find('[name="item[price]"]'))
    .pressKey(clearField)
    .typeText(Selector('main').find('[name="item[price]"]'), cheatedPrice.price)
    .click(Selector('button[value="update"]'))
    .click(Selector('main').find('button').withText('Buy for $10'))
    //.click(Selector('main').find('button').withText('Checkout'))
    .click(Selector('header').find('a').withText('Dashboard'))
    .click(Selector('main').find('a').withText('Your orders').nth(1))
    //.click(Selector('button').withText('Cancel'))
    .click(Selector('header').find('button').withText('Log out'));
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
    .click(Selector('main').find('button').withText('Delete'))
    .click(Selector('header').find('button').withText('Log out'));
});

test(`Checks if cheat item price attempt shows denied message`, async (t) => {
  const signInNotification = 'Please sign in with you credentials or register new account before continuing.';
  const notAuthorizedUser = 'Permission denied';

  await t.navigateTo(itemEditingUrl);
  await t
    .expect(Selector('div').withText(signInNotification).exists)
    .ok()
    .typeText(Selector(emailInput), 'user@email.com')
    .typeText(Selector(passInput), 'password')
    .click(logInBtn);
  await t.expect(Selector('div').withText(notAuthorizedUser).exists).ok();
});

test(`Checkout button clicking not by buyer`, async (t) => {
  await t.navigateTo(itemBeforeCheckout).expect(Selector('button').withText('Sold').exists).ok();
  await t
    .navigateTo(itemCheckoutUrl)
    .typeText(emailInput, NewEmail)
    .typeText(passInput, NewPassword)
    .click(logInBtn)
    .click(Selector('button').withText('Checkout'))
    .click(Selector('button').withText('Pay'))
    .click(Selector('main').find('a').withText('Your orders').nth(1));
});
