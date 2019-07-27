const big2Engine = {
  isConsecutive(numbers) {
    return numbers.every((number, i) => {
      const lastNumber = numbers[numbers.length - 1];
      const nextNumber = numbers[i + 1];
      return number === lastNumber || nextNumber === number + 1;
    });
  },
  isSameSuit(cards) {
    const { suit } = cards[0];
    return cards.every(card => card.suit === suit);
  },
  isSameNumber(cards) {
    const { number } = cards[0];
    return cards.every(card => card.number === number);
  },
  getMeta(cards) {
    const occurrences = cards.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.number]: acc[cur.number] ? acc[cur.number] + 1 : 1,
      }),
      {},
    );

    const uniqueNumbers = Object.keys(occurrences);
    const mostOccurredNumber = uniqueNumbers.reduce((acc, cur) => (occurrences[acc] > occurrences[cur] ? acc : cur));
    const biggerPart = cards.filter(card => +card.number === +mostOccurredNumber);
    const cardToCompare = this.getBiggestCard(biggerPart);

    return {
      uniqueNumbersLength: uniqueNumbers.length,
      maxOccurrence: occurrences[mostOccurredNumber],
      mostOccurredNumber,
      cardToCompare,
    };
  },
  isSingle(cards) {
    return cards.length === 1;
  },
  isPair(cards) {
    return cards.length === 2 && this.isSameNumber(cards);
  },
  isTriplet(cards) {
    return cards.length === 3 && this.isSameNumber(cards);
  },
  isFive(cards) {
    return cards.length === 5;
  },
  isStraight(cards) {
    const numbers = cards.map(card => card.number).sort((a, b) => a - b);
    const ranks = cards.map(card => card.rank).sort((a, b) => a - b);
    return this.isConsecutive(numbers) || this.isConsecutive(ranks);
  },
  isFlush(cards) {
    return this.isSameSuit(cards);
  },
  isFullHouse(cards) {
    const occurrences = this.getMeta(cards);
    return occurrences.uniqueNumbersLength === 2 && occurrences.maxOccurrence === 3;
  },
  isFourOfAKind(cards) {
    const occurrences = this.getMeta(cards);
    return occurrences.uniqueNumbersLength === 2 && occurrences.maxOccurrence === 4;
  },
  isRoyalFlush(cards) {
    return this.isStraight(cards) && this.isFlush(cards);
  },
  isPass(cards) {
    return cards.length === 0;
  },
  isCardMorePowerful(card1, card2) {
    const card1Score = card1.rank + card1.suit / 10;
    const card2Score = card2.rank + card2.suit / 10;
    return card1Score > card2Score;
  },
  getBiggestCard(cards) {
    return cards.reduce((acc, cur) => (this.isCardMorePowerful(acc, cur) ? acc : cur));
  },
  validateCombination(cards) {
    if (this.isPass(cards)) {
      return true;
    }

    if (this.isSingle(cards) || this.isPair(cards) || this.isTriplet(cards)) {
      return true;
    }

    if (this.isFive(cards)) {
      if (
        this.isStraight(cards)
        || this.isFlush(cards)
        || this.isFullHouse(cards)
        || this.isFourOfAKind(cards)
      ) {
        return true;
      }
    }

    return false;
  },
  validateMove(lastPlayedCards, cards) {
    if (this.isPass(lastPlayedCards)) {
      return !this.isPass(cards);
    } if (this.isPass(cards)) {
      return true;
    }

    if (this.isSingle(lastPlayedCards)) {
      if (!this.isSingle(cards)) {
        return false;
      }

      return this.isCardMorePowerful(cards[0], lastPlayedCards[0]);
    }

    if (this.isPair(lastPlayedCards)) {
      if (!this.isPair(cards)) {
        return false;
      }

      return this.isCardMorePowerful(cards[0], lastPlayedCards[0]);
    }

    if (this.isTriplet(lastPlayedCards)) {
      if (!this.isTriplet(cards)) {
        return false;
      }

      return this.isCardMorePowerful(cards[0], lastPlayedCards[0]);
    }

    if (this.isFive(lastPlayedCards)) {
      if (!this.isFive(cards)) {
        return false;
      }

      if (this.isStraight(lastPlayedCards)) {
        if (this.isStraight(cards)) {
          const myBiggestCard = this.getBiggestCard(cards);
          const opponentBiggestCard = this.getBiggestCard(lastPlayedCards);

          return this.isCardMorePowerful(myBiggestCard, opponentBiggestCard);
        }

        if (
          this.isFlush(cards)
          || this.isFullHouse(cards)
          || this.isFourOfAKind(cards)
          || this.isRoyalFlush(cards)
        ) {
          return true;
        }

        return false;
      }

      if (this.isFlush(lastPlayedCards)) {
        if (this.isFlush(cards)) {
          if (cards[0].suit === lastPlayedCards[0].suit) {
            const myBiggestCard = this.getBiggestCard(cards);
            const opponentBiggestCard = this.getBiggestCard(lastPlayedCards);

            return this.isCardMorePowerful(myBiggestCard, opponentBiggestCard);
          }

          return cards[0].suit > lastPlayedCards[0].suit;
        }

        if (this.isFullHouse(cards) || this.isFourOfAKind(cards) || this.isRoyalFlush(cards)) {
          return true;
        }

        return false;
      }

      if (this.isFullHouse(lastPlayedCards)) {
        if (this.isFullHouse(cards)) {
          const myMeta = this.getMeta(cards);
          const opponentMeta = this.getMeta(lastPlayedCards);

          return this.isCardMorePowerful(myMeta.cardToCompare, opponentMeta.cardToCompare);
        }

        if (this.isFourOfAKind(cards) || this.isRoyalFlush(cards)) {
          return true;
        }

        return false;
      }

      if (this.isFourOfAKind(lastPlayedCards)) {
        if (this.isFourOfAKind(cards)) {
          const myMeta = this.getMeta(cards);
          const opponentMeta = this.getMeta(lastPlayedCards);

          return this.isCardMorePowerful(myMeta.cardToCompare, opponentMeta.cardToCompare);
        }

        if (this.isRoyalFlush(cards)) {
          return true;
        }

        return false;
      }

      if (this.isRoyalFlush(lastPlayedCards)) {
        if (this.isRoyalFlush(cards)) {
          if (cards[0].suit === lastPlayedCards[0].suit) {
            const myBiggestCard = this.getBiggestCard(cards);
            const opponentBiggestCard = this.getBiggestCard(lastPlayedCards);

            return this.isCardMorePowerful(myBiggestCard, opponentBiggestCard);
          }

          return cards[0].suit > lastPlayedCards[0].suit;
        }

        return false;
      }
    }

    return false;
  },
};

module.exports = big2Engine;
