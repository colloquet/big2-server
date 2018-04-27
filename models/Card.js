class Card {
  constructor(number, suit) {
    this.number = number
    this.rank = { 1: 14, 2: 15 }[number] || number
    this.suit = suit
  }
}

module.exports = Card
