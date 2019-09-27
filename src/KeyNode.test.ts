import {expect} from 'chai';
import PathNotation from 'path-notation';
import KeyNode from './KeyNode';
import KeyNodeError from './KeyNodeError';

describe(`KeyNode`,()=>{

  let fooKey:KeyNode;
  let fooBarKey:KeyNode;
  let fooBazKey:KeyNode;
  let fooBarQuxKey:KeyNode;

  beforeEach(()=>{
    
    fooKey = new KeyNode('foo');
    fooBarKey = fooKey.addChild('bar');
    fooBazKey = fooKey.addChild('baz');
    fooBarQuxKey = fooBarKey.addChild('qux');

  });

  describe('Instantiation',()=>{

    it(`Creates a deep copy of any KeyNode passed as first constructor arg.`,
      ()=>
    {

      const fooCopy = new KeyNode(fooKey);

      expect(fooCopy.key).to.equal('foo');
      
      expect(fooCopy.hasChild('bar')).to.be.true;
      expect(fooCopy.hasChild('baz')).to.be.true;
      
      const fooBarCopy = fooCopy.getChild('bar');
      
      expect(fooBarCopy).to.not.equal(fooBarKey);
      expect(fooBarCopy.key).to.equal(fooBarKey.key);
      
      expect(fooCopy.getChild('baz')).to.not.equal(fooBazKey);
      expect(fooCopy.getChild('baz').key).to.equal(fooBazKey.key);

      expect(fooBarCopy.hasChild('qux')).to.be.true;

      expect(fooBarCopy.getChild('qux')).to.not.equal(fooBarQuxKey);
      expect(fooBarCopy.getChild('qux').key).to.equal(fooBarQuxKey.key);

    });

    it(`Throws KeyNodeError if sibling key literal already exists.`,()=>{
      
      const throws = ()=> fooKey.addChild('bar');

      expect(throws).to.throw(KeyNodeError);
      expect(throws).to.throw(`Sibling key literals must be unique.`);

    });

    it(`Throws KeyNodeError if sibling root key literal already exists.`,()=>{

      const throws = ()=> fooKey.addSibling('foo');

      expect(throws).to.throw(KeyNodeError);
      expect(throws).to.throw(`Sibling key literals must be unique.`);

    });

  });

  describe('Accessors',()=>{

    describe('parent',()=>{

      it('Gets the parent KeyNode.',()=>{
        
        expect(fooBazKey).property('parent').to.equal(fooKey);
      
      });

    });
    
    describe('key',()=>{

      it('Gets the key literal.',()=>{

        expect(fooBarKey).property('key').equal('bar');

      });

    });
    
    describe('keyType',()=>{

      it('Is "key" when the key is a string.',()=>{

        expect(fooBarQuxKey).property('keyType').to.equal('key');

      });
      
      it('Is "index" when the key is a number.',()=>{

        const indexKey = fooBarQuxKey.addChild(0);

        expect(indexKey).property('keyType').to.equal('index');

      });

      it(`Overrides "index" types when a single sibling is of 
          type "key"`, ()=>
      {

        const indexKey = fooBarQuxKey.addChild(0);
        expect(indexKey).property('keyType').to.equal('index');
        
        fooBarQuxKey.addChild('keyTypeIsKey');
        expect(indexKey).property('keyType').to.equal('key');

      });

    });

    describe('rootKey',()=>{

      it(`Returns the root KeyNode of from the KeyNode's path.`,()=>{

        expect(fooBazKey).property('rootKey').to.equal(fooKey);
        expect(fooBarQuxKey).property('rootKey').to.equal(fooKey);

      });

      it(`Returns self if KeyNode is root key.`,()=>{

        expect(fooKey).property('isRootKey').to.be.true;
        expect(fooKey).property('rootKey').to.equal(fooKey);

      });

    });

    describe(`isTerminalKey`,()=>{

      it(`Returns true when key does not have children and false when it has
          children.`,()=>
      {

        expect(fooKey).property('isTerminalKey').to.be.false;
        expect(fooBarKey).property('isTerminalKey').to.be.false;
        expect(fooBazKey).property('isTerminalKey').to.be.true;
        expect(fooBarQuxKey).property('isTerminalKey').to.be.true;


      });

    });

    describe(`numChildren`,()=>{

      it(`Returns number of children keys.`,()=>{

        expect(fooKey).property('numChildren').to.equal(2);
        expect(fooBazKey).property('numChildren').to.equal(0);
        expect(fooBarKey).property('numChildren').to.equal(1);
        expect(fooBarQuxKey).property('numChildren').to.equal(0);

      });

    });

    describe(`depth`,()=>{

      it(`Returns node depth of key.`,()=>{

        expect(fooKey).property('depth').to.equal(0);
        expect(fooBazKey).property('depth').to.equal(1);
        expect(fooBarKey).property('depth').to.equal(1);
        expect(fooBarQuxKey).property('depth').to.equal(2);

      });

    });

    describe(`path`,()=>{
      
      it(`Returns PathNotation instance of path from root to terminal key.`,
        ()=>
      {
        
        const expectedPath = 'foo.bar.qux';
        const path = fooBarQuxKey.path;
        
        expect(path).to.be.instanceOf(PathNotation);
        expect(path.toString()).to.equal(expectedPath);

      });

    });

  });

  describe('Methods',()=>{

    describe('hasChild',()=>{

      it(`Returns true if KeyNode has child key.`,()=>{

        expect(fooKey.hasChild('baz')).to.be.true;
        expect(fooKey.hasChild('bar')).to.be.true;
        expect(fooBarQuxKey.hasChild('baz')).to.be.false;

      });

    });

    describe('getChild',()=>{

      it(`Returns child KeyNode.`,()=>{

        expect(fooKey.getChild('bar')).to.equal(fooBarKey);

      });

      it(`Returns null if child KeyNode DNE.`,()=>{

        expect(fooKey.getChild('DNE')).to.be.null;

      });

    });

    describe('addChild',()=>{

      it('Adds child key to KeyNode.',()=>{

        fooBazKey.addChild('childKey');
        expect(fooBazKey.hasChild('childKey')).to.be.true;

      });

      it('Returns child KeyNode instance.',()=>{

        const childKey = fooBazKey.addChild('childKey');
        expect(childKey.parent).to.equal(fooBazKey);

      });

      it(`Creates a deep copy of any KeyNode passed.`,
        ()=>
      {

        const fooCopy = fooBazKey.addChild(fooKey);

        expect(fooCopy.key).to.equal('foo');
        
        expect(fooCopy.hasChild('bar')).to.be.true;
        expect(fooCopy.hasChild('baz')).to.be.true;
        
        const fooBarCopy = fooCopy.getChild('bar');
        
        expect(fooBarCopy).to.not.equal(fooBarKey);
        expect(fooBarCopy.key).to.equal(fooBarKey.key);
        
        expect(fooCopy.getChild('baz')).to.not.equal(fooBazKey);
        expect(fooCopy.getChild('baz').key).to.equal(fooBazKey.key);

        expect(fooBarCopy.hasChild('qux')).to.be.true;

        expect(fooBarCopy.getChild('qux')).to.not.equal(fooBarQuxKey);
        expect(fooBarCopy.getChild('qux').key).to.equal(fooBarQuxKey.key);

      });

    });

    describe('removeChild',()=>{

      it('Removes child key node.',() =>{

        expect(fooKey.hasChild('bar')).to.be.true;
        fooKey.removeChild('bar');
        expect(fooKey.hasChild('bar')).to.be.false;

      });

      it(`Returns true when removal is successful.`,() =>{

        expect(fooKey.removeChild('bar')).to.be.true;

      });
      
      it(`Returns false when removal is unsuccessful.`,() =>{

        expect(fooKey.removeChild('DNE')).to.be.false;

      });

    });

    describe('hasSibling',()=>{

      it(`Returns true if KeyNode has sibling key.`,()=>{

        expect(fooBazKey.hasSibling('bar')).to.be.true;
        expect(fooBarQuxKey.hasSibling('quux')).to.be.false;

      });

    });

    describe('getSibling',()=>{

      it(`Returns sibling KeyNode.`,()=>{

        expect(fooBazKey.getSibling('bar')).to.equal(fooBarKey);

      });

      it(`Returns null if sibling KeyNode DNE.`,()=>{

        expect(fooKey.getSibling('DNE')).to.be.null;

      });

    });

    describe('addSibling',()=>{

      it('Adds sibling key to KeyNode.',()=>{

        fooBazKey.addSibling('siblingKey');
        expect(fooBazKey.hasSibling('siblingKey')).to.be.true;

      });

      it('Returns sibling KeyNode instance.',()=>{

        const siblingKey = fooBazKey.addSibling('siblingKey');
        expect(siblingKey.getSibling('baz')).to.equal(fooBazKey);

      });

      it(`Creates a deep copy of any KeyNode passed.`,
        ()=>
      {

        const fooCopy = fooBazKey.addSibling(fooKey);

        expect(fooCopy.key).to.equal('foo');
        
        expect(fooCopy.hasChild('bar')).to.be.true;
        expect(fooCopy.hasChild('baz')).to.be.true;
        
        const fooBarCopy = fooCopy.getChild('bar');
        
        expect(fooBarCopy).to.not.equal(fooBarKey);
        expect(fooBarCopy.key).to.equal(fooBarKey.key);
        
        expect(fooCopy.getChild('baz')).to.not.equal(fooBazKey);
        expect(fooCopy.getChild('baz').key).to.equal(fooBazKey.key);

        expect(fooBarCopy.hasChild('qux')).to.be.true;

        expect(fooBarCopy.getChild('qux')).to.not.equal(fooBarQuxKey);
        expect(fooBarCopy.getChild('qux').key).to.equal(fooBarQuxKey.key);

      });

    });

    describe('removeSibling',()=>{

      it('Removes sibling key node.',() =>{

        expect(fooBarKey.hasSibling('baz')).to.be.true;
        fooBarKey.removeSibling('baz');
        expect(fooBarKey.hasSibling('baz')).to.be.false;

      });

      it('Removes sibling root key node.',() =>{

        fooKey.addSibling('fooSibling');

        expect(fooKey.hasSibling('fooSibling')).to.be.true;
        fooKey.removeSibling('fooSibling');
        expect(fooKey.hasSibling('fooSibling')).to.be.false;

      });

      it(`Returns true when removal is successful.`,() =>{

        expect(fooBarKey.removeSibling('baz')).to.be.true;

      });
      
      it(`Returns false when removal is unsuccessful.`,() =>{

        expect(fooBarKey.removeSibling('DNE')).to.be.false;

      });

      it(`Will NOT remove itself.`, ()=>{

        expect(fooKey.removeSibling('foo')).to.be.false;
        expect(fooBarKey.removeSibling('bar')).to.be.false;

      });

    });

    describe('children',()=>{

      it(`Returns IterableIterator<Key> of direct children keys.`,()=>{

        expect(Array.from(fooKey.children())).deep.equal([fooBarKey, fooBazKey]);
        expect(Array.from(fooBarKey.children())).deep.equal([fooBarQuxKey]);

      });

    });

    describe(`parents`,()=>{

      it(`Returns IterableIterator<Key> of parent keys to root key.`,()=>{

        expect(Array.from(fooBarQuxKey.parents())).deep.equal([fooBarKey, fooKey]);

      });

    });

    describe('siblings',()=>{

      it(`Returns IterableIterator<Key> of sibling keys.`,()=>{

        expect(Array.from(fooBarKey.siblings())).deep.equal([fooBazKey]);
        expect(Array.from(fooKey.siblings())).have.lengthOf(0);

      });

      it(`Returns IterableIterator<Key> of siblings keys of root keys.`,()=>{

        expect([...fooBarKey.siblings()]).have.ordered.members([fooBazKey]);

      });

    });

    describe(`pathToKey`,()=>{

      it(`Returns IterableIterator<Key> of keys from the root to and including
          the current Key.`,
        ()=>{

          expect(Array.from(fooBarQuxKey.pathToKey())).to.deep.equal([
            fooKey,
            fooBarKey,
            fooBarQuxKey
          ]);

      });

      it(`Optionally does not included current Key if false is passed.`,()=>{

        expect(Array.from(fooBarQuxKey.pathToKey(false))).to.deep.equal([
          fooKey,
          fooBarKey
        ]);

      });

      it(`Root Key(s) yield self or nothing if false is passed.`,()=>{

        expect(Array.from(fooKey.pathToKey())).to.deep.equal([fooKey]);
        expect(Array.from(fooKey.pathToKey(false))).to.have.lengthOf(0);

      });

    });

    describe('toString',()=>{

      it('Returns key as string.',()=>{

        expect(fooBazKey.toString()).to.equal('baz');

      });

      it(`Converts 'index' key to string.`,()=>{

        const indexKey = fooBazKey.addChild(10);

        expect(indexKey.key).to.equal(10);
        expect(indexKey.toString()).to.equal('10');

      });

    });

    describe('valueOf',()=>{

      it('Returns key primitive.',()=>{

        expect(fooBazKey.valueOf()).to.equal('baz');

        const indexKey = fooBazKey.addChild(10);
        expect(indexKey.valueOf()).to.equal(10);

      });

      it(`Converts 'index' key overridden by a sibling of type 'key' to string.`
        ,()=>
      {

        const indexKey = fooBazKey.addChild(10);

        expect(indexKey.valueOf()).to.equal(10);
        
        indexKey.addSibling('keyType');
        
        expect(indexKey.valueOf()).to.equal('10');
        
        indexKey.removeSibling('keyType');
        
        expect(indexKey.valueOf()).to.equal(10);
      
      });

    });

  });

});