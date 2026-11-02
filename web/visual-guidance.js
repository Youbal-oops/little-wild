export class VisualGuidance {
  constructor(handMarkup) {
    this.handMarkup = handMarkup;
    this.target = null;
    this.hand = null;
    this.choiceRow = null;
    this.modelScene = null;
  }

  clearPointer() {
    this.target?.classList.remove('guided');
    this.choiceRow?.classList.remove('choose-now');
    this.hand?.remove();
    this.target = this.hand = this.choiceRow = null;
  }

  createHand(className) {
    const hand = document.createElement('span');
    hand.className = className;
    hand.setAttribute('aria-hidden', 'true');
    hand.innerHTML = this.handMarkup;
    this.hand = hand;
    return hand;
  }

  pointTo(element) {
    this.clearPointer();
    if (!element) return;
    this.target = element;
    element.classList.add('guided');
    element.appendChild(this.createHand('tap-cue'));
  }

  pointToChoices(row) {
    this.clearPointer();
    if (!row) return;
    this.choiceRow = row;
    row.classList.add('choose-now');
    row.appendChild(this.createHand('tap-cue choice-hand'));
  }

  model(scene) {
    this.stopModel();
    this.modelScene = scene;
    scene?.classList.add('modelling');
  }

  stopModel() {
    this.modelScene?.classList.remove('modelling');
    this.modelScene = null;
  }

  clear() {
    this.clearPointer();
    this.stopModel();
  }
}
