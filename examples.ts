import {KeyNode, KeyValueNode} from './src/index';

{
  
  // Start with root key node.
  const foo = new KeyNode('foo');
  
  console.log(foo.key); // "foo"
  
  // Add sibling root key node
  const bar = foo.addSibling('bar');
  
  console.log(foo.hasSibling('bar')); // true
  console.log(bar.hasSibling('foo')); // true
  
  // Add child key node
  const baz = foo.addChild('baz');
  
  console.log(foo.hasChild('baz')); // true
  
  // Add child to baz key node
  const qux = baz.addChild('qux');
  
  console.log(baz.hasChild('qux')); // true
  
  // Add indexes
  const arr0 = qux.addChild(0);
  const arr1 = qux.addChild(1);
  
  console.log(arr1.keyType); // "index"
  console.log(qux.keyType); // "key"

}

{
  
  // Start with root key/value node.
  const foo = new KeyValueNode('foo');
  
  console.log(foo.key); // "foo"
  
  // Add sibling root key/value node with value.
  const bar = foo.addSibling('bar', 11);
  
  console.log(foo.hasSibling('bar')); // true
  console.log(bar.hasSibling('foo')); // true
  
  console.log(bar.value); // 11
  
  // Track value history up to 2 changes
  bar.keepHistory = 2;
  
  // Change bar value
  bar.value = 13;
  
  console.log(bar.value); // 13
  
  // Undo value change
  bar.undo();
  
  console.log(bar.value); // 11
  
  // Redo value change
  bar.redo();
  
  console.log(bar.value); // 13
  
  // Stop tracking history
  bar.keepHistory = false;
  bar.value = 17;
  
  console.log(bar.value); // 17
  console.log( bar.undo() ); // false
  console.log(bar.value); // 17
  
  // Add child key/value node
  const baz = foo.addChild('baz');
  
  console.log(foo.hasChild('baz')); // true
  
  // Add indexes with values
  const arr0 = baz.addChild(0, 'Value at index 0');
  const arr1 = baz.addChild(1, 'Value at index 1');
  
  
  console.log(arr0.value); // "Value at index 0"
  console.log(arr1.value); // "Value at index 1"
  
  console.log(arr1.keyType); // "index"
  console.log(baz.keyType); // "key"

}