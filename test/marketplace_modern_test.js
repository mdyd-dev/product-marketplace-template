import { Selector } from 'testcafe';
import faker from 'faker';
import { ClientFunction } from 'testcafe';

fixture`Basic complete happy scenario`.page`https://getmarketplace.staging.gapps.platformos.com/`;

const getURL = ClientFunction(() => window.location.href);
const NewEmail = faker.internet.email();
const NewPassword = faker.internet.password();
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

test(`Login Test`, async (t) => {
  await t
    .click(Selector('header').find('a').withText('Log in'))
    .click(Selector('main').find('p').withText('Register'))
    .typeText('input[name="user[email]"]', NewEmail)
    .typeText('input[name="user[password]"]', NewPassword)
    .click(Selector('button').withText('Sign Up'));
});

test('Item listing', async (t) => {
  await t

    //listing the item for sale
    .click(Selector('a').withText('List your item'))
    .typeText('input[name="user[email]"]', NewEmail)
    .typeText('input[name="user[password]"]', NewPassword)
    .click(Selector('button').withText('Log in'))
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
    .typeText('input[name="user[email]"]', NewEmail)
    .typeText('input[name="user[password]"]', NewPassword)
    .click(Selector('main').find('button').withText('Log in'))
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

  await t;

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
    .typeText('input[name="user[email]"]', buyer.email)
    .typeText('input[name="user[password]"]', buyer.password)
    .click(Selector('main').find('button').withText('Log in'))
    .typeText('input[name="k"]', editedItem.name)
    .click(Selector('main').find('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //Buying item, logging off from buyer account
    .click(Selector('main').find('button'))
    .navigateTo(url)
    .doubleClick(Selector('main').find('[name="item[price]"]'))
    .pressKey(clearField)
    .typeText(Selector('main').find('[name="item[price]"]'), cheatedPrice.price)
    .click(Selector('button[value="update"]'))
    .click(Selector('main').find('button').withText('Buy for $10'))
    .click(Selector('main').find('button').withText('Checkout'))
    .click(Selector('header').find('a').withText('Dashboard'))
    .click(Selector('main').find('a').withText('Your orders').nth(1))
    .click(Selector('button').withText('Cancel'))
    .click(Selector('header').find('button').withText('Log out'));
});

test('Delete item test', async (t) => {
  await t

    //checks if bought item still exists at auctions
    .click(Selector('header').find('a').withText('Log in'))
    .typeText('input[name="user[email]"]', NewEmail)
    .typeText('input[name="user[password]"]', NewPassword)
    .click(Selector('main').find('button').withText('Log in'))
    .click(Selector('header').find('a').withText('Dashboard'))
    .click(Selector('main').find('a').withText('Your items'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //deleting exist item
    .setNativeDialogHandler(() => true)
    .click(Selector('main').find('button').withText('Delete'))
    .click(Selector('header').find('button').withText('Log out'));
});
