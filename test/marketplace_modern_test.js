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
    await t.click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    await t.click(dashboard.editProfile)
    await checkTranslation(translationMissing) // profile eidt translation missing check
    await t.typeText(profileEditForm.name, John.name, { replace: true })
    .typeText(profileEditForm.firstName, John.firstName, { replace: true })
    .typeText(profileEditForm.lastName, John.lastName, { replace: true })
    .click(profileEditForm.saveButton)
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.goProfile)
    await checkTranslation(translationMissing) // public profile translation missing check
  await t
    .expect(Selector('main').find('#user-name').withText(`${John.firstName} ${John.lastName}`).exists).ok()
})

test(`Reset Password test`, async (t) => {
  await t
    .click(topMenu.logInBtn)
    .click(loginForm.resetBtn)
    .typeText(loginForm.emailInput, 'resetpassword@example.com')
    .click(loginForm.resetPasswordSubmit)
    .expect(Selector('main').withText(resetConfirmation).exists)
    .ok('message ' + resetConfirmation + " doesn't exists");
});


test.page(myUrl + '/sessions/new')(`Trying to register with taken data and log in with wrong data`, async (t) => {
  await t
    .click(loginForm.logInBtn)
    await checkTranslation(translationMissing) // log in form translation missing check
    await t.expect(loginForm.emailLabel.textContent).contains('cannot be blank')
    .expect(loginForm.passwordLabel.textContent).contains('cannot be blank')
    .typeText(loginForm.emailInput, 'admin@example.com')
    .typeText(loginForm.passInput, 'asd')
    .click(loginForm.logInBtn)
    .expect(loginForm.emailLabel.textContent).contains('Invalid email or password')
    .click(loginForm.regBtn)
    .typeText(registerForm.emailInput, 'admin@example.com')
    .typeText(registerForm.passInput, 'asd')
    .click(registerForm.submitBtn)
    .expect(registerForm.emailLabel.textContent).contains('already taken')
})

test('Creating item then trying to follow', async (t) => {
  await t.useRole(sellerRole)
  await createItem(item.name, item.description, item.price)
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
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.goProfile)
  const sellerProfilePage = ClientFunction(() => document.location.href)
  await t.expect(sellerProfilePage()).contains(myUrl+'profile/' + SellerRandomUser.name) // checks if href contains slugified username
    .click(Selector('a').withText("Items"))  // goes on your list from profile view
    .click(itemSearch.sortButton)
    .click(Selector('option').withText('The Most Recent'))
    .click(itemSearch.searchBtn)
    .click(itemSearch.itemLink)
    .click(Selector('a').withText("Browse this user's items")) // goes on your list from item show
    .click(itemSearch.itemLink)

  //change of item information
  await t.click(itemShow.editbutton)
  await checkTranslation(translationMissing)
    await t.typeText(newItemForm.nameField, editedItem.name, { replace: true })
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
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.goYourItems)
    .setNativeDialogHandler(() => true)
    .click(editPage.deleteBtn)
})

test('Creating new item for sell', async (t) => {
  await t.useRole(sellerRole)
  await createItem(item.name, item.description, item.price)
})

test('Buying an item and following the seller', async (t) => {
  await t
    .useRole(buyerRole)
    .click(topMenu.itemsBtn)
    .typeText(itemSearch.keyword, item.name)
    .click(itemSearch.searchBtn)
    .expect(itemSearch.itemLink.exists).ok()
    .click(itemSearch.itemLink)
    .click(itemShow.followButton)
    .expect(itemShow.alreadyFollowedButton.exists).ok()
    .click(itemShow.buyBtn)
    .click(Selector('button').withText('Checkout'))
    .click(Selector('button').withText('Pay'))
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.yourBuyingOrders) // buyer's order check
    .click(Selector('a').withText(item.name))
    .expect(Selector('div').withText('Ordered').exists).ok()
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.goProfile)
    .click(Selector('a').withText('Following'))
    .expect(Selector('h2').find('a').withText(SellerRandomUser.name).exists).ok("Followed list not shown")

 await t
   .useRole(sellerRole) // seller checks if his order shown as paid
    .click(topMenu.menuDropdown)
   .click(topMenu.dashboardBtn)
   .click(dashboard.yourSellingOrders)  // seller's order check
   .expect(Selector('a').withText(item.name).exists).ok("Item list not shown in seller orders")
 })


 test(`Admin Panel test`, async (t) => {
   await t
     .useRole(adminRole)
     .click(topMenu.adminBtn)
     await checkTranslation(translationMissing) // Admin panel translation missing check
     await t.click(adminPage.users)
   const usersTableRow = Selector('tbody').find('tr')
   await t.expect(usersTableRow.count).gte(1)
     .click(adminPage.orders)
    const ordersTableRow = Selector('tbody').find('tr')
    await t.expect(ordersTableRow.count).gte(1)
      .click(adminPage.items)
   const itemsTableRow = Selector('tbody').find('tr')
   await t.expect(itemsTableRow.count).gt(1)
     .click(adminPage.categories)
   const categoriesTableRow = Selector('tbody').find('tr')
   await t.expect(categoriesTableRow.count).gt(1)
     .click(adminPage.activities)
     .click(adminPage.setup)
 })


test('Breakin-in test, edition by none user', async (t) => {
  await t.useRole(buyerRole)
    .click(topMenu.itemsBtn)
    .typeText(itemSearch.keyword, 'Watch')
    .click(itemSearch.searchBtn)
    .click(Selector('a').withText('Watch'))
  var itemEditUrl = await getURL()
  var itemEditUrl = itemEditUrl.split('-')
  var editItemId = itemEditUrl[itemEditUrl.length - 1]
  await t.navigateTo(editURL + editItemId)
  await t.expect(Selector('div').withText(notAuthorizedUser).exists).ok('message ' + notAuthorizedUser + " doesn't exists")
})

test('Groups', async (t) => {
  await t.useRole(buyerRole)
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.yourGroups)
    await checkTranslation(translationMissing) // my groups translation missing check

  await t
    .click(Selector('main').find('a').withText('Add group'))
    await checkTranslation(translationMissing)
    await t.typeText('#name', groupName)
    .typeText('#summary', "fun-club")
    .typeText('#description', loremSentence, { paste: true })
    .click(Selector('button').withText('Submit'))
  //unique test
    .click(topMenu.menuDropdown)
    .click(topMenu.dashboardBtn)
    .click(dashboard.yourGroups)
    .click(Selector('a').withText('Add group'))
    .typeText('#name', groupName)
    .typeText('#summary', "fun-club")
    .typeText('#description', loremSentence, { paste: true })
    .click(Selector('button').withText('Submit'))
    .expect(Selector('div').textContent).contains('already taken')
  //checks if group exists
    .click(dashboard.yourGroups)
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
     .click(topMenu.menuDropdown)
     .click(topMenu.dashboardBtn)
     await checkTranslation(translationMissing) // dashboard translation missing check
     await t.click(dashboard.activityFeed)
     await checkTranslation(translationMissing) // activity feed translation missing check
     await t.typeText(Selector('textarea'), commentText)
     .click(Selector('button').withText('Send'))
     .click(topMenu.menuDropdown)
     .click(topMenu.dashboardBtn)
     .click(dashboard.goProfile)
     .expect(Selector('div').withText(commentText).exists).ok("checks if feed exists at user's profile activities")
 })
