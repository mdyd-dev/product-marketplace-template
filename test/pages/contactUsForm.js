import { Selector } from 'testcafe';

export default class ContactUs {
  constructor() {
    this.inputs = {
      email: Selector('#form-properties-attributes-email'),
      message: Selector('#form-properties-attributes-message')
    }

    this.buttons = {
      menuDropdown: Selector('#form-properties-attributes-reason'),
      sendMessage: Selector('button').withText('Send message')
    }

    this.messages = {
      success: Selector('div').withText('Message sent. We will contact with you shortly.')
    }

    this.options = {
      purchase: Selector('option').withText('Purchase')
    }
  }
}
