**[key-nodes](../README.md)**


# Class: KeyValueNodeHistoricalIterableIterator <**Tvalue**>

IterableIterator of historical values returned from [KeyValueNode.history](keyvaluenode.md#history)

## Type parameters

▪ **Tvalue**

## Hierarchy

* **KeyValueNodeHistoricalIterableIterator**

## Implements

* IterableIterator‹[KeyValueNodeHistoricalResultValue](keyvaluenodehistoricalresultvalue.md)‹Tvalue››

## Index

### Constructors

* [constructor](keyvaluenodehistoricaliterableiterator.md#constructor)

### Methods

* [__@iterator](keyvaluenodehistoricaliterableiterator.md#__@iterator)
* [next](keyvaluenodehistoricaliterableiterator.md#next)

## Constructors

###  constructor

\+ **new KeyValueNodeHistoricalIterableIterator**(`direction`: [TkeyValueNodeHistoricalDirection](../README.md#tkeyvaluenodehistoricaldirection), `startIndex`: number, `values`: Tvalue[], `set`: function, `isValid`: function): *[KeyValueNodeHistoricalIterableIterator](keyvaluenodehistoricaliterableiterator.md)*

**Parameters:**

▪ **direction**: *[TkeyValueNodeHistoricalDirection](../README.md#tkeyvaluenodehistoricaldirection)*

▪ **startIndex**: *number*

▪ **values**: *Tvalue[]*

▪ **set**: *function*

▸ (`index`: number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

▪ **isValid**: *function*

▸ (): *boolean*

**Returns:** *[KeyValueNodeHistoricalIterableIterator](keyvaluenodehistoricaliterableiterator.md)*

## Methods

###  __@iterator

▸ **__@iterator**(): *[KeyValueNodeHistoricalIterableIterator](keyvaluenodehistoricaliterableiterator.md)‹Tvalue›*

**Returns:** *[KeyValueNodeHistoricalIterableIterator](keyvaluenodehistoricaliterableiterator.md)‹Tvalue›*

___

###  next

▸ **next**(...`args`: any[]): *IteratorResult‹[KeyValueNodeHistoricalResultValue](keyvaluenodehistoricalresultvalue.md)‹Tvalue››*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | any[] |

**Returns:** *IteratorResult‹[KeyValueNodeHistoricalResultValue](keyvaluenodehistoricalresultvalue.md)‹Tvalue››*