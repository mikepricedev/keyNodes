"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9LZXlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUE2QztBQUM3QyxpREFBeUM7QUFDekMsaURBQTBDO0FBRTFDLE1BQU0sUUFBUSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUN4QyxNQUFNLEtBQUssR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDckMsTUFBTSxHQUFHLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ25DLE1BQU0sUUFBUSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUN4QyxNQUFNLE1BQU0sR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDdEMsTUFBTSxjQUFjLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBTzlDOzs7O0dBSUc7QUFDSCxNQUFxQixPQUFPO0lBYTFCOzs7T0FHRztJQUNILFlBQVksR0FBd0IsRUFDbEMsbUJBQ0EsRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBQyxJQUFJLEdBQUcsRUFBRSxFQUFDO1FBYjFCLFFBQVUsR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQztRQWdCckQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztRQUV2RCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUNwQztZQUVFLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDN0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVsQyxNQUFNLElBQUksc0JBQVksQ0FBVSxJQUFJLE1BQU0sa0NBQWtDO2dCQUM1RSx3Q0FBd0MsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUV2RDtRQUVELHlFQUF5RTtRQUN6RSw0RUFBNEU7UUFDNUUsNENBQTRDO1FBQzVDLElBQUcsR0FBRyxZQUFZLE9BQU8sRUFBRTtZQUV6QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFL0IsS0FBSSxNQUFNLFNBQVMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBRTdDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7YUFFMUI7U0FFRjthQUFNO1lBRUwsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUTttQkFDekMsTUFBTSxDQUFDLFNBQVMsQ0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FFckI7UUFHRCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQU8sSUFBSSxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUVqQjthQUFNO1lBRUwsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBRXRDO0lBRUgsQ0FBQztJQUVELFdBQVc7SUFDWCxJQUFJLE1BQU07UUFFUixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV0QixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBRUwsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbkIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILElBQUksT0FBTztRQUVULEtBQUksTUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBRXZDLElBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssRUFBRTtnQkFFakMsT0FBTyxLQUFLLENBQUM7YUFFZDtTQUVGO1FBRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFeEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxPQUFPO1FBR1QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztJQUUzQyxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBRVgsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBRS9CLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFFZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO0lBRW5DLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFFYixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFakUsQ0FBQztJQUVELElBQUksV0FBVztRQUViLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUU3QixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBRVAsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFckIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxJQUFJO1FBRU4sT0FBTyxJQUFJLHVCQUFZLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDbEMsS0FBSSxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDO2dCQUN4QyxNQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVoQixDQUFDO0lBRUQsSUFBSSxPQWpLYyxRQUFRLEVBaUtyQixNQUFNLENBQUMsV0FBVyxFQUFDO1FBRXRCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFFL0IsQ0FBQztJQUdELFNBQVM7SUFDVDs7Ozs7T0FLRztJQUNPLGVBQWUsQ0FBQyxRQUE0QjtRQUdwRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN6RCxjQUFjLEVBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztTQUNwQyxDQUFDO0lBRUosQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUF3QjtRQUUvQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFakQsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUF3QjtRQUUvQixNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWhDLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRTlFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFFBQVEsQ0FDTixRQUF1QztRQUd2QyxPQUFPLElBQUksT0FBTyxDQUFZLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFekUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsUUFBd0I7UUFFbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QywwREFBMEQ7UUFDMUQsSUFBRyxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7WUFFL0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBRWxDLE9BQU8sSUFBSSxDQUFDO1NBRWI7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUVmLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBMEI7UUFFbkMsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEQsSUFBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssaUJBQWlCLEVBQUM7WUFFdkMsT0FBTyxLQUFLLENBQUM7U0FFZDthQUFNLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTtZQUUvQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUVwRDthQUFNO1lBRUwsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FFdEQ7SUFFSCxDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQTBCO1FBRW5DLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWhELElBQUcsaUJBQWlCLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDO1lBRXZDLE9BQU8sSUFBSSxDQUFDO1NBRWI7UUFFRCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFeEIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FFdEQ7YUFBTTtZQUVMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1NBRS9EO0lBRUgsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsVUFBVSxDQUNSLFVBQTZDO1FBRzdDLE9BQU8sSUFBSSxPQUFPLENBQWMsVUFBVSxFQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFckMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxhQUFhLENBQUMsVUFBMEI7UUFFdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1QyxJQUFHLE9BQU8sS0FBSyxJQUFJO1lBQ2pCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3BFLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsRUFDbEM7WUFFRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7WUFFcEMsT0FBTyxJQUFJLENBQUM7U0FFYjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBRWYsQ0FBQztJQUVELFFBQVE7UUFFTixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUVqQyxDQUFDO0lBRUQsQ0FBQyxTQUFTO1FBRVIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhCLE9BQU0sSUFBSSxLQUFLLElBQUksRUFBQztZQUVsQixNQUFNLElBQUksQ0FBQztZQUVYLElBQUksR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FFNUI7SUFFSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUk7UUFFM0IsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFDO1lBRXZCLElBQUcsV0FBVyxFQUFDO2dCQUViLE1BQVcsSUFBSSxDQUFDO2FBRWpCO1lBRUQsT0FBTztTQUVSO1FBRUQsS0FBSyxDQUFDLENBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxJQUFHLFdBQVcsRUFBQztZQUViLE1BQVcsSUFBSSxDQUFDO1NBRWpCO0lBRUgsQ0FBQztJQUVELENBQUMsUUFBUTtRQUVQLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBTSxJQUFJLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUUxRCxLQUFJLE1BQU0sT0FBTyxJQUFJLFlBQVksRUFBQztZQUVoQyxJQUFHLE9BQU8sS0FBSyxJQUFJLEVBQUM7Z0JBRWxCLE1BQWEsT0FBTyxDQUFDO2FBRXRCO1NBRUY7SUFFSCxDQUFDO0lBRUQsUUFBUTtRQUVOLElBQUksT0FBTyxHQUFjLElBQUksQ0FBQztRQUU5QixPQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFFdEMsT0FBTyxHQUFVLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUVsQztRQUVELE9BQVksT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxLQUFLO1FBRTFCLElBQUcsTUFBTSxFQUFFO1lBRVQsS0FBSSxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBRXBDLEtBQUssQ0FBQyxDQUFPLE9BQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7YUFFM0M7WUFFRCxPQUFPO1NBQ1I7UUFFRCxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBRTVCLE1BQVcsSUFBSSxDQUFDO1lBRWhCLE9BQU87U0FFUjtRQUVELEtBQUksTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBRTFDLEtBQUssQ0FBQyxDQUFNLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7U0FFeEM7SUFFSCxDQUFDO0lBRUQsUUFBUTtRQUVOLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTlCLENBQUM7SUFFRCxPQUFPO1FBRUwsT0FBTyxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFckUsQ0FBQztDQUVGO0FBdmNELDBCQXVjQyJ9