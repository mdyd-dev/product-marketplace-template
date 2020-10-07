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
    .typeText(registerForm.inputs.email, user.email)
    .typeText(registerForm.inputs.password, user.password)
    await t.click(registerForm.buttons.regSubmit)
    const getLocation = await getURL()
    await t.expect(getLocation).contains(myUrl+ 'dashboard/profile/edit')
    .typeText(profileEditForm.inputs.name, user.name)
    .typeText(profileEditForm.inputs.firstName, user.firstName)
    .typeText(profileEditForm.inputs.lastName, user.lastName)
    .click(profileEditForm.buttons.save)
};

export async function createItem(itemName, itemDescription, itemPrice) {
    await t.click(topMenu.buttons.listItem)
    await t.typeText(newItemForm.inputs.name, itemName)
    await checkTranslation(translationMissing)
    await t.typeText(newItemForm.inputs.description, itemDescription)
    .typeText(newItemForm.inputs.price, itemPrice, { replace: true })
    .click(newItemForm.buttons.browseImages)
    .setFilesToUpload(Selector('main').find('[name="files[]"]'), [
      '_uploads_/testimage.png',
    ])
    .click(newItemForm.buttons.submit)
};
