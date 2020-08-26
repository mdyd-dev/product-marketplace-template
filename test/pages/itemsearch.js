import { Selector } from 'testcafe';

export default class ItemSearch {
  constructor(item) {
    this.searchField = Selector('#k')
    this.searchBtn = Selector('button').withText('Search')
    this.itemAhref = Selector('main').withText(item.name)
    this.itemLink = Selector('a').withText(item.name)
  }
}