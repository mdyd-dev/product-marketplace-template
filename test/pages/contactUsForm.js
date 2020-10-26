import { Selector } from 'testcafe';

export default class ContactUs {
  constructor() {
    this.inputs = {
      email: Selector('input[name="contact[email]"]'),
      message: Selector('textarea[name="contact[message]"]')
    }

    this.buttons = {
      menuDropdown: Selector('select[name="contact[reason]"]'),
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
