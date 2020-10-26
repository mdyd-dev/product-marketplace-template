import { Selector } from 'testcafe';

export default class AdminPanel {
  constructor() {
    this.menu = {
      users: Selector('a').withText('Users'),
      home: Selector('a').withText('Home'),
      activities: Selector('a').withText('Activities'),
      categories: Selector('a').withText('Categories'),
      orders: Selector('a').withText('Orders'),
      items: Selector('li').find('a').withText('Items'),
      setup: Selector('a').withText('Setup'),
      supportTickets: Selector('a').withText('Support tickets')
    }
    this.tableRows = {
      users: Selector('tbody').find('tr'),
      orders: Selector('tbody').find('tr'),
      items: Selector('tbody').find('tr'),
      categories: Selector('tbody').find('tr')
    }
    this.buttons = {
      addCategory: Selector('a').withText('Add category'),
      save: Selector('button').withText('Save')
    }
    this.inputs = {
      categoryNameField: Selector('#key')
    }
  }
}