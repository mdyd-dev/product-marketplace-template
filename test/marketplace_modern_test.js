import { Selector } from 'testcafe';

fixture `Basic complete happy scenario`
  .page(process.env.MPKIT_URL);

test(`Login Test`, async t => {

  const user = { email: "user@email.com", password: "password" }
  const buyer = { email: "user2@email.com", password: "password" }
  const item = { name: "testItem", type: "typeTest", description: "testDesc", tags: "something,testTag,somethingelse", price: "1000" }
  const editedItem = { name: "testItemEdited", type: "typeTestEdited", description: "testDescEdited", tags: ",tagAddedAfterEdit", price: "1050" }
  const clearField = 'ctrl+a delete'

  await t
    .click(Selector('header').find('a').withText('Log in'))
    .typeText('input[name="user[email]"]', user.email)
    .typeText('input[name="user[password]"]', user.password)
    .click(Selector('main').find('button').withText('Log in'))


  await t
    //listing the item for sale
    .click(Selector('a').withText('List your item'))
    .typeText('input[name="item[properties][name]"]', item.name) // When labels are configured correctly (and they should, and are now, i think) test should select input by clicking on label - this way it tests label and does not depend on field name which is invisible for user
    .typeText('input[name="item[properties][type]"]', item.type)
    .typeText('textarea[name="item[properties][description]"]', item.description)
    .typeText('input[name="item[properties][tags]"]', item.tags)
    .doubleClick(Selector('main').find('[name="item[properties][price]"]'))
    .pressKey(clearField)
    .typeText(Selector('main').find('[name="item[properties][price]"]'), item.price)
    .click(Selector('main').find('[name="item[properties][cover_photo]"]'))
    .click(Selector('main').find('option').withText('bandage'))
    .click(Selector('main').find('button').withText('browse files'))
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), ['_uploads_/testimage.png'])
    .wait(1000)
    .click(Selector('button[value="create"]')) // button.withText..


  await t
    //searching item by its description
    .typeText('input[name="k"]', item.description)
    .click(Selector('main').find('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(item.name))
    .click(Selector('main').find('a').withText('Edit'))

  await t
    //change of item information
    .doubleClick(Selector('main').find('[name="item[properties][name]"]'))
    .pressKey(clearField)
    .typeText('input[name="item[properties][name]"]', editedItem.name)
    .doubleClick(Selector('main').find('[name="item[properties][type]"]'))
    .pressKey(clearField)
    .typeText('input[name="item[properties][type]"]', editedItem.type)
    .doubleClick(Selector('main').find('[name="item[properties][description]"]'))
    .pressKey(clearField)
    .typeText('textarea[name="item[properties][description]"]', editedItem.description)
    .typeText('input[name="item[properties][tags]"]', editedItem.tags)
    .doubleClick(Selector('main').find('[name="item[properties][price]"]'))
    .pressKey(clearField)
    .typeText(Selector('main').find('[name="item[properties][price]"]'), editedItem.price)
    .click(Selector('main').find('[name="item[properties][cover_photo]"]'))
    .click(Selector('main').find('option').withText('car'))
    .click(Selector('button[value="update"]'))
    .click(Selector('span').withText('MVP Marketplace'))
    .click(Selector('header').find('button').withText('Log out')) //Logging out from seller account

  await t
    //logging at buyer account and checks if seller item after edit exists
    .click(Selector('header').find('a').withText('Log in'))
    .typeText('input[name="user[email]"]', buyer.email)
    .typeText('input[name="user[password]"]', buyer.password)
    .click(Selector('main').find('button').withText('Log in'))
    .typeText('input[name="k"]', editedItem.description)
    .click(Selector('main').find('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //Buying item, logging off from buyer account
    .click(Selector('main').find('button#buybutton'))
    .click(Selector('main').find('button#checkoutbutton'))
    .click(Selector('span').withText('MVP Marketplace'))
    .click(Selector('header').find('button').withText('Log out'))


  await t
    //checks if bought item still exists at auctions
    .click(Selector('header').find('a').withText('Log in'))
    .typeText('input[name="user[email]"]', user.email)
    .typeText('input[name="user[password]"]', user.password)
    .click(Selector('main').find('button').withText('Log in'))
    .typeText('input[name="k"]', item.description)
    .click(Selector('main').find('button').withText('Search'))
    .click(Selector('main').find('h2 a').withText(editedItem.name))
    //deleting exist item
    .click(Selector('main').find('#deletebutton')) // why not button.withText('...') ?
    .click(Selector('header').find('button').withText('Log out'))


    ;
});
