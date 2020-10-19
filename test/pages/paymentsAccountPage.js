import { Selector, t } from 'testcafe';




export default class PaymentsAccountPage {
  constructor() {
    this.countrySelect = Selector('#country');
    this.stateSelect = Selector('select[name="subregion"]');
    this.input = {
      mobilePhone: Selector('#phone_number'),
      phone: Selector('#phone'),
      email: Selector('#email'),
      password: Selector('#password'),
      firstName: Selector('input[name="first_name"]'),
      lastName: Selector('input[name="last_name"]'),
      dobDay: Selector('input[name="dob-day"]'),
      dobMonth: Selector('input[name="dob-month"]'),
      dobYear: Selector('input[name="dob-year"]'),
      addressStreet: Selector('input[name="address"]'),
      addressCity: Selector('input[name="locality"]'),
      addressCode: Selector('input[name="zip"]'),
      ssn: Selector('input[name="ssn_last_4"]'),
      companyWebsite: Selector('input[name="business_profile[url]"]')
    };
    this.select = {
      countryOption: this.countrySelect.find('option'),
      stateOption: this.stateSelect.find('option'),
      industryOption: Selector('li:nth-of-type(2) span span')
    };
    this.radiobutton = {
      typeOfEntity: Selector('input[value="individual"]')
    };
    this.checkbox = {
      tosAccept: Selector('#tos-accept')
    };
    this.button = {
      next: Selector('.Button-label > span').withText('Next'),
      useTestAccount: Selector('.Button-label > span').withText('Use test account'),
      save: Selector('.Button-label > span').withText('Save'),
      update: Selector('[aria-label="Update business details"] .Button-label > span').withText('Update'),
      useTestCode: Selector('span').withText('Use test code'),
      signIn: Selector('button[type="submit"]'),
      selectIndustrySelect: Selector('button[type="button"].PressableContext'),
      updateData: Selector('.Button-label span').withText('Update'),
      done: Selector('.Button-label.Text-color--white > span')
    };
    this.link = {
      testPhoneNumber: Selector('span').withText('the test phone number'),
      stripeAccountDashboard: Selector('a').withText('Stripe Account Dashboard'),
      account: Selector('[href="/account"]'),
      returnMerchantAccountManagement: Selector('a').withText('‹ Return to Bank Account management')
    };
    this.element = {
      payoutAccountConfirmation: Selector('[data-test="information"] span'),
      stripeStatus: Selector('.Text-color--default').withText(
        'You’re almost ready to start getting paid by Golfstix Corporation. Please confirm your information below.'
      ),
      accountVerified: Selector('body').withText(
        'You have successfully connected and verified your Stripe account.')
    };
  }

  async selectCountry(country) {
    await t.click(this.countrySelect).click(this.select.countryOption.withText(country));
  }

  async selectState(state) {
    await t.click(this.stateSelect).click(this.select.stateOption.withText(state));
  }

  async selectIndustry() {
    await t.click(this.button.selectIndustrySelect).click(this.select.industryOption);
  }

  async createMA() {
    await t.eval(() => location.reload(true));
    await t.click(this.button.connectStripe);
    // Type of account
    await this.selectCountry('United States');
    await t
      .click(this.radiobutton.typeOfEntity)
      .typeText(this.input.mobilePhone, '0000000000')
      .typeText(this.input.email, stripeUser)
      .click(this.button.next);
    const product = await this.button.useTestCode.with({
      visibilityCheck: true
    })();
    // Verification step
    await t.click(this.button.useTestCode);
    const inputName = await this.input.firstName.with({
      visibilityCheck: true
    })();
    // Your details
    await t
      .typeText(this.input.firstName, 'Damian')
      .typeText(this.input.lastName, 'QA')
      .typeText(this.input.dobMonth, '12')
      .typeText(this.input.dobDay, '18')
      .typeText(this.input.dobYear, '1995')
      .typeText(this.input.addressStreet, '2045 Evans Ave')
      .typeText(this.input.addressCity, 'San Francisco')
      .typeText(this.input.addressCode, '94124');
    await this.selectState('California');
    await t.typeText(this.input.ssn, '0000').click(this.button.next);
    await t.expect(this.input.companyWebsite.exists).ok('', {
      timeout: 100000
    });
    // Business details
    await t.typeText(this.input.companyWebsite, 'www.company.com');
    await this.selectIndustry('Software');
    await t.click(this.button.next);
    await t.expect(this.button.useTestAccount.exists).ok('', {
      timeout: 100000
    });
    // Payout details
    await t.click(this.button.useTestAccount);
    await t.expect(this.element.stripeStatus.exists).ok('', {
      timeout: 100000
    });
    // Verification summary
    await t.click(this.button.done);
    // Redirecting to Golfstix
    await t.expect(this.element.payoutAccountConfirmation.exists).ok('', {
      timeout: 100000
    });
    await t.expect(this.element.payoutAccountConfirmation.innerText).contains('Thank you!');
  }

  async addCC() {
    await t
      .click(homePage.button.headerNav)
      .click(homePage.link.myCreditCards)
    await t.eval(() => location.reload(true));
    await t
      .click(creditCardsPage.button.addCreditCard)
      .switchToIframe(creditCardsPage.iframe.iframeStripe)
      .typeText(creditCardsPage.input.cardNumber, credit_card.VALID_CC)
      .typeText(creditCardsPage.input.date, '12/23')
      .typeText(creditCardsPage.input.ccv, '111')
      .click(creditCardsPage.button.submitCharge)
      .wait(3000);
    await t.switchToMainWindow();

    //Verify CC
    await t.expect(creditCardsPage.element.creditCard.exists).ok();
  }
}