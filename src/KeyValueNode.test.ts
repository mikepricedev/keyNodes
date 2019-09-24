import {expect} from 'chai';
import KeyNode from './KeyNode';
import KeyValueNode, {
  KeyValueNodeHistoricalResultValue,
  KeyValueNodeHistoricalIterableIterator
} from './KeyValueNode';

describe('KeyValueNode', ()=>{

  let fooKey = new KeyValueNode('foo');
  let fooBarKey = fooKey.addChild('bar');
  let fooBazKeyVal = Symbol();
  let fooBazKey = fooKey.addChild('baz', fooBazKeyVal);
  let fooBarQuxKeyVal = Symbol();
  let fooBarQuxKey = fooBarKey.addChild('qux', fooBarQuxKeyVal);

  beforeEach(()=>{
    
    fooKey = new KeyValueNode('foo');
    fooBarKey = fooKey.addChild('bar');
    fooBazKeyVal = Symbol();
    fooBazKey = fooKey.addChild('baz', fooBazKeyVal);
    fooBarQuxKeyVal = Symbol();
    fooBarQuxKey = fooBarKey.addChild('qux', fooBarQuxKeyVal);

  });


  describe('Static Accessors', ()=>{

    describe('keepHistory',()=>{

      it(`Gets default history configuration for all KeyValueNode instances.`,
        ()=>
      {

        expect(KeyValueNode).property('keepHistory').to.be.false;

      });

      it(`Sets default history configuration for all KeyValueNode instances.`,
        ()=>
      {

        KeyValueNode.keepHistory = true;
        expect(KeyValueNode).property('keepHistory').to.be.true;
        
        KeyValueNode.keepHistory = 2;
        expect(KeyValueNode).property('keepHistory').to.equal(2);

      });

      it(`Converts 0 to false.`, ()=>{

        KeyValueNode.keepHistory = 0;
        expect(KeyValueNode).property('keepHistory').to.be.false;

      });

    });

  });

  describe('Instantiation', ()=>{

    it(`Extends 'KeyNode'.`,()=>{

      expect(fooKey).to.be.instanceof(KeyNode);

    });

    it(`Creates a deep copy of any KeyNodeValue passed as first
        constructor arg.`,
      ()=>
    {

      const fooCopy = new KeyValueNode(fooKey);

      expect(fooCopy.key).to.equal('foo');
      
      expect(fooCopy.hasChild('bar')).to.be.true;
      expect(fooCopy.hasChild('baz')).to.be.true;
      
      const fooBarCopy = fooCopy.getChild('bar');
      
      expect(fooBarCopy).to.not.equal(fooBarKey);
      expect(fooBarCopy.key).to.equal(fooBarKey.key);
      expect(fooBarCopy.value).to.equal(fooBarKey.value);
      
      expect(fooCopy.getChild('baz')).to.not.equal(fooBazKey);
      expect(fooCopy.getChild('baz').key).to.equal(fooBazKey.key);
      expect(fooCopy.getChild('baz').value).to.equal(fooBazKey.value);

      expect(fooBarCopy.hasChild('qux')).to.be.true;

      expect(fooBarCopy.getChild('qux')).to.not.equal(fooBarQuxKey);
      expect(fooBarCopy.getChild('qux').key).to.equal(fooBarQuxKey.key);
      expect(fooBarCopy.getChild('qux').value).to.equal(fooBarQuxKey.value);

    });

  });

  describe('Accessors',()=>{

    describe('value',()=>{

      it(`Gets the value of the KeyValueNode instance.`,()=>{

        expect(fooBazKey).property('value').equal(fooBazKeyVal);

      });
      
      it('Sets the value of the KeyValueNode instance.',()=>{

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);

      });

      it(`Gets the current value of the KeyValueNode instance when historical
          values are tracked.`,()=>
      {
        
        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);

      });

      it(`Gets the current value of the KeyValueNode instance when changes
          are undone.`,()=>
      {
        
        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);
        
        fooBazKey.undo();

        expect(fooBazKey).property('value').equal(fooBazKeyVal);

      });

      it(`Gets the current value of the KeyValueNode instance when undone
          changes are redone.`,()=>
      {
        
        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);
        
        fooBazKey.undo();

        expect(fooBazKey).property('value').equal(fooBazKeyVal);

        fooBazKey.redo();

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);

      });

      it(`Overwrites redo changes when set after any number of undo calls.`,
        ()=>
      {

        fooBazKey.keepHistory = true;

        fooBazKey.value = Symbol();        
        fooBazKey.undo();

        const overwriteFooBazKeyVal = Symbol();

        fooBazKey.value = overwriteFooBazKeyVal;

        expect(fooBazKey).property('value').equal(overwriteFooBazKeyVal);

        expect(fooBazKey.redo()).to.be.false;

      });

    });

    describe('keepHistory',()=>{

      it(`Gets history configuration for KeyValueNode instance.`,
        ()=>
      {

        expect(fooBarKey).property('keepHistory').to.be.false;

      });

      it(`Defaults to static keepHistory value.`, ()=>{

        KeyValueNode.keepHistory = 10;

        const keyValNode = new KeyValueNode('foo');

        expect(keyValNode).property('keepHistory').to.equal(10);

      });

      it(`Sets history configuration for KeyValueNode instance.`,
        ()=>
      {

        fooBarKey.keepHistory = true;
        expect(fooBarKey).property('keepHistory').to.be.true;
        
        fooBarKey.keepHistory = 2;
        expect(fooBarKey).property('keepHistory').to.equal(2);

      });

      it(`Converts 0 to false.`, ()=>{

        fooBarKey.keepHistory = 0;
        expect(fooBarKey).property('keepHistory').to.be.false;

      });

      it(`Restricts the number of historical values to cahce.`, ()=>{

        fooBarQuxKey.keepHistory = 3;

        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        
        let i = 0;
        while(fooBarQuxKey.undo()) {
          i++;
        }

        expect(i).to.equal(3);

      });

      it(`Dynamically resizes history cache when number of historical values
          exceeds set limit.`, () =>
      {

        fooBarQuxKey.keepHistory = true;

        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        const targetValue = fooBarQuxKey.value;
        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        
        //Undo and confirm values when back to ini value
        let i = 0;
        while(fooBarQuxKey.undo()) {
          i++;
        }
        expect(i).to.equal(5);

        //Redo all
        while(fooBarQuxKey.redo());

        //Update history
        fooBarQuxKey.keepHistory = 3;

        //Undo all and confirm that previous historical values were lost
        while(fooBarQuxKey.undo());
        expect(fooBarQuxKey).property('value').to.equal(targetValue);

      });

      it(`Resizes history cache first from undo values then from redo.`, () =>
      {

        fooBarQuxKey.keepHistory = true;

        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        const undoTargetValue = fooBarQuxKey.value;
        fooBarQuxKey.value = Symbol();
        fooBarQuxKey.value = Symbol();
        const redoTarget = fooBarQuxKey.value;
        fooBarQuxKey.value = Symbol();
        
        //Undo to target value
        while(fooBarQuxKey.value !== undoTargetValue) {
          fooBarQuxKey.undo();
        };
        
        //Update history
        fooBarQuxKey.keepHistory = 2;

        //Confirm cannot go back;
        expect(fooBarQuxKey.undo()).to.be.false;

        //redo all
        while(fooBarQuxKey.redo());

        //Confirm did not redo to last set value
        expect(fooBarQuxKey).property('value').to.equal(redoTarget);


      });

    });

  });

  describe('Methods',()=>{

    describe('addChild',()=>{

      it('Adds child key to KeyNode.',()=>{

        fooBazKey.addChild('childKey');
        expect(fooBazKey.hasChild('childKey')).to.be.true;

      });
      
      it('Returns child KeyNode instance.',()=>{

        const childKey = fooBazKey.addChild('childKey');
        expect(childKey.parent).to.equal(fooBazKey);

      });

      it(`Creates a deep copy of any KeyValueNode passed.`,()=>{

        const fooCopy = fooBazKey.addChild(fooKey);

        expect(fooCopy.key).to.equal('foo');
      
        expect(fooCopy.hasChild('bar')).to.be.true;
        expect(fooCopy.hasChild('baz')).to.be.true;
        
        const fooBarCopy = fooCopy.getChild('bar');
        
        expect(fooBarCopy).to.not.equal(fooBarKey);
        expect(fooBarCopy.key).to.equal(fooBarKey.key);
        expect(fooBarCopy.value).to.equal(fooBarKey.value);
        
        expect(fooCopy.getChild('baz')).to.not.equal(fooBazKey);
        expect(fooCopy.getChild('baz').key).to.equal(fooBazKey.key);
        expect(fooCopy.getChild('baz').value).to.equal(fooBazKey.value);

        expect(fooBarCopy.hasChild('qux')).to.be.true;

        expect(fooBarCopy.getChild('qux')).to.not.equal(fooBarQuxKey);
        expect(fooBarCopy.getChild('qux').key).to.equal(fooBarQuxKey.key);
        expect(fooBarCopy.getChild('qux').value).to.equal(fooBarQuxKey.value);

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

    describe('undo',()=>{

      it('Moves current value back one historical value.', ()=>{

        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);
        
        fooBazKey.undo();

        expect(fooBazKey).property('value').equal(fooBazKeyVal);

      });

      it(`Returns true when undo is successful.`, ()=>{

        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;
        
        expect(fooBazKey.undo()).to.be.true;

      });

      it(`Returns false when undo is unsuccessful.`, ()=>{
        
        expect(fooBazKey.undo()).to.be.false;

      });

    });
    
    describe('redo',()=>{

      it('Moves current value forward one historical value from undone change.',
        ()=>
      {

        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);
        
        fooBazKey.undo();

        expect(fooBazKey).property('value').equal(fooBazKeyVal);

        fooBazKey.redo();

        expect(fooBazKey).property('value').equal(newFooBazKeyVal);

      });

      it(`Returns true when redo is successful.`, ()=>{

        fooBazKey.keepHistory = true;

        const newFooBazKeyVal = Symbol();

        fooBazKey.value = newFooBazKeyVal;
        
        fooBazKey.undo();
        
        expect(fooBazKey.redo()).to.be.true;

      });

      it(`Returns false when redo is unsuccessful.`, ()=>{
        
        expect(fooBazKey.redo()).to.be.false;

      });

    });

    describe('history', ()=>{

      it('Returns KeyValueNodeHistoricalIterableIterator', ()=>{

        const iter = fooBazKey.history();
        expect(iter).to.be.instanceOf(KeyValueNodeHistoricalIterableIterator);

      });

      it(`Iterates KeyValueNodeHistoricalResultValues.`, ()=>{


        fooBazKey.keepHistory = true;
        fooBazKey.value = Symbol();

        let i = 0;
        for(const histObj of fooBazKey.history()) {

          expect(histObj).to.instanceOf(KeyValueNodeHistoricalResultValue);
          i++;
        
        }

        expect(i).to.equal(1);

      });

      it('Iterates back historical values by default.', ()=>{

        fooBazKey.keepHistory = true;

        const histVal1 = Symbol();
        fooBazKey.value = histVal1;
        const histVal2 = Symbol();
        fooBazKey.value = histVal2;

        fooBazKey.value = Symbol(); //Set cur value

        const histVals = [histVal2, histVal1, fooBazKeyVal];
        let i = 0;
        for(const histObj of fooBazKey.history()) {

          expect(histVals[i++]).to.equal(histObj.value);

        }

        expect(i).to.equal(3);

      });

      it(`Iterates forward historical values when 'redo' is passed.`, ()=>{

        fooBazKey.keepHistory = true;

        const histVal1 = Symbol();
        fooBazKey.value = histVal1;
        const histVal2 = Symbol();
        fooBazKey.value = histVal2;

        fooBazKey.undo();
        fooBazKey.undo();

        const histVals = [histVal1, histVal2];
        let i = 0;
        for(const histObj of fooBazKey.history('redo')) {

          expect(histVals[i++]).to.equal(histObj.value);

        }

        expect(i).to.equal(2);
        
      });

      it(`Allows undoing of historical values by calling the 'set' method
          on the KeyValueNodeHistoricalResultValues object; 'set' methods
          returns true when undo is successful.`, ()=>
      {

        fooBazKey.keepHistory = true;

        const histVal1 = Symbol();
        fooBazKey.value = histVal1;
        const histVal2 = Symbol();
        fooBazKey.value = histVal2;

        fooBazKey.value = Symbol(); //Set cur value

        const histVals = [histVal2, histVal1, fooBazKeyVal];
        let i = 0;
        for(const histObj of fooBazKey.history()) {

          if(i++ === 1){
            expect(histObj.set()).to.be.true;
          }

        }

        expect(fooBazKey).property('value').to.equal(histVal1);

      });

      it(`Allows redoing of historical values by calling the 'set' method
          on the KeyValueNodeHistoricalResultValues object; 'set' methods
          returns true when redo is successful.`, ()=>
      {

        fooBazKey.keepHistory = true;

        const histVal1 = Symbol();
        fooBazKey.value = histVal1;
        const histVal2 = Symbol();
        fooBazKey.value = histVal2;

        fooBazKey.undo();
        fooBazKey.undo();

        expect(fooBazKey).property('value').to.equal(fooBazKeyVal);

        let i = 0;
        for(const histObj of fooBazKey.history('redo')) {

          if(i++ === 1){
            expect(histObj.set()).to.be.true;
          }

        }

        expect(fooBazKey).property('value').to.equal(histVal2);

      });

      it(`Invalidates KeyValueNodeHistoricalIterableIterator by setting done
          flag to true when KeyNodeValue.value is set.`, ()=>
      {

        fooBazKey.keepHistory = true;

        const histVal1 = Symbol();
        fooBazKey.value = histVal1;
        const histVal2 = Symbol();
        fooBazKey.value = histVal2;

        fooBazKey.value = Symbol(); //Set cur value

        const iter = fooBazKey.history();

        fooBazKey.value = Symbol(); //Set value after history call

        expect(iter.next()).property('done').to.be.true;

      });

      it(`Invalidates KeyValueNodeHistoricalResultValues set when
          KeyNodeValue.value is set, calling KeyValueNodeHistoricalResultValues
          'set' method returns false when invalid.`, ()=>
      {

        fooBazKey.keepHistory = true;

        const histVal1 = Symbol();
        fooBazKey.value = histVal1;
        const histVal2 = Symbol();
        fooBazKey.value = histVal2;

        fooBazKey.value = Symbol(); //Set cur value

        const iter = fooBazKey.history();

        const result = iter.next();

        fooBazKey.value = Symbol(); //Set cur value

        expect(result.value.set()).to.be.false;

      });

    });

  });

});