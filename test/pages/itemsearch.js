import { Selector } from 'testcafe';

export default class ItemSearch {
  constructor(item, editedItem) {
    this.searchField = Selector('#k')
    this.searchBtn = Selector('button').withText('Search')
    this.itemLink = Selector('a').withText(item.name)
    this.editedItemLink = Selector('div').find('a').withText(editedItem.name)
    this.sortButton = Selector('#sort')
  }
}