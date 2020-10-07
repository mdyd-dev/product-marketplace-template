import { Selector } from 'testcafe';

export default class ItemSearch {
  constructor(item, editedItem) {
    this.links = {
      item: Selector('a').withText(item.name),
      editedItem: Selector('div').find('a').withText(editedItem.name)
    }
    this.search = {
      keyword: Selector('#k'),
    }
    this.buttons = {
      sort: Selector('#sort'),
      search: Selector('button').withText('Search')
    }

    //this.keyword = Selector('#k')
    //this.searchBtn = Selector('button').withText('Search')

    //this.itemLink = Selector('a').withText(item.name)
    //this.editedItemLink = Selector('div').find('a').withText(editedItem.name)

    //this.sortButton = Selector('#sort')
  }
}