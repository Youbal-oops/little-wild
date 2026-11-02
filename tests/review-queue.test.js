import test from 'node:test';
import assert from 'node:assert/strict';
import { ReviewQueue } from '../web/review-queue.js';

test('retry insertion keeps two intervening tasks and maintains the tail', () => {
  const queue = new ReviewQueue(['A', 'B']);
  queue.retryAfterTwo('retry');
  queue.append('last');
  assert.deepEqual(queue.toArray(), ['A', 'B', 'retry', 'last']);
  assert.equal(queue.length, 4);
});

test('short queues retry at the end and can be reused after emptying', () => {
  const queue = new ReviewQueue(['A']);
  queue.retryAfterTwo('retry');
  assert.equal(queue.take(), 'A');
  assert.equal(queue.take(), 'retry');
  assert.equal(queue.take(), null);
  assert.equal(queue.peek(), null);
  queue.retryAfterTwo('again');
  assert.equal(queue.take(), 'again');
  assert.equal(queue.length, 0);
});
