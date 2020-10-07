import { Selector, ClientFunction, t } from 'testcafe'
import { buyerRole, sellerRole, adminRole } from './roles'
import { John, SellerRandomUser, myUrl, item, editedItem, getURL, editURL, loremSentence, notAuthorizedUser, groupName, resetConfirmation } from './fixtures'
import { register, createItem } from './helper'
import NewSessionForm from './pages/newsession'
import NewItemForm from './pages/newitem'
import ItemShowPage from './pages/itemshow'
import ItemShowEdit from './pages/itemedit'
import ItemSearch from './pages/itemsearch'
import AdminPanel from './pages/adminp'
import TopMenuBtns from './pages/topmenu'
import DashboardPage from './pages/dashboard'
import ProfileEditForm from './pages/profileEdit'

//pages
const adminPage = new AdminPanel()
const registerForm = new NewSessionForm()
const loginForm = new NewSessionForm()
const itemShow = new ItemShowPage(item)
const editedItemShow = new ItemShowPage(editedItem)
const editPage = new ItemShowEdit(editedItem)
const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const itemSearch = new ItemSearch(item, editedItem)
const dashboard = new DashboardPage()
const profileEditForm = new ProfileEditForm()

const translationMissing = Selector('body').withText('translation missing')
async function checkTranslation(translationMissing) {
  if (await translationMissing.exists)
    await t.expect(translationMissing.exists).notOk();
};


fixture`Happy path scenario`
          .page(myUrl)

test.page(myUrl + '/sign-up')('Register seller', async (t) => {
  await register(SellerRandomUser)
})

test.page(myUrl + '/sign-up')(`Register buyer John`, async (t) => {
  await register(John)
})

test('Edit John Profile Page', async (t) => {
  await t.useRole(buyerRole)
    await checkTranslation(translationMissing) // home page translation missing check
    await t.click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    await t.click(dashboard.nav.editProfile)
    await checkTranslation(translationMissing) // profile edit translation missing check
    await t.typeText(profileEditForm.inputs.name, John.name, { replace: true })
    .typeText(profileEditForm.inputs.firstName, John.firstName, { replace: true })
    .typeText(profileEditForm.inputs.lastName, John.lastName, { replace: true })
    .click(profileEditForm.buttons.save)
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.publicProfile)
    await checkTranslation(translationMissing) // public profile translation missing check
  await t
    .expect(Selector('main').find('#user-name').withText(`${John.firstName} ${John.lastName}`).exists).ok()
})
test(`Reset Password test`, async (t) => {
  await t
    .click(topMenu.buttons.logIn)
    .click(loginForm.buttons.resetPassword)
    var resetPasswordUrl = await getURL()
    var testCafeResetPasswordUrl = resetPasswordUrl+('?testcafe=1')
    await t.navigateTo(testCafeResetPasswordUrl)
    await t.typeText(loginForm.inputs.email, 'admin@example.com')
    await t.click(loginForm.buttons.resetPasswordSubmit)
    const text = await Selector('main').innerText
    await t.navigateTo(text)
    .typeText(Selector('[name="password[password]"]'), "newpassword")
    .typeText(Selector('[name="password[password_confirmation]"]'), "newpassword")
    .click(Selector('button').withText('Update Password'))
});

test.page(myUrl + '/sessions/new')(`Trying to register with taken data and log in with wrong data`, async (t) => {
  await t
    .click(loginForm.buttons.logIn)
    await checkTranslation(translationMissing) // log in form translation missing check
    await t.expect(loginForm.labels.email.textContent).contains('cannot be blank')
    .expect(loginForm.labels.password.textContent).contains('cannot be blank')
    .typeText(loginForm.inputs.email, 'admin@example.com')
    .typeText(loginForm.inputs.password, 'asd')
    .click(loginForm.buttons.logIn)
    .expect(loginForm.labels.email.textContent).contains('Invalid email or password')
    .click(loginForm.buttons.register)
    .typeText(registerForm.inputs.email, 'admin@example.com')
    .typeText(registerForm.inputs.password, 'asd')
    .click(registerForm.buttons.regSubmit)
    .expect(registerForm.labels.email.textContent).contains('already taken')
})

test('Creating item then trying to follow', async (t) => {
  await t.useRole(sellerRole)
  await createItem(item.name, item.description, item.price)
  //checks if all data is correct
  await t.expect(itemShow.fields.name.exists).ok()
  await t.expect(itemShow.fields.description.exists).ok()
  await t.expect(itemShow.fields.price.innerText).eql('$10,000', 'check element text')
  await t.expect('img[src="_uploads_/testimage.png"]').ok()
    .expect(Selector('button').withAttribute('data-follow-user').exists).notOk()
})


test('Editing item and search', async (t) => {
  await t
  //item search
    .useRole(sellerRole)
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.publicProfile)
  const sellerProfilePage = ClientFunction(() => document.location.href)
  await t.expect(sellerProfilePage()).contains(myUrl+'profile/' + SellerRandomUser.name) // checks if href contains slugified username
    .click(Selector('a').withText("Items"))  // goes on your list from profile view
    .click(itemSearch.buttons.sort)
    .click(Selector('option').withText('The Most Recent'))
    .click(itemSearch.buttons.search)
    .click(itemSearch.links.item)
    .click(Selector('a').withText("Browse this user's items")) // goes on your list from item show
    .click(itemSearch.links.item)

  //change of item information
  await t.click(itemShow.buttons.edit)
  await checkTranslation(translationMissing)
    await t.typeText(newItemForm.inputs.name, editedItem.name, { replace: true })
    .typeText(newItemForm.inputs.description, editedItem.description, { replace: true })
    .typeText(newItemForm.inputs.price, editedItem.price, { replace: true })
    .click(newItemForm.buttons.submit)
  await t.expect(editedItemShow.fields.name.exists).ok()
  await t.expect(editedItemShow.fields.description.exists).ok()
  await t.expect(editedItemShow.fields.editedPrice.innerText).eql('$5,000', 'check element text')
})


test('Deleting item', async (t) => {
  await t
    .useRole(sellerRole)
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.itemsForSell)
    .setNativeDialogHandler(() => true)
    .click(itemShow.buttons.delete)
})

test('Creating new item for sell', async (t) => {
  await t.useRole(sellerRole)
  await createItem(item.name, item.description, item.price)
})

test('Buying an item and following the seller', async (t) => {
  await t
    .useRole(buyerRole)
    .click(topMenu.buttons.items)
    .typeText(itemSearch.search.keyword, item.name)
    .click(itemSearch.buttons.search)
    .expect(itemSearch.links.item.exists).ok()
    .click(itemSearch.links.item)
    .click(itemShow.buttons.follow)
    .expect(itemShow.buttons.alreadyFollowedState.exists).ok()
    .click(itemShow.buttons.buy)
    .click(Selector('button').withText('Checkout'))
    .click(Selector('button').withText('Pay'))
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.purchases) // buyer's order check
    .click(Selector('a').withText(item.name))
    .expect(Selector('div').withText('Ordered').exists).ok()
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.publicProfile)
    .click(Selector('a').withText('Following'))
    .expect(Selector('div').find('a').withText(SellerRandomUser.name).exists).ok("Followed list not shown")

 await t
   .useRole(sellerRole) // seller checks if his order shown as paid
    .click(topMenu.buttons.menuDropdown)
   .click(topMenu.buttons.dashboard)
   .click(dashboard.nav.sold)  // seller's order check
   .expect(Selector('a').withText(item.name).exists).ok("Item list not shown in seller orders")
 })


 test(`Admin Panel test`, async (t) => {
   await t
     .useRole(adminRole)
     await t.click(topMenu.buttons.adminPanel)
     await checkTranslation(translationMissing) // Admin panel translation missing check

     await t.click(adminPage.menu.users)
     const usersTableRow = Selector('tbody').find('tr')
     await t.expect(usersTableRow.count).gte(1)

     await t.click(adminPage.menu.orders)
     const ordersTableRow = Selector('tbody').find('tr')
     await t.expect(ordersTableRow.count).gte(1)

     await t.click(adminPage.menu.items)
     const itemsTableRow = Selector('tbody').find('tr')
     await t.expect(itemsTableRow.count).gt(1)

     await t.click(adminPage.menu.categories)
     const categoriesTableRow = Selector('tbody').find('tr')
     await t.expect(categoriesTableRow.count).gt(1)

     await t.click(adminPage.menu.activities)
     await t.click(adminPage.menu.setup)
 })


test('Breakin-in test, edition by none user', async (t) => {
  await t.useRole(buyerRole)
    .click(topMenu.buttons.items)
    .typeText(itemSearch.search.keyword, 'Watch')
    .click(itemSearch.buttons.search)
    .click(Selector('a').withText('Watch'))
  var itemEditUrl = await getURL()
  var itemEditUrl = itemEditUrl.split('-')
  var editItemId = itemEditUrl[itemEditUrl.length - 1]
  await t.navigateTo(editURL + editItemId)
  await t.expect(Selector('div').withText(notAuthorizedUser).exists).ok('message ' + notAuthorizedUser + " doesn't exists")
})

test('Groups', async (t) => {
  await t.useRole(buyerRole)
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.myGroups)
    await checkTranslation(translationMissing) // my groups translation missing check

  await t
    .click(Selector('main').find('a').withText('Add group'))
    await checkTranslation(translationMissing)
    await t.typeText('#name', groupName)
    .typeText('#summary', "fun-club")
    .typeText('#description', loremSentence, { paste: true })
    .click(Selector('button').withText('Submit'))
  //unique test
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.myGroups)
    .click(Selector('a').withText('Add group'))
    .typeText('#name', groupName)
    .typeText('#summary', "fun-club")
    .typeText('#description', loremSentence, { paste: true })
    .click(Selector('button').withText('Submit'))
    .expect(Selector('div').textContent).contains('already taken')
  //checks if group exists
    .click(dashboard.nav.myGroups)
    .expect(Selector('a').withText('group').exists).ok()
  //edit group
    .click(Selector('td').find('a').withText('Edit'))
    .typeText('#name', 'audi fans', { replace: true })
    await t.click(Selector('button').withText('Submit'))
    .expect(Selector('a').withText('audi fans').exists).ok()
})

 test('Activity', async (t) => {
   const commentText = "What's new bro?"
   await t.useRole(buyerRole)
     .click(topMenu.buttons.menuDropdown)
     .click(topMenu.buttons.dashboard)
     await checkTranslation(translationMissing) // dashboard translation missing check
     await t.click(dashboard.nav.activityFeed)
     await checkTranslation(translationMissing) // activity feed translation missing check
     await t.typeText(Selector('textarea'), commentText)
     .click(Selector('button').withText('Send'))
     .click(topMenu.buttons.menuDropdown)
     .click(topMenu.buttons.dashboard)
     .click(dashboard.nav.publicProfile)
     .expect(Selector('div').withText(commentText).exists).ok("checks if feed exists at user's profile activities")
 })
