export class ReviewQueue {
  constructor(tasks = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;
    for (const task of tasks) this.append(task);
  }

  peek() {
    return this.head?.task ?? null;
  }

  append(task) {
    const node = { task, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.length += 1;
  }

  take() {
    if (!this.head) return null;
    const task = this.head.task;
    this.head = this.head.next;
    this.length -= 1;
    if (!this.head) this.tail = null;
    return task;
  }

  retryAfterTwo(task) {
    if (this.length < 2) {
      this.append(task);
      return;
    }

    // Two links, regardless of the total number of remaining questions.
    const second = this.head.next;
    const node = { task, next: second.next };
    second.next = node;
    if (this.tail === second) this.tail = node;
    this.length += 1;
  }

  toArray() {
    const tasks = [];
    for (let node = this.head; node; node = node.next) tasks.push(node.task);
    return tasks;
  }
}
