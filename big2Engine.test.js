const big2Engine = require('./big2Engine')
const Card = require('./models/Card')

const single = [new Card(1, 1)]
const pair = [new Card(1, 1), new Card(1, 2)]
const triplet = [new Card(1, 1), new Card(1, 2), new Card(1, 3)]

const straight = [new Card(1, 1), new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 2)]
const flush = [new Card(1, 1), new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(6, 1)]
const fullHouse = [new Card(1, 1), new Card(1, 2), new Card(1, 3), new Card(2, 1), new Card(2, 2)]
const fourOfAKind = [new Card(1, 1), new Card(1, 2), new Card(1, 3), new Card(1, 4), new Card(2, 2)]
const royalFlush = [new Card(1, 1), new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1)]

test('identify singles', () => {
  expect(big2Engine.isSingle(single)).toBe(true)
  expect(big2Engine.isSingle(pair)).toBe(false)
  expect(big2Engine.isSingle(triplet)).toBe(false)
})

test('identify pairs', () => {
  expect(big2Engine.isPair(single)).toBe(false)
  expect(big2Engine.isPair(pair)).toBe(true)
  expect(big2Engine.isPair(triplet)).toBe(false)
})

test('identify triplets', () => {
  expect(big2Engine.isTriplet(single)).toBe(false)
  expect(big2Engine.isTriplet(pair)).toBe(false)
  expect(big2Engine.isTriplet(triplet)).toBe(true)
})

test('identify straights', () => {
  expect(big2Engine.isStraight(straight)).toBe(true)
  expect(big2Engine.isStraight(flush)).toBe(false)
  expect(big2Engine.isStraight(fullHouse)).toBe(false)
  expect(big2Engine.isStraight(fourOfAKind)).toBe(false)
  expect(big2Engine.isStraight(royalFlush)).toBe(true)
})

test('identify flushes', () => {
  expect(big2Engine.isFlush(straight)).toBe(false)
  expect(big2Engine.isFlush(flush)).toBe(true)
  expect(big2Engine.isFlush(fullHouse)).toBe(false)
  expect(big2Engine.isFlush(fourOfAKind)).toBe(false)
  expect(big2Engine.isFlush(royalFlush)).toBe(true)
})

test('identify fullHouses', () => {
  expect(big2Engine.isFullHouse(straight)).toBe(false)
  expect(big2Engine.isFullHouse(flush)).toBe(false)
  expect(big2Engine.isFullHouse(fullHouse)).toBe(true)
  expect(big2Engine.isFullHouse(fourOfAKind)).toBe(false)
  expect(big2Engine.isFullHouse(royalFlush)).toBe(false)
})

test('identify four of a kinds', () => {
  expect(big2Engine.isFourOfAKind(straight)).toBe(false)
  expect(big2Engine.isFourOfAKind(flush)).toBe(false)
  expect(big2Engine.isFourOfAKind(fullHouse)).toBe(false)
  expect(big2Engine.isFourOfAKind(fourOfAKind)).toBe(true)
  expect(big2Engine.isFourOfAKind(royalFlush)).toBe(false)
})

test('identify royal flushes', () => {
  expect(big2Engine.isRoyalFlush(straight)).toBe(false)
  expect(big2Engine.isRoyalFlush(flush)).toBe(false)
  expect(big2Engine.isRoyalFlush(fullHouse)).toBe(false)
  expect(big2Engine.isRoyalFlush(fourOfAKind)).toBe(false)
  expect(big2Engine.isRoyalFlush(royalFlush)).toBe(true)
})

test('identify valid combinations', () => {
  expect(big2Engine.validateCombination(single)).toBe(true)
  expect(big2Engine.validateCombination(pair)).toBe(true)
  expect(big2Engine.validateCombination(triplet)).toBe(true)
  expect(big2Engine.validateCombination(straight)).toBe(true)
  expect(big2Engine.validateCombination(flush)).toBe(true)
  expect(big2Engine.validateCombination(fullHouse)).toBe(true)
  expect(big2Engine.validateCombination(fourOfAKind)).toBe(true)
  expect(big2Engine.validateCombination(royalFlush)).toBe(true)
})

test('identify invalid combinations', () => {
  // pairs
  expect(big2Engine.validateCombination([new Card(1, 1), new Card(2, 1)])).toBe(false)

  // triplets
  expect(big2Engine.validateCombination([new Card(1, 1), new Card(1, 2), new Card(2, 1)])).toBe(false)

  // four
  expect(big2Engine.validateCombination([
    new Card(1, 1),
    new Card(1, 2),
    new Card(1, 3),
    new Card(1, 4),
  ])).toBe(false)

  // fives
  expect(big2Engine.validateCombination([
    new Card(1, 1),
    new Card(2, 1),
    new Card(3, 2),
    new Card(4, 2),
    new Card(6, 2),
  ])).toBe(false)

  expect(big2Engine.validateCombination([
    new Card(1, 1),
    new Card(2, 1),
    new Card(3, 2),
    new Card(4, 2),
    new Card(6, 2),
    new Card(7, 2),
  ])).toBe(false)
})

test('identify valid moves', () => {
  // singles
  expect(big2Engine.validateMove([new Card(13, 1)], [new Card(1, 1)])).toBe(true)

  // pairs
  expect(big2Engine.validateMove([new Card(13, 1), new Card(13, 2)], [new Card(1, 1), new Card(1, 2)])).toBe(true)

  // triplets
  expect(big2Engine.validateMove(
    [new Card(13, 1), new Card(13, 2), new Card(13, 3)],
    [new Card(1, 1), new Card(1, 2), new Card(1, 3)],
  )).toBe(true)

  // straights
  expect(big2Engine.validateMove(
    [new Card(3, 1), new Card(4, 2), new Card(5, 3), new Card(6, 3), new Card(7, 3)],
    [new Card(2, 1), new Card(3, 1), new Card(4, 2), new Card(5, 3), new Card(6, 3)],
  )).toBe(true)
  expect(big2Engine.validateMove(
    [new Card(2, 1), new Card(3, 2), new Card(4, 3), new Card(5, 4), new Card(6, 4)],
    [new Card(2, 2), new Card(3, 1), new Card(4, 2), new Card(5, 3), new Card(6, 3)],
  )).toBe(true)
  expect(big2Engine.validateMove(
    [new Card(10, 1), new Card(11, 2), new Card(12, 3), new Card(13, 4), new Card(1, 4)],
    [new Card(11, 2), new Card(12, 1), new Card(13, 2), new Card(1, 3), new Card(2, 3)],
  )).toBe(true)

  // flushes
  expect(big2Engine.validateMove(
    [new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(9, 1)],
    [new Card(8, 2), new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(7, 2)],
  )).toBe(true)
  expect(big2Engine.validateMove(
    [new Card(10, 1), new Card(11, 1), new Card(12, 1), new Card(13, 1), new Card(1, 1)],
    [new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(7, 1)],
  )).toBe(true)

  // full houses
  expect(big2Engine.validateMove(
    [new Card(10, 1), new Card(10, 2), new Card(10, 3), new Card(9, 1), new Card(9, 2)],
    [new Card(11, 1), new Card(11, 2), new Card(11, 3), new Card(5, 1), new Card(5, 2)],
  )).toBe(true)

  // four of a kind
  expect(big2Engine.validateMove(
    [new Card(10, 1), new Card(10, 2), new Card(10, 3), new Card(10, 4), new Card(9, 2)],
    [new Card(11, 1), new Card(11, 2), new Card(11, 3), new Card(11, 4), new Card(5, 2)],
  )).toBe(true)

  // royal flush
  expect(big2Engine.validateMove(
    [new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1)],
    [new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(6, 2), new Card(7, 2)],
  )).toBe(true)
  expect(big2Engine.validateMove(
    [new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1)],
    [new Card(8, 1), new Card(9, 1), new Card(10, 1), new Card(11, 1), new Card(12, 1)],
  )).toBe(true)
})

test('identify invalid moves', () => {
  // singles
  expect(big2Engine.validateMove([new Card(1, 1)], [new Card(13, 1)])).toBe(false)

  // pairs
  expect(big2Engine.validateMove([new Card(1, 1), new Card(1, 2)], [new Card(13, 1), new Card(13, 2)])).toBe(false)

  // triplets
  expect(big2Engine.validateMove(
    [new Card(1, 1), new Card(1, 2), new Card(1, 3)],
    [new Card(13, 1), new Card(13, 2), new Card(13, 3)],
  )).toBe(false)

  // straights
  expect(big2Engine.validateMove(
    [new Card(2, 1), new Card(3, 1), new Card(4, 2), new Card(5, 3), new Card(6, 3)],
    [new Card(3, 1), new Card(4, 2), new Card(5, 3), new Card(6, 3), new Card(7, 3)],
  )).toBe(false)
  expect(big2Engine.validateMove(
    [new Card(2, 2), new Card(3, 1), new Card(4, 2), new Card(5, 3), new Card(6, 3)],
    [new Card(2, 1), new Card(3, 2), new Card(4, 3), new Card(5, 4), new Card(6, 4)],
  )).toBe(false)
  expect(big2Engine.validateMove(
    [new Card(11, 2), new Card(12, 1), new Card(13, 2), new Card(1, 3), new Card(2, 3)],
    [new Card(10, 1), new Card(11, 2), new Card(12, 3), new Card(13, 4), new Card(1, 4)],
  )).toBe(false)

  // flushes
  expect(big2Engine.validateMove(
    [new Card(8, 2), new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(7, 2)],
    [new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(9, 1)],
  )).toBe(false)
  expect(big2Engine.validateMove(
    [new Card(2, 1), new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(7, 1)],
    [new Card(10, 1), new Card(11, 1), new Card(12, 1), new Card(13, 1), new Card(1, 1)],
  )).toBe(false)

  // full houses
  expect(big2Engine.validateMove(
    [new Card(11, 1), new Card(11, 2), new Card(11, 3), new Card(5, 1), new Card(5, 2)],
    [new Card(10, 1), new Card(10, 2), new Card(10, 3), new Card(9, 1), new Card(9, 2)],
  )).toBe(false)

  // four of a kind
  expect(big2Engine.validateMove(
    [new Card(11, 1), new Card(11, 2), new Card(11, 3), new Card(11, 4), new Card(5, 2)],
    [new Card(10, 1), new Card(10, 2), new Card(10, 3), new Card(10, 4), new Card(9, 2)],
  )).toBe(false)

  // royal flush
  expect(big2Engine.validateMove(
    [new Card(3, 2), new Card(4, 2), new Card(5, 2), new Card(6, 2), new Card(7, 2)],
    [new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1)],
  )).toBe(false)
  expect(big2Engine.validateMove(
    [new Card(8, 1), new Card(9, 1), new Card(10, 1), new Card(11, 1), new Card(12, 1)],
    [new Card(3, 1), new Card(4, 1), new Card(5, 1), new Card(6, 1), new Card(7, 1)],
  )).toBe(false)
})
