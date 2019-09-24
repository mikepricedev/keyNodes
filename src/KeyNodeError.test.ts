import {expect} from 'chai';
import KeyNodeError from './KeyNodeError';
import KeyNode from './KeyNode';

describe(`KeyNodeError`,()=>{
  
  let keyNode:KeyNode;
  let msg:string;
  let keyNodeError:KeyNodeError<KeyNode>;

  beforeEach(()=>{

    keyNode = new KeyNode('foo');
    msg = `${Math.random()}`;
    keyNodeError = new KeyNodeError(msg, keyNode);

  });

  describe(`Instantiation`,()=>{

    it(`Inherits from Error`,()=>{

      expect(keyNodeError).to.be.instanceof(Error);

    });

  });

  describe('Properties',()=>{

    describe('KEY_NODE',()=>{

      it(`Is instance of KeyNode that is associated with error.`,()=>{

        expect(keyNodeError).property('KEY_NODE').to.equal(keyNode);
        expect(keyNodeError).property('KEY_NODE').to.be.instanceof(KeyNode);

      });

    });

  });

});