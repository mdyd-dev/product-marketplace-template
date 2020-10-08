import { Selector } from 'testcafe';

export default class ItemShowPage {
  constructor(item) {
    this.fields = {
      name: Selector('h1').withText(item.name),
      description: Selector('div p').withText(item.description),
      price: Selector('div span').withText(
        (10000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
      ),
      editedPrice: Selector('div span').withText(
        (5000).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })
      ),
      displayImage: ('img[src="_uploads_/testimage.png"]')
    }
    this.buttons = {
      alreadyFollowedState: Selector('.following'),
      follow: Selector('button').withAttribute('data-follow-user'),
      buy: Selector('button').withText('Buy'),
      edit: Selector('main').find('a').withText('Edit'),
      delete: Selector('button').withText('Delete'),
      browseUsersList: Selector('a').withText("Browse this user's items")
    }
    this.status = {
      ordered: Selector('div').withText('Ordered')
    }
  }
}