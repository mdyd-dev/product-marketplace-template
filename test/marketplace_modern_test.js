import { Selector, ClientFunction, t } from 'testcafe'
import { buyerRole, sellerRole, adminRole } from './roles'
import { John, SellerRandomUser, myUrl, item, editedItem, getURL, editURL,
         notAuthorizedUser, group, Admin, link, commentText,
         adminPage, registerForm, loginForm, itemShow, editedItemShow,
         passwordResetForm, newItemForm, topMenu, itemSearch, dashboard,
         profileEditForm, orders, publicProfile, groupsPage, footer,
         contactUsForm, activityFeed, categoryName } from './fixtures'
import { register, createItem } from './helper'


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
    .expect(publicProfile.fields.username.withText(`${John.firstName} ${John.lastName}`).exists).ok()

})
test(`Reset Password test`, async (t) => {
  await t
    .click(topMenu.buttons.logIn)
    .click(loginForm.buttons.resetPassword)
    await t.typeText(passwordResetForm.inputs.email, Admin.email)
    await t.click(passwordResetForm.buttons.resetPasswordSubmit)
    const passwordResetUrl = await Selector('main').innerText
    await t.navigateTo(passwordResetUrl)
    .typeText(passwordResetForm.inputs.newPassword, Admin.newPassword)
    .typeText(passwordResetForm.inputs.newPasswordConfirmation, Admin.newPassword)
    .click(passwordResetForm.buttons.submit)
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
  await t.expect(itemShow.fields.displayImage).ok()
  await t.expect(itemShow.buttons.follow.exists).notOk()
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
    .click(topMenu.buttons.items)
    .click(itemSearch.buttons.sort)
    .click(itemSearch.options.theMostRecent)
    .click(itemSearch.buttons.search)
    .click(itemSearch.links.item)
    .click(itemShow.buttons.browseUsersList) // goes on your list from item show
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
  await createItem(item.commonName, item.description, item.price)
})

test('Buying an item and following the seller', async (t) => {
  await t
    .useRole(buyerRole)
    .click(topMenu.buttons.items)
    .typeText(itemSearch.search.keyword, item.commonName)
    .click(itemSearch.buttons.search)
    .expect(itemSearch.links.commonItem.exists).ok()
    .click(itemSearch.links.commonItem)
    .click(itemShow.buttons.follow)
    .expect(itemShow.buttons.alreadyFollowedState.exists).ok()
    .click(itemShow.buttons.buy)
    .click(orders.buttons.checkout) // i need to make orders page
    .click(orders.buttons.pay)
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.purchases) // buyer's order check
    .click(orders.tableRows.firstLink)
    .click(link.withText(item.commonName))
    .expect(itemShow.status.ordered.exists).ok()
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.publicProfile)
    .click(publicProfile.menu.following)
    .expect(publicProfile.links.userCard.withText(SellerRandomUser.name).exists).ok()

 await t
   .useRole(sellerRole) // seller checks if his order shown as paid
    .click(topMenu.buttons.menuDropdown)
   .click(topMenu.buttons.dashboard)
   .click(dashboard.nav.sold)  // seller's order check
   .expect(orders.tableRows.firstRow.withText(John.name).exists).ok()
 })


 test(`Admin Panel`, async (t) => {
   await t
     .useRole(adminRole)
     await t.click(topMenu.buttons.adminPanel)
     await checkTranslation(translationMissing) // Admin panel translation missing check

     await t.click(adminPage.menu.users)
     await t.expect(adminPage.tableRows.users.count).gte(1)

     await t.click(adminPage.menu.orders)
     await t.expect(adminPage.tableRows.orders.count).gte(1)

     await t.click(adminPage.menu.items)
     await t.expect(adminPage.tableRows.items.count).gt(1)

     await t.click(adminPage.menu.categories)
     await t.expect(adminPage.tableRows.categories.count).gt(1)

     await t.click(adminPage.menu.activities)
     await t.click(adminPage.menu.setup)
 })

 test(`Categories`, async (t) => {
  await t
    .useRole(adminRole)
    await t.click(topMenu.buttons.adminPanel)
    await t.click(adminPage.menu.categories)
    await t.click(adminPage.buttons.addCategory)
    await t.typeText(adminPage.inputs.categoryNameField, categoryName)
    await t.click(adminPage.buttons.save)
    await t.expect(link.withText(categoryName).exists).ok()
})


test('Breakin-in test, edition by none user', async (t) => {
  await t.useRole(buyerRole)
    .click(topMenu.buttons.items)
    .typeText(itemSearch.search.keyword, 'Watch')
    .click(itemSearch.buttons.search)
    .click(link.withText('Watch'))
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

    await t.click(groupsPage.buttons.addGroup)
    await checkTranslation(translationMissing)
    await t.typeText(groupsPage.inputs.name, group.name)
    .typeText(groupsPage.inputs.summary, group.summary)
    .typeText(groupsPage.inputs.description, group.description, { paste: true })
    .click(groupsPage.buttons.submitForm)
  //unique test
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.myGroups)
    .click(groupsPage.buttons.addGroup)
    .typeText(groupsPage.inputs.name, group.name)
    .typeText(groupsPage.inputs.summary, group.summary)
    .typeText(groupsPage.inputs.description, group.description, { paste: true })
    .click(groupsPage.buttons.submitForm)
    .expect(Selector('div').textContent).contains('already taken')
  //checks if group exists
    .click(dashboard.nav.myGroups)
    .expect(link.withText(group.name).exists).ok()
  //edit group
    .click(groupsPage.buttons.editGroup)
    .typeText(groupsPage.inputs.name, group.commonName, { replace: true })
    .click(groupsPage.buttons.submitForm)
    .expect(link.withText(group.commonName).exists).ok()
})

 test('Activity', async (t) => {
   await t.useRole(buyerRole)
     .click(topMenu.buttons.menuDropdown)
     .click(topMenu.buttons.dashboard)
     await checkTranslation(translationMissing) // dashboard translation missing check
     await t.click(dashboard.nav.activityFeed)
     await checkTranslation(translationMissing) // activity feed translation missing check
     await t.typeText(activityFeed.inputs.message, commentText)
     .click(activityFeed.buttons.send)
     .click(topMenu.buttons.menuDropdown)
     .click(topMenu.buttons.dashboard)
     .click(dashboard.nav.publicProfile)
     .expect(Selector('div').withText(commentText).exists).ok("checks if feed exists at user's profile activities")
 })

 test('Support tickets / Contact Us', async (t) => {
  await t.useRole(buyerRole)
    .click(footer.support.contactUs)
    .typeText(contactUsForm.inputs.email, John.email)
    .click(contactUsForm.buttons.menuDropdown)
    .click(contactUsForm.options.purchase)
    .typeText(contactUsForm.inputs.message, "There was a problem with...")
    .click(contactUsForm.buttons.sendMessage)
    .expect(contactUsForm.messages.success.exists).ok()

  // ticket check via admin panel

  await t.useRole(adminRole)
    .click(topMenu.buttons.adminPanel)
    .click(adminPage.menu.supportTickets)
    .click(Selector('article').withText(John.email))
    .expect(Selector('article').withText("There was a problem with...").exists).ok()
})


test('Smart search', async (t) => {
  await t.useRole(buyerRole)
    .typeText(itemSearch.quickSearch.keyword, John.name)
    .click(itemSearch.buttons.search)
    // expects item, group and profile with 'common name'
    .expect(link.withText(group.commonName).exists).ok()
    .expect(link.withText(item.commonName).exists).ok()
    .expect(link.withText(John.name).exists).ok()
})

test('Products', async (t) => {
  await t.useRole(sellerRole)
    .click(topMenu.buttons.menuDropdown)
    .click(topMenu.buttons.dashboard)
    .click(dashboard.nav.publicProfile)
    .click(publicProfile.menu.products)
    // expects an item that belongs to the profile we are currently visiting
    .expect(link.withText(item.commonName).exists).ok()
})
