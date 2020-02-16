const _ = require('lodash');

const { Card } = require('big2-util');

const INITIAL_CARDS = {
  1: {
    A: [
      Card(3, 2),
      Card(4, 1),
      Card(4, 3),
      Card(5, 2),
      Card(5, 1),
      Card(12, 3),
      Card(12, 1),
      Card(13, 2),
      Card(13, 4),
      Card(1, 3),
      Card(2, 3),
    ],
    B: [Card(6, 4), Card(2, 2), Card(2, 1)],
  },
  2: {
    A: [
      Card(2, 3),
      Card(13, 1),
      Card(13, 4),
      Card(13, 3),
      Card(12, 4),
      Card(12, 3),
      Card(12, 2),
      Card(9, 2),
      Card(9, 1),
      Card(7, 3),
      Card(7, 4),
      Card(6, 4),
      Card(6, 2),
      Card(5, 2),
      Card(5, 1),
      Card(4, 3),
      Card(4, 4),
      Card(3, 4),
    ],
    B: [Card(1, 1), Card(1, 3), Card(11, 1), Card(11, 3)],
  },
};

class Room {
  constructor(id, host, mode = 2) {
    this.id = id;
    this.members = {
      [host.side]: host.id,
    };
    this.mode = mode;
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
    };
  }

  join(id, side, name) {
    this.members[side] = id;
    this.meta.members[side] = name;
  }

  leave(id) {
    if (this.members.A === id) {
      delete this.members.A;
    } else if (this.members.B === id) {
      delete this.members.B;
    }
  }

  play(side, cards) {
    _.pullAllWith(
      this.meta.cards[side],
      cards,
      (card, other) => card.number === other.number && card.suit === other.suit,
    );
    this.meta.lastPlayedCards = cards;
    this.meta.history.push(cards);
    this.meta.turn = side === 'A' ? 'B' : 'A';
    this.meta.turnCount += 1;
  }

  isAvailable(side, mode) {
    const oppositeSide = side === 'A' ? 'B' : 'A';
    return oppositeSide in this.members && !(side in this.members) && this.mode === mode;
  }

  hasMember(id) {
    return this.members.A === id || this.members.B === id;
  }
}

module.exports = Room;
