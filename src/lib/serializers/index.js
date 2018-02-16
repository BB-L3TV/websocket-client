import Json from './json'; 
import Default from './default';

const modes = {
  'default': Default,
  'json': Json
}

export default class Serializers {
  constructor(mode = 'default') {
    this.mode = mode && mode.toLowerCase();

    if( this.mode !== 'default' && !modes[this.mode] ) {
      console.warn('wsc::Serialization Mode not found, not serializing message');
    }

    this.Serializer = new modes[this.mode]();
    this.serialize = this.Serializer.serialize;
    this.deserialize = this.Serializer.deserialize;
  }
}

