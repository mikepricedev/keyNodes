"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
// import RootKeyNodes from './RootKeyNodes';
const path_notation_1 = require("path-notation");
const KeyNodeError_1 = require("./KeyNodeError");
const CHILDREN = Symbol();
const DEPTH = Symbol();
const KEY = Symbol();
const KEY_TYPE = Symbol();
const PARENT = Symbol();
const ROOT_KEY_NODES = Symbol();
/**
 * @note
 * Derived class definitions **MUST** pass themselves to `Tself`.  `Tself` should
 * **NOT** be passed during [[KeyNode]] instantiation.
 */
class KeyNode {
    /**
     * @param _privateIniArgs_ This argument is used internally and should **NOT**
     *  be passed during instantiations.
     */
    constructor(key, _privateIniArgs_ = { _parent_: null, _rootKeyNodes_: new Map() }) {
        this[_a] = new Map();
        const keyStr = key.toString();
        this[PARENT] = _privateIniArgs_._parent_;
        this[ROOT_KEY_NODES] = _privateIniArgs_._rootKeyNodes_;
        if (this[PARENT] === null ? this[ROOT_KEY_NODES].has(keyStr) :
            this[PARENT][CHILDREN].has(keyStr)) {
            const siblingKey = this[PARENT] === null ? this[ROOT_KEY_NODES].get(keyStr) :
                this[PARENT][CHILDREN].get(keyStr);
            throw new KeyNodeError_1.default(`'${keyStr}' already exists in sibling set.` +
                `  Sibling key literals must be unique.`, siblingKey);
        }
        // Deep copy MUST occur before this instance is added to the root keys or
        // parent child library in order to prevent circular reference in the event 
        // the KeyNode passed is a parent of itself.
        if (key instanceof KeyNode) {
            this[KEY] = key[KEY];
            this[KEY_TYPE] = key[KEY_TYPE];
            for (const childNode of key[CHILDREN].values()) {
                this.addChild(childNode);
            }
        }
        else {
            this[KEY] = key;
            this[KEY_TYPE] = typeof this[KEY] === 'number'
                && Number.isInteger(this[KEY]) && this[KEY] > -1
                ? 'index' : 'key';
        }
        if (this[PARENT] === null) {
            this[ROOT_KEY_NODES].set(keyStr, this);
            this[DEPTH] = 0;
        }
        else {
            this[PARENT][CHILDREN].set(keyStr, this);
            this[DEPTH] = this[PARENT].depth + 1;
        }
    }
    //Accessors
    get parent() {
        return this[PARENT];
    }
    get key() {
        return this[KEY];
    }
    /**
     * Returns "index" for keys of type "number" and "key" for keys of type
     * "string".
     * @note
     * Type "index" is overridden to "key" when a sibling [[KeyNode]] is
     * type "key".
     */
    get keyType() {
        for (const siblingKey of this.siblings()) {
            if (siblingKey[KEY_TYPE] === 'key') {
                return 'key';
            }
        }
        return this[KEY_TYPE];
    }
    /**
     * Returns the root [[KeyNode]] of the path that leads to this [[KeyNode]].
     */
    get rootKey() {
        return this.pathToKey(true).next().value;
    }
    get isRootKey() {
        return this[PARENT] === null;
    }
    get isTerminalKey() {
        return this[CHILDREN].size === 0;
    }
    get numSiblings() {
        return (this[PARENT] === null ?
            this[ROOT_KEY_NODES].size : this[PARENT][CHILDREN].size) - 1;
    }
    get numChildren() {
        return this[CHILDREN].size;
    }
    get depth() {
        return this[DEPTH];
    }
    /**
     * `PathNotation` from the root to the [[KeyNode]].
     */
    get path() {
        return new path_notation_1.default(...function* () {
            for (const keyNode of this.pathToKey(true)) {
                yield keyNode.toString();
            }
        }.call(this));
    }
    get [(_a = CHILDREN, Symbol.toStringTag)]() {
        return this.constructor.name;
    }
    //Methods
    /**
     * @note
     * Supplies base class constructor `_privateIniArgs_` [[IprivateIniArgs]] for
     * derived class overrides of [[KeyNode.addChild]] and [[KeyNode.addSibling]]
     * **Required** when extending this [[KeyNode]].
     */
    _privateIniArgs(relation) {
        return {
            _parent_: relation === 'child' ? this : this[PARENT],
            _rootKeyNodes_: this[ROOT_KEY_NODES]
        };
    }
    hasChild(childKey) {
        return this[CHILDREN].has(childKey.toString());
    }
    getChild(childKey) {
        const childKeyLiteral = childKey.toString();
        const children = this[CHILDREN];
        return children.has(childKeyLiteral) ? children.get(childKeyLiteral) : null;
    }
    /**
     * @note
     * When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] **required** with override
     * implementations.
     */
    addChild(childKey) {
        return new KeyNode(childKey, this._privateIniArgs('child'));
    }
    /**
     * @note
     * When removal is successful, the removed child [[KeyNode]] is transformed
     * into a root [[KeyNode]].
     */
    removeChild(childKey) {
        const child = this.getChild(childKey);
        // Convert child into root KeyNode if delete is successful
        if (child !== null && this[CHILDREN].delete(childKey.toString())) {
            child[DEPTH] = 0;
            child[PARENT] = null;
            child[ROOT_KEY_NODES] = new Map();
            return true;
        }
        return false;
    }
    hasSibling(siblingKey) {
        const siblingKeyLiteral = siblingKey.toString();
        if (this.toString() === siblingKeyLiteral) {
            return false;
        }
        else if (this[PARENT] === null) {
            return this[ROOT_KEY_NODES].has(siblingKeyLiteral);
        }
        else {
            return this[PARENT][CHILDREN].has(siblingKeyLiteral);
        }
    }
    getSibling(siblingKey) {
        const siblingKeyLiteral = siblingKey.toString();
        if (siblingKeyLiteral === this.toString()) {
            return null;
        }
        if (this[PARENT] === null) {
            return this[ROOT_KEY_NODES].has(siblingKeyLiteral) ?
                this[ROOT_KEY_NODES].get(siblingKeyLiteral) : null;
        }
        else {
            return this[PARENT][CHILDREN].has(siblingKeyLiteral) ?
                this[PARENT][CHILDREN].get(siblingKeyLiteral) : null;
        }
    }
    /**
     * @note
     * When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] **required** with override
     * implementations.
     */
    addSibling(siblingKey) {
        return new KeyNode(siblingKey, this._privateIniArgs('sibling'));
    }
    /**
     * @note
     * When removal is successful, the removed sibling [[KeyNode]] is
     * transformed into a root [[KeyNode]].
     */
    removeSibling(siblingKey) {
        const sibling = this.getSibling(siblingKey);
        if (sibling !== null &&
            (this[PARENT] === null ? this[ROOT_KEY_NODES] : this[PARENT][CHILDREN])
                .delete(siblingKey.toString())) {
            sibling[DEPTH] = 0;
            sibling[PARENT] = null;
            sibling[ROOT_KEY_NODES] = new Map();
            return true;
        }
        return false;
    }
    children() {
        return this[CHILDREN].values();
    }
    *ancestors() {
        let pKey = this[PARENT];
        while (pKey !== null) {
            yield pKey;
            pKey = pKey[PARENT];
        }
    }
    /**
     * Iterates all [[KeyNode]]s along path to the [[KeyNode]].
     * @param includeSelf when `false` does NOT include this [[KeyNode]].
     */
    *pathToKey(includeSelf = true) {
        if (this[PARENT] === null) {
            if (includeSelf) {
                yield this;
            }
            return;
        }
        yield* this[PARENT].pathToKey(true);
        if (includeSelf) {
            yield this;
        }
    }
    *siblings() {
        const siblingsIter = this[PARENT] === null ?
            this[ROOT_KEY_NODES].values() : this[PARENT].children();
        for (const sibling of siblingsIter) {
            if (sibling !== this) {
                yield sibling;
            }
        }
    }
    rootKeys() {
        let keyNode = this;
        while (keyNode[ROOT_KEY_NODES] === null) {
            keyNode = keyNode[PARENT];
        }
        return keyNode[ROOT_KEY_NODES].values();
    }
    /**
     * Iterates decedent terminal [[KeyNode]]s (default).  If this [[KeyNode]]
     * is terminal, iterates self.
     * @param global pass `true` to iterate all terminal keys in the hierarchy
     * from the terminal [[KeyNode]]s.
     */
    *terminalKeys(global = false) {
        if (global) {
            for (const rootKey of this.rootKeys()) {
                yield* rootKey.terminalKeys(false);
            }
            return;
        }
        if (this[CHILDREN].size === 0) {
            yield this;
            return;
        }
        for (const child of this[CHILDREN].values()) {
            yield* child.terminalKeys(global);
        }
    }
    toString() {
        return this[KEY].toString();
    }
    valueOf() {
        return this.keyType === 'index' ? this[KEY] : this[KEY].toString();
    }
}
exports.default = KeyNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9LZXlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw2Q0FBNkM7QUFDN0MsaURBQXlDO0FBQ3pDLGlEQUEwQztBQUUxQyxNQUFNLFFBQVEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDeEMsTUFBTSxLQUFLLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ3JDLE1BQU0sR0FBRyxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUNuQyxNQUFNLFFBQVEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDeEMsTUFBTSxNQUFNLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ3RDLE1BQU0sY0FBYyxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQU85Qzs7OztHQUlHO0FBQ0gsTUFBcUIsT0FBTztJQWExQjs7O09BR0c7SUFDSCxZQUFZLEdBQXdCLEVBQ2xDLG1CQUNBLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsSUFBSSxHQUFHLEVBQUUsRUFBQztRQWIxQixRQUFVLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7UUFnQnJELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU5QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUM7UUFFdkQsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFDcEM7WUFFRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFB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