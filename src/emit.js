export default class Emit {
  constructor() {
    var delegate = document.createDocumentFragment();
    [
      'addEventListener',
      'dispatchEvent',
      'removeEventListener'
    ].forEach((f) => {
      this[f] = (...xs) => {
        delegate[f](...xs);
      };
    });
  }
}
