**[key-nodes](../README.md)**


# Class: KeyValueNode <**Tkey, Tvalue, Tself**>

## Type parameters

▪ **Tkey**: *string | number*

▪ **Tvalue**

▪ **Tself**: *[KeyValueNode](keyvaluenode.md)*

## Hierarchy

  * [KeyNode](keynode.md)‹Tkey, Tself›

  * **KeyValueNode**

## Indexable

* \[ **index**: *number*\]: string

## Index

### Constructors

* [constructor](keyvaluenode.md#constructor)

### Properties

* [length](keyvaluenode.md#length)

### Accessors

* [__@toStringTag](keyvaluenode.md#__@tostringtag)
* [depth](keyvaluenode.md#depth)
* [isRootKey](keyvaluenode.md#isrootkey)
* [isTerminalKey](keyvaluenode.md#isterminalkey)
* [keepHistory](keyvaluenode.md#keephistory)
* [key](keyvaluenode.md#key)
* [keyType](keyvaluenode.md#keytype)
* [numChildren](keyvaluenode.md#numchildren)
* [parent](keyvaluenode.md#parent)
* [path](keyvaluenode.md#path)
* [rootKey](keyvaluenode.md#rootkey)
* [value](keyvaluenode.md#value)
* [keepHistory](keyvaluenode.md#static-keephistory)

### Methods

* [__@iterator](keyvaluenode.md#__@iterator)
* [addChild](keyvaluenode.md#addchild)
* [addSibling](keyvaluenode.md#addsibling)
* [anchor](keyvaluenode.md#anchor)
* [big](keyvaluenode.md#big)
* [blink](keyvaluenode.md#blink)
* [bold](keyvaluenode.md#bold)
* [charAt](keyvaluenode.md#charat)
* [charCodeAt](keyvaluenode.md#charcodeat)
* [children](keyvaluenode.md#children)
* [codePointAt](keyvaluenode.md#codepointat)
* [concat](keyvaluenode.md#concat)
* [endsWith](keyvaluenode.md#endswith)
* [fixed](keyvaluenode.md#fixed)
* [fontcolor](keyvaluenode.md#fontcolor)
* [fontsize](keyvaluenode.md#fontsize)
* [getChild](keyvaluenode.md#getchild)
* [getSibling](keyvaluenode.md#getsibling)
* [hasChild](keyvaluenode.md#haschild)
* [hasSibling](keyvaluenode.md#hassibling)
* [history](keyvaluenode.md#history)
* [includes](keyvaluenode.md#includes)
* [indexOf](keyvaluenode.md#indexof)
* [italics](keyvaluenode.md#italics)
* [lastIndexOf](keyvaluenode.md#lastindexof)
* [link](keyvaluenode.md#link)
* [localeCompare](keyvaluenode.md#localecompare)
* [match](keyvaluenode.md#match)
* [normalize](keyvaluenode.md#normalize)
* [padEnd](keyvaluenode.md#padend)
* [padStart](keyvaluenode.md#padstart)
* [parents](keyvaluenode.md#parents)
* [pathToKey](keyvaluenode.md#pathtokey)
* [redo](keyvaluenode.md#redo)
* [removeChild](keyvaluenode.md#removechild)
* [removeSibling](keyvaluenode.md#removesibling)
* [repeat](keyvaluenode.md#repeat)
* [replace](keyvaluenode.md#replace)
* [rootKeys](keyvaluenode.md#rootkeys)
* [search](keyvaluenode.md#search)
* [siblings](keyvaluenode.md#siblings)
* [slice](keyvaluenode.md#slice)
* [small](keyvaluenode.md#small)
* [split](keyvaluenode.md#split)
* [startsWith](keyvaluenode.md#startswith)
* [strike](keyvaluenode.md#strike)
* [sub](keyvaluenode.md#sub)
* [substr](keyvaluenode.md#substr)
* [substring](keyvaluenode.md#substring)
* [sup](keyvaluenode.md#sup)
* [toLocaleLowerCase](keyvaluenode.md#tolocalelowercase)
* [toLocaleUpperCase](keyvaluenode.md#tolocaleuppercase)
* [toLowerCase](keyvaluenode.md#tolowercase)
* [toString](keyvaluenode.md#tostring)
* [toUpperCase](keyvaluenode.md#touppercase)
* [trim](keyvaluenode.md#trim)
* [trimEnd](keyvaluenode.md#trimend)
* [trimLeft](keyvaluenode.md#trimleft)
* [trimRight](keyvaluenode.md#trimright)
* [trimStart](keyvaluenode.md#trimstart)
* [undo](keyvaluenode.md#undo)
* [valueOf](keyvaluenode.md#valueof)

## Constructors

###  constructor

\+ **new KeyValueNode**(`key`: [KeyValueNode](keyvaluenode.md)‹Tkey, Tvalue›, `value?`: undefined, `_privateIniArgs_?`: Partial‹[IprivateIniArgs](../interfaces/iprivateiniargs.md)‹Tself››): *[KeyValueNode](keyvaluenode.md)*

*Overrides [KeyNode](keynode.md).[constructor](keynode.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | [KeyValueNode](keyvaluenode.md)‹Tkey, Tvalue› |
`value?` | undefined |
`_privateIniArgs_?` | Partial‹[IprivateIniArgs](../interfaces/iprivateiniargs.md)‹Tself›› |

**Returns:** *[KeyValueNode](keyvaluenode.md)*

\+ **new KeyValueNode**(`key`: Tkey, `value?`: Tvalue, `_privateIniArgs_?`: Partial‹[IprivateIniArgs](../interfaces/iprivateiniargs.md)‹Tself››): *[KeyValueNode](keyvaluenode.md)*

*Overrides [KeyNode](keynode.md).[constructor](keynode.md#constructor)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | Tkey |
`value?` | Tvalue |
`_privateIniArgs_?` | Partial‹[IprivateIniArgs](../interfaces/iprivateiniargs.md)‹Tself›› |

**Returns:** *[KeyValueNode](keyvaluenode.md)*

## Properties

###  length

• **length**: *number*

*Inherited from void*

Returns the length of a String object.

## Accessors

###  __@toStringTag

• **get __@toStringTag**(): *string*

*Inherited from [KeyNode](keynode.md).[__@toStringTag](keynode.md#__@tostringtag)*

**Returns:** *string*

___

###  depth

• **get depth**(): *number*

*Inherited from [KeyNode](keynode.md).[depth](keynode.md#depth)*

**Returns:** *number*

___

###  isRootKey

• **get isRootKey**(): *boolean*

*Inherited from [KeyNode](keynode.md).[isRootKey](keynode.md#isrootkey)*

**Returns:** *boolean*

___

###  isTerminalKey

• **get isTerminalKey**(): *boolean*

*Inherited from [KeyNode](keynode.md).[isTerminalKey](keynode.md#isterminalkey)*

**Returns:** *boolean*

___

###  keepHistory

• **get keepHistory**(): *boolean | number*

Overrides default history conditions for this [KeyValueNode](keyvaluenode.md) instance.
Set `true` to keep all set values, `false` to keep no
historical values, or a `number` indicating the number historical values
to keep.

**Returns:** *boolean | number*

• **set keepHistory**(`keepHistory`: boolean | number): *void*

Overrides default history conditions for this [KeyValueNode](keyvaluenode.md) instance.
Set `true` to keep all set values, `false` to keep no
historical values, or a `number` indicating the number historical values
to keep.

**Parameters:**

Name | Type |
------ | ------ |
`keepHistory` | boolean &#124; number |

**Returns:** *void*

___

###  key

• **get key**(): *Tkey*

*Inherited from [KeyNode](keynode.md).[key](keynode.md#key)*

**Returns:** *Tkey*

___

###  keyType

• **get keyType**(): *"index" | "key"*

*Inherited from [KeyNode](keynode.md).[keyType](keynode.md#keytype)*

Returns "index" for keys of type "number" and "key" for keys of type
"string".

**`remarks`** 
Type "index" is overridden to "key" when a sibling [KeyNode](keynode.md) is
type "key".

**Returns:** *"index" | "key"*

___

###  numChildren

• **get numChildren**(): *number*

*Inherited from [KeyNode](keynode.md).[numChildren](keynode.md#numchildren)*

**Returns:** *number*

___

###  parent

• **get parent**(): *Tself | null*

*Inherited from [KeyNode](keynode.md).[parent](keynode.md#parent)*

**Returns:** *Tself | null*

___

###  path

• **get path**(): *PathNotation*

*Inherited from [KeyNode](keynode.md).[path](keynode.md#path)*

`PathNotation` from the root to the [KeyNode](keynode.md).

**Returns:** *PathNotation*

___

###  rootKey

• **get rootKey**(): *Tself*

*Inherited from [KeyNode](keynode.md).[rootKey](keynode.md#rootkey)*

Returns the root key of the path that leads to this [KeyNode](keynode.md)

**Returns:** *Tself*

___

###  value

• **get value**(): *Tvalue*

**Returns:** *Tvalue*

• **set value**(`value`: Tvalue): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | Tvalue |

**Returns:** *void*

___

### `Static` keepHistory

• **get keepHistory**(): *boolean | number*

Sets default history conditions for all [KeyValueNode](keyvaluenode.md) instances.
Individual instances can override this default.
Set `true` to keep all set values, `false` to keep no
historical values, or a `number` indicating the number historical values
to keep per [KeyValueNode](keyvaluenode.md) instance.

**Returns:** *boolean | number*

• **set keepHistory**(`keepHistory`: boolean | number): *void*

Sets default history conditions for all [KeyValueNode](keyvaluenode.md) instances.
Individual instances can override this default.
Set `true` to keep all set values, `false` to keep no
historical values, or a `number` indicating the number historical values
to keep per [KeyValueNode](keyvaluenode.md) instance.

**Parameters:**

Name | Type |
------ | ------ |
`keepHistory` | boolean &#124; number |

**Returns:** *void*

## Methods

###  __@iterator

▸ **__@iterator**(): *IterableIterator‹string›*

*Inherited from void*

Iterator

**Returns:** *IterableIterator‹string›*

___

###  addChild

▸ **addChild**<**Tchildvalue**, **TchildKey**>(`childKey`: [KeyValueNode](keyvaluenode.md)‹TchildKey, Tchildvalue›): *[KeyValueNode](keyvaluenode.md)‹TchildKey, Tchildvalue›*

*Overrides [KeyNode](keynode.md).[addChild](keynode.md#addchild)*

**Type parameters:**

▪ **Tchildvalue**

▪ **TchildKey**: *string | number*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | [KeyValueNode](keyvaluenode.md)‹TchildKey, Tchildvalue› |

**Returns:** *[KeyValueNode](keyvaluenode.md)‹TchildKey, Tchildvalue›*

▸ **addChild**<**Tchildvalue**, **TchildKey**>(`childKey`: TchildKey, `value?`: Tchildvalue): *[KeyValueNode](keyvaluenode.md)‹TchildKey, Tchildvalue›*

*Overrides [KeyNode](keynode.md).[addChild](keynode.md#addchild)*

**Type parameters:**

▪ **Tchildvalue**

▪ **TchildKey**: *string | number*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | TchildKey |
`value?` | Tchildvalue |

**Returns:** *[KeyValueNode](keyvaluenode.md)‹TchildKey, Tchildvalue›*

___

###  addSibling

▸ **addSibling**<**Tsiblingvalue**, **TsiblingKey**>(`siblingKey`: [KeyValueNode](keyvaluenode.md)‹TsiblingKey, Tsiblingvalue›): *[KeyValueNode](keyvaluenode.md)‹TsiblingKey, Tsiblingvalue›*

*Overrides [KeyNode](keynode.md).[addSibling](keynode.md#addsibling)*

**Type parameters:**

▪ **Tsiblingvalue**

▪ **TsiblingKey**: *string | number*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | [KeyValueNode](keyvaluenode.md)‹TsiblingKey, Tsiblingvalue› |

**Returns:** *[KeyValueNode](keyvaluenode.md)‹TsiblingKey, Tsiblingvalue›*

▸ **addSibling**<**Tsiblingvalue**, **TsiblingKey**>(`siblingKey`: TsiblingKey, `value?`: Tsiblingvalue): *[KeyValueNode](keyvaluenode.md)‹TsiblingKey, Tsiblingvalue›*

*Overrides [KeyNode](keynode.md).[addSibling](keynode.md#addsibling)*

**Type parameters:**

▪ **Tsiblingvalue**

▪ **TsiblingKey**: *string | number*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | TsiblingKey |
`value?` | Tsiblingvalue |

**Returns:** *[KeyValueNode](keyvaluenode.md)‹TsiblingKey, Tsiblingvalue›*

___

###  anchor

▸ **anchor**(`name`: string): *string*

*Inherited from void*

Returns an <a> HTML anchor element and sets the name attribute to the text value

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** *string*

___

###  big

▸ **big**(): *string*

*Inherited from void*

Returns a <big> HTML element

**Returns:** *string*

___

###  blink

▸ **blink**(): *string*

*Inherited from void*

Returns a <blink> HTML element

**Returns:** *string*

___

###  bold

▸ **bold**(): *string*

*Inherited from void*

Returns a <b> HTML element

**Returns:** *string*

___

###  charAt

▸ **charAt**(`pos`: number): *string*

*Inherited from void*

Returns the character at the specified index.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`pos` | number | The zero-based index of the desired character.  |

**Returns:** *string*

___

###  charCodeAt

▸ **charCodeAt**(`index`: number): *number*

*Inherited from void*

Returns the Unicode value of the character at the specified location.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`index` | number | The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.  |

**Returns:** *number*

___

###  children

▸ **children**(): *IterableIterator‹Tself›*

*Inherited from [KeyNode](keynode.md).[children](keynode.md#children)*

**Returns:** *IterableIterator‹Tself›*

___

###  codePointAt

▸ **codePointAt**(`pos`: number): *number | undefined*

*Inherited from void*

Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
value of the UTF-16 encoded code point starting at the string element at position pos in
the String resulting from converting this object to a String.
If there is no element at that position, the result is undefined.
If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.

**Parameters:**

Name | Type |
------ | ------ |
`pos` | number |

**Returns:** *number | undefined*

___

###  concat

▸ **concat**(...`strings`: string[]): *string*

*Inherited from void*

Returns a string that contains the concatenation of two or more strings.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`...strings` | string[] | The strings to append to the end of the string.  |

**Returns:** *string*

___

###  endsWith

▸ **endsWith**(`searchString`: string, `endPosition?`: number): *boolean*

*Inherited from void*

Returns true if the sequence of elements of searchString converted to a String is the
same as the corresponding elements of this object (converted to a String) starting at
endPosition – length(this). Otherwise returns false.

**Parameters:**

Name | Type |
------ | ------ |
`searchString` | string |
`endPosition?` | number |

**Returns:** *boolean*

___

###  fixed

▸ **fixed**(): *string*

*Inherited from void*

Returns a <tt> HTML element

**Returns:** *string*

___

###  fontcolor

▸ **fontcolor**(`color`: string): *string*

*Inherited from void*

Returns a <font> HTML element and sets the color attribute value

**Parameters:**

Name | Type |
------ | ------ |
`color` | string |

**Returns:** *string*

___

###  fontsize

▸ **fontsize**(`size`: number): *string*

*Inherited from void*

Returns a <font> HTML element and sets the size attribute value

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *string*

▸ **fontsize**(`size`: string): *string*

*Inherited from void*

Returns a <font> HTML element and sets the size attribute value

**Parameters:**

Name | Type |
------ | ------ |
`size` | string |

**Returns:** *string*

___

###  getChild

▸ **getChild**(`childKey`: string | number): *Tself | null*

*Inherited from [KeyNode](keynode.md).[getChild](keynode.md#getchild)*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | string &#124; number |

**Returns:** *Tself | null*

___

###  getSibling

▸ **getSibling**(`siblingKey`: string | number): *Tself | null*

*Inherited from [KeyNode](keynode.md).[getSibling](keynode.md#getsibling)*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | string &#124; number |

**Returns:** *Tself | null*

___

###  hasChild

▸ **hasChild**(`childKey`: string | number): *boolean*

*Inherited from [KeyNode](keynode.md).[hasChild](keynode.md#haschild)*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | string &#124; number |

**Returns:** *boolean*

___

###  hasSibling

▸ **hasSibling**(`siblingKey`: string | number): *boolean*

*Inherited from [KeyNode](keynode.md).[hasSibling](keynode.md#hassibling)*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | string &#124; number |

**Returns:** *boolean*

___

###  history

▸ **history**(`direction`: [TkeyValueNodeHistoricalDirection](../README.md#tkeyvaluenodehistoricaldirection)): *[KeyValueNodeHistoricalIterableIterator](keyvaluenodehistoricaliterableiterator.md)‹Tvalue›*

Historical values set via [KeyValueNode.value](keyvaluenode.md#value)

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`direction` | [TkeyValueNodeHistoricalDirection](../README.md#tkeyvaluenodehistoricaldirection) | "undo" |

**Returns:** *[KeyValueNodeHistoricalIterableIterator](keyvaluenodehistoricaliterableiterator.md)‹Tvalue›*

___

###  includes

▸ **includes**(`searchString`: string, `position?`: number): *boolean*

*Inherited from void*

Returns true if searchString appears as a substring of the result of converting this
object to a String, at one or more positions that are
greater than or equal to position; otherwise, returns false.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchString` | string | search string |
`position?` | number | If position is undefined, 0 is assumed, so as to search all of the String.  |

**Returns:** *boolean*

___

###  indexOf

▸ **indexOf**(`searchString`: string, `position?`: number): *number*

*Inherited from void*

Returns the position of the first occurrence of a substring.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchString` | string | The substring to search for in the string |
`position?` | number | The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.  |

**Returns:** *number*

___

###  italics

▸ **italics**(): *string*

*Inherited from void*

Returns an <i> HTML element

**Returns:** *string*

___

###  lastIndexOf

▸ **lastIndexOf**(`searchString`: string, `position?`: number): *number*

*Inherited from void*

Returns the last occurrence of a substring in the string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchString` | string | The substring to search for. |
`position?` | number | The index at which to begin searching. If omitted, the search begins at the end of the string.  |

**Returns:** *number*

___

###  link

▸ **link**(`url`: string): *string*

*Inherited from void*

Returns an <a> HTML element and sets the href attribute value

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |

**Returns:** *string*

___

###  localeCompare

▸ **localeCompare**(`that`: string): *number*

*Inherited from void*

Determines whether two strings are equivalent in the current locale.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`that` | string | String to compare to target string  |

**Returns:** *number*

___

###  match

▸ **match**(`regexp`: string | RegExp): *RegExpMatchArray | null*

*Inherited from void*

*Overrides void*

Matches a string with a regular expression, and returns an array containing the results of that search.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`regexp` | string &#124; RegExp | A variable name or string literal containing the regular expression pattern and flags.  |

**Returns:** *RegExpMatchArray | null*

___

###  normalize

▸ **normalize**(`form`: "NFC" | "NFD" | "NFKC" | "NFKD"): *string*

*Inherited from void*

Returns the String value result of normalizing the string into the normalization form
named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`form` | "NFC" &#124; "NFD" &#124; "NFKC" &#124; "NFKD" | Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default is "NFC"  |

**Returns:** *string*

▸ **normalize**(`form?`: string): *string*

*Inherited from void*

Returns the String value result of normalizing the string into the normalization form
named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`form?` | string | Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default is "NFC"  |

**Returns:** *string*

___

###  padEnd

▸ **padEnd**(`maxLength`: number, `fillString?`: string): *string*

*Inherited from void*

Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
The padding is applied from the end (right) of the current string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`maxLength` | number | The length of the resulting string once the current string has been padded.        If this parameter is smaller than the current string's length, the current string will be returned as it is.  |
`fillString?` | string | The string to pad the current string with.        If this string is too long, it will be truncated and the left-most part will be applied.        The default value for this parameter is " " (U+0020).  |

**Returns:** *string*

___

###  padStart

▸ **padStart**(`maxLength`: number, `fillString?`: string): *string*

*Inherited from void*

Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
The padding is applied from the start (left) of the current string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`maxLength` | number | The length of the resulting string once the current string has been padded.        If this parameter is smaller than the current string's length, the current string will be returned as it is.  |
`fillString?` | string | The string to pad the current string with.        If this string is too long, it will be truncated and the left-most part will be applied.        The default value for this parameter is " " (U+0020).  |

**Returns:** *string*

___

###  parents

▸ **parents**(): *IterableIterator‹Tself›*

*Inherited from [KeyNode](keynode.md).[parents](keynode.md#parents)*

**Returns:** *IterableIterator‹Tself›*

___

###  pathToKey

▸ **pathToKey**(`includeSelf`: boolean): *IterableIterator‹Tself›*

*Inherited from [KeyNode](keynode.md).[pathToKey](keynode.md#pathtokey)*

Iterates all [KeyNode](keynode.md)s along path to the [KeyNode](keynode.md).

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeSelf` | boolean | true | when `false` does NOT include the [KeyNode](keynode.md) as last iterator result.  |

**Returns:** *IterableIterator‹Tself›*

___

###  redo

▸ **redo**(): *boolean*

**Returns:** *boolean*

___

###  removeChild

▸ **removeChild**(`childKey`: string | number): *boolean*

*Inherited from [KeyNode](keynode.md).[removeChild](keynode.md#removechild)*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | string &#124; number |

**Returns:** *boolean*

___

###  removeSibling

▸ **removeSibling**(`siblingKey`: string | number): *boolean*

*Inherited from [KeyNode](keynode.md).[removeSibling](keynode.md#removesibling)*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | string &#124; number |

**Returns:** *boolean*

___

###  repeat

▸ **repeat**(`count`: number): *string*

*Inherited from void*

Returns a String value that is made from count copies appended together. If count is 0,
the empty string is returned.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`count` | number | number of copies to append  |

**Returns:** *string*

___

###  replace

▸ **replace**(`searchValue`: string | RegExp, `replaceValue`: string): *string*

*Inherited from void*

*Overrides void*

Replaces text in a string, using a regular expression or search string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`searchValue` | string &#124; RegExp | A string to search for. |
`replaceValue` | string | A string containing the text to replace for every successful match of searchValue in this string.  |

**Returns:** *string*

▸ **replace**(`searchValue`: string | RegExp, `replacer`: function): *string*

*Inherited from void*

*Overrides void*

Replaces text in a string, using a regular expression or search string.

**Parameters:**

▪ **searchValue**: *string | RegExp*

A string to search for.

▪ **replacer**: *function*

A function that returns the replacement text.

▸ (`substring`: string, ...`args`: any[]): *string*

**Parameters:**

Name | Type |
------ | ------ |
`substring` | string |
`...args` | any[] |

**Returns:** *string*

___

###  rootKeys

▸ **rootKeys**(): *IterableIterator‹Tself›*

*Inherited from [KeyNode](keynode.md).[rootKeys](keynode.md#rootkeys)*

**Returns:** *IterableIterator‹Tself›*

___

###  search

▸ **search**(`regexp`: string | RegExp): *number*

*Inherited from void*

*Overrides void*

Finds the first substring match in a regular expression search.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`regexp` | string &#124; RegExp | The regular expression pattern and applicable flags.  |

**Returns:** *number*

___

###  siblings

▸ **siblings**(): *IterableIterator‹Tself›*

*Inherited from [KeyNode](keynode.md).[siblings](keynode.md#siblings)*

**Returns:** *IterableIterator‹Tself›*

___

###  slice

▸ **slice**(`start?`: number, `end?`: number): *string*

*Inherited from void*

Returns a section of a string.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start?` | number | The index to the beginning of the specified portion of stringObj. |
`end?` | number | The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end. If this value is not specified, the substring continues to the end of stringObj.  |

**Returns:** *string*

___

###  small

▸ **small**(): *string*

*Inherited from void*

Returns a <small> HTML element

**Returns:** *string*

___

###  split

▸ **split**(`separator`: string | RegExp, `limit?`: number): *string[]*

*Inherited from void*

*Overrides void*

Split a string into substrings using the specified separator and return them as an array.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`separator` | string &#124; RegExp | A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned. |
`limit?` | number | A value used to limit the number of elements returned in the array.  |

**Returns:** *string[]*

___

###  startsWith

▸ **startsWith**(`searchString`: string, `position?`: number): *boolean*

*Inherited from void*

Returns true if the sequence of elements of searchString converted to a String is the
same as the corresponding elements of this object (converted to a String) starting at
position. Otherwise returns false.

**Parameters:**

Name | Type |
------ | ------ |
`searchString` | string |
`position?` | number |

**Returns:** *boolean*

___

###  strike

▸ **strike**(): *string*

*Inherited from void*

Returns a <strike> HTML element

**Returns:** *string*

___

###  sub

▸ **sub**(): *string*

*Inherited from void*

Returns a <sub> HTML element

**Returns:** *string*

___

###  substr

▸ **substr**(`from`: number, `length?`: number): *string*

*Inherited from void*

Gets a substring beginning at the specified location and having the specified length.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | number | The starting position of the desired substring. The index of the first character in the string is zero. |
`length?` | number | The number of characters to include in the returned substring.  |

**Returns:** *string*

___

###  substring

▸ **substring**(`start`: number, `end?`: number): *string*

*Inherited from void*

Returns the substring at the specified location within a String object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`start` | number | The zero-based index number indicating the beginning of the substring. |
`end?` | number | Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end. If end is omitted, the characters from start through the end of the original string are returned.  |

**Returns:** *string*

___

###  sup

▸ **sup**(): *string*

*Inherited from void*

Returns a <sup> HTML element

**Returns:** *string*

___

###  toLocaleLowerCase

▸ **toLocaleLowerCase**(): *string*

*Inherited from void*

Converts all alphabetic characters to lowercase, taking into account the host environment's current locale.

**Returns:** *string*

___

###  toLocaleUpperCase

▸ **toLocaleUpperCase**(): *string*

*Inherited from void*

Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale.

**Returns:** *string*

___

###  toLowerCase

▸ **toLowerCase**(): *string*

*Inherited from void*

Converts all the alphabetic characters in a string to lowercase.

**Returns:** *string*

___

###  toString

▸ **toString**(): *string*

*Inherited from void*

Returns a string representation of a string.

**Returns:** *string*

___

###  toUpperCase

▸ **toUpperCase**(): *string*

*Inherited from void*

Converts all the alphabetic characters in a string to uppercase.

**Returns:** *string*

___

###  trim

▸ **trim**(): *string*

*Inherited from void*

Removes the leading and trailing white space and line terminator characters from a string.

**Returns:** *string*

___

###  trimEnd

▸ **trimEnd**(): *string*

*Inherited from void*

Removes the trailing white space and line terminator characters from a string.

**Returns:** *string*

___

###  trimLeft

▸ **trimLeft**(): *string*

*Inherited from void*

*Overrides void*

Removes the trailing white space and line terminator characters from a string.

**Returns:** *string*

___

###  trimRight

▸ **trimRight**(): *string*

*Inherited from void*

*Overrides void*

Removes the leading white space and line terminator characters from a string.

**Returns:** *string*

___

###  trimStart

▸ **trimStart**(): *string*

*Inherited from void*

Removes the leading white space and line terminator characters from a string.

**Returns:** *string*

___

###  undo

▸ **undo**(): *boolean*

**Returns:** *boolean*

___

###  valueOf

▸ **valueOf**(): *string*

*Inherited from void*

Returns the primitive value of the specified object.

**Returns:** *string*