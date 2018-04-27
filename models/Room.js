const _ = require('lodash')

const Card = require('./Card')

const INITIAL_CARDS = {
  1: {
    A: [
      new Card(3, 2),
      new Card(4, 1),
      new Card(4, 3),
      new Card(5, 2),
      new Card(5, 1),
      new Card(12, 3),
      new Card(12, 1),
      new Card(13, 2),
      new Card(13, 4),
      new Card(1, 3),
      new Card(2, 3),
    ],
    B: [new Card(6, 4), new Card(2, 2), new Card(2, 1)],
  },
  2: {
    A: [
      new Card(2, 3),
      new Card(13, 1),
      new Card(13, 4),
      new Card(13, 3),
      new Card(12, 4),
      new Card(12, 3),
      new Card(12, 2),
      new Card(9, 2),
      new Card(9, 1),
      new Card(7, 3),
      new Card(7, 4),
      new Card(6, 4),
      new Card(6, 2),
      new Card(5, 2),
      new Card(5, 1),
      new Card(4, 3),
      new Card(4, 4),
      new Card(3, 4),
    ],
    B: [new Card(1, 1), new Card(1, 3), new Card(11, 1), new Card(11, 3)],
  },
}

class Room {
  constructor(id, host, mode = 2) {
    this.id = id
    this.members = {
      [host.side]: host.id,
    }
    this.mode = mode
    this.meta = {
      members: {
        [host.side]: host.name,
      },
      cards: {
        A: [...INITIAL_CARDS[mode].A],
        B: [...INITIAL_CARDS[mode].B],
      },
      turn: 'A',
      turnCount: 0,
      lastPlayedCards: [],
      history: [],
    }
  }

  join(id, side, name) {
    this.members[side] = id
    this.meta.members[side] = name
  }

  leave(id) {
    if (this.members.A === id) {
      delete this.members.A
    } else if (this.members.B === id) {
      delete this.members.B
    }
  }

  play(side, cards) {
    _.pullAllWith(
      this.meta.cards[side],
      cards,
      (card, other) => card.number === other.number && card.suit === other.suit,
    )
    this.meta.lastPlayedCards = cards
    this.meta.history.push(cards)
    this.meta.turn = side === 'A' ? 'B' : 'A'
    this.meta.turnCount += 1
  }

  isAvailable(side, mode) {
    const oppositeSide = side === 'A' ? 'B' : 'A'
    return oppositeSide in this.members && !(side in this.members) && this.mode === mode
  }

  hasMember(id) {
    return this.members.A === id || this.members.B === id
  }
}

module.exports = Room
