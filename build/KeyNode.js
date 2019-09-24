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
const PARENT = Symbol();
const PATH_NOTATION = Symbol();
const ROOT_KEY = Symbol();
const ROOT_KEY_NODES = Symbol();
/**
 * @remarks
 * Derived class definitions MUST pass themselves to `Tself`.  `Tself` should
 * NOT be passed during [[KeyNode]] instantiation.
 */
class KeyNode extends String {
    /**
     * @param _privateIniArgs_ This argument is private and should NOT be passed
     * during instantiations.
     */
    constructor(key, _privateIniArgs_ = { _parent_: null, _rootKeyNodes_: new Map() }) {
        super(key.toString());
        this[_a] = new Map();
        const keyStr = key.toString();
        this[PARENT] = _privateIniArgs_._parent_;
        this[ROOT_KEY_NODES] = _privateIniArgs_._rootKeyNodes_;
        if (this.hasSibling(keyStr)) {
            throw new KeyNodeError_1.default(`'${keyStr}' already exists in sibling set.` +
                `  Sibling key literals must be unique.`, this.getSibling(keyStr));
        }
        // Deep copy MUST occur before this instance is added to the root keys or
        // parent child library in order to prevent circular reference in the event 
        // the KeyNode passed is a parent of itself.
        if (key instanceof KeyNode) {
            this[KEY] = key.key;
            for (const childNode of key.children()) {
                this.addChild(childNode);
            }
        }
        else {
            this[KEY] = key;
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
    get keyType() {
        return typeof this[KEY] === 'string' ? 'key' : 'index';
    }
    /**
     * Returns the root key of the path that leads to this [[KeyNode]]
     */
    get rootKey() {
        //Lazy cache
        if (this[ROOT_KEY] === undefined) {
            this[ROOT_KEY] = this.pathToKey().next().value;
        }
        return this[ROOT_KEY];
    }
    get isRootKey() {
        return this[PARENT] === null;
    }
    get isTerminalKey() {
        return this[CHILDREN].size === 0;
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
        //Lazy cache
        if (this[PATH_NOTATION] === undefined) {
            this[PATH_NOTATION] = new path_notation_1.default(function* () {
                for (const keyNode of this.pathToKey()) {
                    yield keyNode.toString();
                }
            }.call(this));
        }
        return this[PATH_NOTATION];
    }
    get [(_a = CHILDREN, Symbol.toStringTag)]() {
        return this.constructor.name;
    }
    //Methods
    /**
     * @remarks
     * Supplies base class constructor `_privateIniArgs_` [[IprivateIniArgs]] for
     * derived class implementation overrides of [[KeyNode.addChild]] and
     * [[KeyNode.addSibling]] (Required when extending this class).
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
     * @notes When extending, must be overridden and return derived class.
     * Utility `KeyNode._privateIniArgs` helps with override implementation.
     */
    addChild(childKey) {
        return new KeyNode(childKey, this._privateIniArgs('child'));
    }
    removeChild(childKey) {
        return this[CHILDREN].delete(childKey.toString());
    }
    hasSibling(siblingKey) {
        const siblingKeyLiteral = siblingKey.toString();
        if (this[PARENT] === null) {
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
     * @remarks When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] helps with override implementation.
     */
    addSibling(siblingKey) {
        return new KeyNode(siblingKey, this._privateIniArgs('sibling'));
    }
    children() {
        return this[CHILDREN].values();
    }
    *parents() {
        let pKey = this[PARENT];
        while (pKey !== null) {
            yield pKey;
            pKey = pKey[PARENT];
        }
    }
    /**
     * Iterates all [[KeyNode]]s along path to the [[KeyNode]].
     * @param includeSelf when `false` does NOT include the [[KeyNode]] as last
     * iterator result.
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
}
exports.default = KeyNode;
let test = new KeyNode(1);
let test2 = new KeyNode(test);
let key = test2.key;
let key2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9LZXlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw2Q0FBNkM7QUFDN0MsaURBQXlDO0FBQ3pDLGlEQUEwQztBQUUxQyxNQUFNLFFBQVEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDeEMsTUFBTSxLQUFLLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ3JDLE1BQU0sR0FBRyxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUNuQyxNQUFNLE1BQU0sR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDdEMsTUFBTSxhQUFhLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQzdDLE1BQU0sUUFBUSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUN4QyxNQUFNLGNBQWMsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFPOUM7Ozs7R0FJRztBQUNILE1BQXFCLE9BR2pCLFNBQVEsTUFBTTtJQVdoQjs7O09BR0c7SUFDSCxZQUFZLEdBQXdCLEVBQ2xDLG1CQUNBLEVBQUMsUUFBUSxFQUFDLElBQUksRUFBRSxjQUFjLEVBQUMsSUFBSSxHQUFHLEVBQUUsRUFBQztRQUl6QyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFsQlAsUUFBVSxHQUFHLElBQUksR0FBRyxFQUFpQixDQUFDO1FBb0JyRCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQztRQUN6QyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsY0FBYyxDQUFDO1FBRXZELElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUUxQixNQUFNLElBQUksc0JBQVksQ0FBVSxJQUFJLE1BQU0sa0NBQWtDO2dCQUM1RSx3Q0FBd0MsRUFBRSxJQUFJLENBQUMsVUFB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