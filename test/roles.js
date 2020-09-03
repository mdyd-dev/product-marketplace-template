import { Role } from 'testcafe';
import NewSessionForm from './pages/newsession'
const newSessionForm = new NewSessionForm()

const myUrl = 'https://damcikinstance.staging.oregon.platform-os.com/'

const buyerRole = Role(myUrl + 'sessions/new', async (t) => {
  await t
    .typeText(newSessionForm.emailInput, 'johnsmith@email.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

const sellerRole = Role(myUrl + 'sessions/new', async (t) => {
  await t
    .typeText(newSessionForm.emailInput, newEmail)
    .typeText(newSessionForm.passInput, newPassword)
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

const adminRole = Role(myUrl + 'sessions/new', async (t) => {
  await t
    .typeText(newSessionForm.emailInput, 'admin@example.com')
    .typeText(newSessionForm.passInput, 'password')
    .click(newSessionForm.logInBtn)
  await t.expect(Selector('main').withText(loginConfirmation).exists).ok('message ' + loginConfirmation + " doesn't exists")
})

export default { buyerRole, sellerRole, adminRole };
