import { Selector, t } from 'testcafe'
import { buyerRole } from './roles'
import { John, myUrl, topMenu, dashboard, paymentsAccountPage, SellerRandomUser } from './fixtures'


fixture`Stripe`.page(myUrl)

test.page(myUrl+ '/sign-up')('Stripe', async (t) => {
  await t.useRole(buyerRole)
  .click(topMenu.buttons.menuDropdown)
  .click(topMenu.buttons.dashboard)
  .click(dashboard.nav.bankAccount)
  .click(dashboard.bankAccount.connectWithStripe)
  .click(paymentsAccountPage.countrySelect)
  .click(paymentsAccountPage.select.countryOption.withText('United States'))
  .click(paymentsAccountPage.radiobutton.typeOfEntity)
  .typeText(paymentsAccountPage.input.mobilePhone, '0000000000', { paste: true })
  .typeText(paymentsAccountPage.input.email, John.email, { replace: true }, { paste: true })
  .click(paymentsAccountPage.button.next)
  .click(paymentsAccountPage.button.useTestCode)
  .typeText(paymentsAccountPage.input.firstName, 'Damian', { paste: true })
  .typeText(paymentsAccountPage.input.lastName, 'QA', { paste: true })
  .typeText(paymentsAccountPage.input.dobMonth, '12', { paste: true })
  .typeText(paymentsAccountPage.input.dobDay, '18', { paste: true })
  .typeText(paymentsAccountPage.input.dobYear, '1995', { paste: true })
  .typeText(paymentsAccountPage.input.addressStreet, '2045 Evans Ave', { paste: true })
  .typeText(paymentsAccountPage.input.addressCity, 'San Francisco', { paste: true })
  .typeText(paymentsAccountPage.input.addressCode, '94124', { paste: true })
  .click(paymentsAccountPage.stateSelect)
  .click(paymentsAccountPage.select.stateOption.withText("California"))
  .typeText(paymentsAccountPage.input.ssn, '0000', { paste: true })
  .click(paymentsAccountPage.button.next)
  .click(paymentsAccountPage.button.selectIndustrySelect)
  .click(paymentsAccountPage.select.industryOption)
  .typeText(paymentsAccountPage.input.companyWebsite, 'www.company.com', { paste: true })
  .click(paymentsAccountPage.button.next)
  .click(paymentsAccountPage.button.useTestAccount)
  .click(paymentsAccountPage.button.done)
  .click(Selector('a').withText('Continue'))
  .click(Selector('a').withText('Stripe Account Dashboard'))

})
