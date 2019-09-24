import KeyNode from './KeyNode';

export default class KeyNodeError<TKeyNode extends KeyNode = KeyNode> extends Error {

  constructor(msg:string, readonly KEY_NODE:TKeyNode){

    super(msg);

  }

  get [Symbol.toStringTag]() {
  
    return this.constructor.name;
  
  }

}