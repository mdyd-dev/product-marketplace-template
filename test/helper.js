import { t, ClientFunction, Selector } from 'testcafe';
import NewSessionForm from './pages/newsession'
import profileEditPage from './pages/profileEdit'
import TopMenuBtns from './pages/topmenu'
import NewItemForm from './pages/newitem'

const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const registerForm = new NewSessionForm()
const profileFilling = new profileEditPage()
export const getURL = ClientFunction(() => window.location.href)
export const myUrl = process.env.MPKIT_URL


export async function register(newEmail, newPassword, newUsername, firstName, lastName) {
    await t
    .typeText(registerForm.emailInput, newEmail)
    .typeText(registerForm.passInput, newPassword)
    .click(registerForm.submitBtn)
    await t
    var getLocation = await getURL()
    await t.expect(getLocation).contains(myUrl+ 'dashboard/profile/edit')
    await t.typeText(profileFilling.usernameField, newUsername)
    .typeText(profileFilling.firstnameField, firstName)
    .typeText(profileFilling.lastnameField, lastName)
    .click(profileFilling.saveButton);
};

export async function createItem(itemName, itemDescription, itemPrice) {
    await t.click(topMenu.listItemBtn)
    .typeText(newItemForm.nameField, itemName)
    .typeText(newItemForm.descField, itemDescription)
    .typeText(newItemForm.priceField, itemPrice, { replace: true })
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), [
      '_uploads_/testimage.png',
    ])
    .click(newItemForm.submitBtn)
};