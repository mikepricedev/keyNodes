**[key-nodes](../README.md)**


# Class: KeyNode <**Tkey, Tself**>

**`remarks`** 
Derived class definitions MUST pass themselves to `Tself`.  `Tself` should
NOT be passed during [KeyNode](keynode.md) instantiation.

## Type parameters

▪ **Tkey**: *string | number*

▪ **Tself**: *[KeyNode](keynode.md)*

## Hierarchy

* String

  * **KeyNode**

  * [KeyValueNode](keyvaluenode.md)

## Indexable

* \[ **index**: *number*\]: string

## Index

### Constructors

* [constructor](keynode.md#constructor)

### Properties

* [length](keynode.md#length)
* [String](keynode.md#static-string)

### Accessors

* [__@toStringTag](keynode.md#__@tostringtag)
* [depth](keynode.md#depth)
* [isRootKey](keynode.md#isrootkey)
* [isTerminalKey](keynode.md#isterminalkey)
* [key](keynode.md#key)
* [keyType](keynode.md#keytype)
* [numChildren](keynode.md#numchildren)
* [parent](keynode.md#parent)
* [path](keynode.md#path)
* [rootKey](keynode.md#rootkey)

### Methods

* [__@iterator](keynode.md#__@iterator)
* [addChild](keynode.md#addchild)
* [addSibling](keynode.md#addsibling)
* [anchor](keynode.md#anchor)
* [big](keynode.md#big)
* [blink](keynode.md#blink)
* [bold](keynode.md#bold)
* [charAt](keynode.md#charat)
* [charCodeAt](keynode.md#charcodeat)
* [children](keynode.md#children)
* [codePointAt](keynode.md#codepointat)
* [concat](keynode.md#concat)
* [endsWith](keynode.md#endswith)
* [fixed](keynode.md#fixed)
* [fontcolor](keynode.md#fontcolor)
* [fontsize](keynode.md#fontsize)
* [getChild](keynode.md#getchild)
* [getSibling](keynode.md#getsibling)
* [hasChild](keynode.md#haschild)
* [hasSibling](keynode.md#hassibling)
* [includes](keynode.md#includes)
* [indexOf](keynode.md#indexof)
* [italics](keynode.md#italics)
* [lastIndexOf](keynode.md#lastindexof)
* [link](keynode.md#link)
* [localeCompare](keynode.md#localecompare)
* [match](keynode.md#match)
* [normalize](keynode.md#normalize)
* [padEnd](keynode.md#padend)
* [padStart](keynode.md#padstart)
* [parents](keynode.md#parents)
* [pathToKey](keynode.md#pathtokey)
* [removeChild](keynode.md#removechild)
* [removeSibling](keynode.md#removesibling)
* [repeat](keynode.md#repeat)
* [replace](keynode.md#replace)
* [rootKeys](keynode.md#rootkeys)
* [search](keynode.md#search)
* [siblings](keynode.md#siblings)
* [slice](keynode.md#slice)
* [small](keynode.md#small)
* [split](keynode.md#split)
* [startsWith](keynode.md#startswith)
* [strike](keynode.md#strike)
* [sub](keynode.md#sub)
* [substr](keynode.md#substr)
* [substring](keynode.md#substring)
* [sup](keynode.md#sup)
* [toLocaleLowerCase](keynode.md#tolocalelowercase)
* [toLocaleUpperCase](keynode.md#tolocaleuppercase)
* [toLowerCase](keynode.md#tolowercase)
* [toString](keynode.md#tostring)
* [toUpperCase](keynode.md#touppercase)
* [trim](keynode.md#trim)
* [trimEnd](keynode.md#trimend)
* [trimLeft](keynode.md#trimleft)
* [trimRight](keynode.md#trimright)
* [trimStart](keynode.md#trimstart)
* [valueOf](keynode.md#valueof)

## Constructors

###  constructor

\+ **new KeyNode**(`key`: Tkey | [KeyNode](keynode.md)‹Tkey›, `_privateIniArgs_`: Partial‹[IprivateIniArgs](../interfaces/iprivateiniargs.md)‹Tself››): *[KeyNode](keynode.md)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`key` | Tkey &#124; [KeyNode](keynode.md)‹Tkey› | - | - |
`_privateIniArgs_` | Partial‹[IprivateIniArgs](../interfaces/iprivateiniargs.md)‹Tself›› |  
    {_parent_:null, _rootKeyNodes_:new Map()} | This argument is private and should NOT be passed during instantiations.  |

**Returns:** *[KeyNode](keynode.md)*

## Properties

###  length

• **length**: *number*

*Inherited from void*

Returns the length of a String object.

___

### `Static` String

▪ **String**: *StringConstructor*

Allows manipulation and formatting of text strings and determination and location of substrings within strings.

## Accessors

###  __@toStringTag

• **get __@toStringTag**(): *string*

**Returns:** *string*

___

###  depth

• **get depth**(): *number*

**Returns:** *number*

___

###  isRootKey

• **get isRootKey**(): *boolean*

**Returns:** *boolean*

___

###  isTerminalKey

• **get isTerminalKey**(): *boolean*

**Returns:** *boolean*

___

###  key

• **get key**(): *Tkey*

**Returns:** *Tkey*

___

###  keyType

• **get keyType**(): *"index" | "key"*

Returns "index" for keys of type "number" and "key" for keys of type
"string".

**`remarks`** 
Type "index" is overridden to "key" when a sibling [KeyNode](keynode.md) is
type "key".

**Returns:** *"index" | "key"*

___

###  numChildren

• **get numChildren**(): *number*

**Returns:** *number*

___

###  parent

• **get parent**(): *Tself | null*

**Returns:** *Tself | null*

___

###  path

• **get path**(): *PathNotation*

`PathNotation` from the root to the [KeyNode](keynode.md).

**Returns:** *PathNotation*

___

###  rootKey

• **get rootKey**(): *Tself*

Returns the root key of the path that leads to this [KeyNode](keynode.md)

**Returns:** *Tself*

## Methods

###  __@iterator

▸ **__@iterator**(): *IterableIterator‹string›*

*Inherited from void*

Iterator

**Returns:** *IterableIterator‹string›*

___

###  addChild

▸ **addChild**<**TchildKey**>(`childKey`: TchildKey | [KeyNode](keynode.md)‹TchildKey›): *[KeyNode](keynode.md)‹TchildKey›*

**`notes`** When extending, must be overridden and return derived class.
Utility `KeyNode._privateIniArgs` helps with override implementation.

**Type parameters:**

▪ **TchildKey**: *number | string*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | TchildKey &#124; [KeyNode](keynode.md)‹TchildKey› |

**Returns:** *[KeyNode](keynode.md)‹TchildKey›*

___

###  addSibling

▸ **addSibling**<**TsiblingKey**>(`siblingKey`: TsiblingKey | [KeyNode](keynode.md)‹TsiblingKey›): *[KeyNode](keynode.md)‹TsiblingKey›*

**`remarks`** When extending, must be overridden and return derived class.
Utility [[KeyNode._privateIniArgs]] helps with override implementation.

**Type parameters:**

▪ **TsiblingKey**: *number | string*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | TsiblingKey &#124; [KeyNode](keynode.md)‹TsiblingKey› |

**Returns:** *[KeyNode](keynode.md)‹TsiblingKey›*

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

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | string &#124; number |

**Returns:** *Tself | null*

___

###  getSibling

▸ **getSibling**(`siblingKey`: string | number): *Tself | null*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | string &#124; number |

**Returns:** *Tself | null*

___

###  hasChild

▸ **hasChild**(`childKey`: string | number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | string &#124; number |

**Returns:** *boolean*

___

###  hasSibling

▸ **hasSibling**(`siblingKey`: string | number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`siblingKey` | string &#124; number |

**Returns:** *boolean*

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

*Overrides void*

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

**Returns:** *IterableIterator‹Tself›*

___

###  pathToKey

▸ **pathToKey**(`includeSelf`: boolean): *IterableIterator‹Tself›*

Iterates all [KeyNode](keynode.md)s along path to the [KeyNode](keynode.md).

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`includeSelf` | boolean | true | when `false` does NOT include the [KeyNode](keynode.md) as last iterator result.  |

**Returns:** *IterableIterator‹Tself›*

___

###  removeChild

▸ **removeChild**(`childKey`: string | number): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`childKey` | string &#124; number |

**Returns:** *boolean*

___

###  removeSibling

▸ **removeSibling**(`siblingKey`: string | number): *boolean*

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

###  valueOf

▸ **valueOf**(): *string*

*Inherited from void*

Returns the primitive value of the specified object.

**Returns:** *string*