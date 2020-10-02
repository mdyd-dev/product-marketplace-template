import { t, ClientFunction, Selector } from 'testcafe';
import NewSessionForm from './pages/newsession'
import ProfileEditForm from './pages/profileEdit'
import TopMenuBtns from './pages/topmenu'
import NewItemForm from './pages/newitem'
import { getURL, myUrl } from './fixtures'

const newItemForm = new NewItemForm()
const topMenu = new TopMenuBtns()
const registerForm = new NewSessionForm()
const profileEditForm = new ProfileEditForm()
const translationMissing = Selector('body').withText('translation missing')
async function checkTranslation(selector) {
  if (await selector.exists)
  await t.expect(selector.exists).notOk()
};

export async function register(user) {
  checkTranslation(translationMissing)
  await t
    .typeText(registerForm.emailInput, user.email)
    .typeText(registerForm.passInput, user.password)
    await t.click(registerForm.submitBtn)
    const getLocation = await getURL()
    await t.expect(getLocation).contains(myUrl+ 'dashboard/profile/edit')
    .typeText(profileEditForm.name, user.name)
    .typeText(profileEditForm.firstName, user.firstName)
    .typeText(profileEditForm.lastName, user.lastName)
    .click(profileEditForm.saveButton)
};

export async function createItem(itemName, itemDescription, itemPrice) {
    await t.click(topMenu.listItemBtn)
    await t.typeText(newItemForm.nameField, itemName)
    await checkTranslation(translationMissing)
    await t.typeText(newItemForm.descField, itemDescription)
    .typeText(newItemForm.priceField, itemPrice, { replace: true })
    .click(newItemForm.browseBtn)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), [
      '_uploads_/testimage.png',
    ])
    .click(newItemForm.submitBtn)
};
