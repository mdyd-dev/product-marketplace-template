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
}