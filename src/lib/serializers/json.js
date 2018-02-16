
export default class JsonSerializer {
  constructor() {}

  serialize(obj) {
    try {
      return JSON.stringify(obj);
    }
    catch(ex) {
      console.error(`Could not serialize obj in ${this.name}`, ex);
    }
  }

  deserialize(str) {
    try {
      return JSON.parse(str);
    }
    catch(ex) {
      console.error(`Could not deserialize obj in ${this.name}`, ex);
    }

  }
}
