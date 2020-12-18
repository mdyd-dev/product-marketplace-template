import { Selector } from 'testcafe';

export default class HomePage {
  constructor() {
    this.hero = {
      image: ('img[src="app/assets/images/home-hero.jpg"]'),
      h1: Selector('div').find('h1').withText('FIND YOUR TIME'),
      h2: Selector('p').withText(' MVP Marketplace is a social marketplace to buy and sell all things'),
      firstButton: Selector('p').find('a').withText('Find your dream watch'),
      secondButton: Selector('p').find('a').withText('Sell part of your collection')
    }
  }
}