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
        if (this[PARENT] === null ? this[ROOT_KEY_NODES].has(keyStr) :
            this[PARENT][CHILDREN].has(keyStr)) {
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
        this[KEY_TYPE] = typeof this[KEY] === 'string' ? 'key' : 'index';
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
     * @remarks
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
     * @remarks When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] helps with override implementation.
     */
    addSibling(siblingKey) {
        return new KeyNode(siblingKey, this._privateIniArgs('sibling'));
    }
    removeSibling(siblingKey) {
        const siblingKeyLiteral = siblingKey.toString();
        if (this.hasSibling(siblingKey) === false) {
            return false;
        }
        else if (this.parent === null) {
            return this[ROOT_KEY_NODES].delete(siblingKeyLiteral);
        }
        else {
            return this[PARENT][CHILDREN].delete(siblingKeyLiteral);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5Tm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9LZXlOb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSw2Q0FBNkM7QUFDN0MsaURBQXlDO0FBQ3pDLGlEQUEwQztBQUUxQyxNQUFNLFFBQVEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDeEMsTUFBTSxLQUFLLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ3JDLE1BQU0sR0FBRyxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUNuQyxNQUFNLFFBQVEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDeEMsTUFBTSxNQUFNLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ3RDLE1BQU0sYUFBYSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUM3QyxNQUFNLFFBQVEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDeEMsTUFBTSxjQUFjLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBTzlDOzs7O0dBSUc7QUFDSCxNQUFxQixPQUdqQixTQUFRLE1BQU07SUFZaEI7OztPQUdHO0lBQ0gsWUFBWSxHQUF3QixFQUNsQyxtQkFDQSxFQUFDLFFBQVEsRUFBQyxJQUFJLEVBQUUsY0FBYyxFQUFDLElBQUksR0FBRyxFQUFFLEVBQUM7UUFJekMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBbkJQLFFBQVUsR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQztRQXFCckQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FBQztRQUV2RCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUNwQztZQUVFLE1BQU0sSUFBSSxzQkFBWSxDQUFVLElBQUksTUFBTSxrQ0FBa0M7Z0JBQzVFLHdDQUF3QyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUVwRTtRQUVELHlFQUF5RTtRQUN6RSw0RUFBNEU7UUFDNUUsNENBQTRDO1FBQzVDLElBQUcsR0FBRyxZQUFZLE9BQU8sRUFBRTtZQUV6QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUVwQixLQUFJLE1BQU0sU0FBUyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFFckMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUUxQjtTQUVGO2FBQU07WUFFTCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBRWpCO1FBRUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFFakUsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBRXhCLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFPLElBQUksQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FFakI7YUFBTTtZQUVMLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUV0QztJQUVILENBQUM7SUFFRCxXQUFXO0lBQ1gsSUFBSSxNQUFNO1FBRVIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdEIsQ0FBQztJQUVELElBQUksR0FBRztRQUVMLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRW5CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxJQUFJLE9BQU87UUFFVCxLQUFJLE1BQU0sVUFBVSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUV2QyxJQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUU7Z0JBRWpDLE9BQU8sS0FBSyxDQUFDO2FBRWQ7U0FFRjtRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXhCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksT0FBTztRQUVULFlBQVk7UUFDWixJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUM7WUFFOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FFaEQ7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV4QixDQUFDO0lBRUQsSUFBSSxTQUFTO1FBRVgsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDO0lBRS9CLENBQUM7SUFFRCxJQUFJLGFBQWE7UUFFZixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO0lBRW5DLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFFYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFN0IsQ0FBQztJQUVELElBQUksS0FBSztRQUVQLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksSUFBSTtRQUVOLFlBQVk7UUFDWixJQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxTQUFTLEVBQUM7WUFFbkMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksdUJBQVksQ0FBQyxRQUFRLENBQUM7Z0JBQzlDLEtBQUksTUFBTSxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFDO29CQUNwQyxNQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDMUI7WUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FFZjtRQUVELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRTdCLENBQUM7SUFFRCxJQUFJLE9BdEtjLFFBQVEsRUFzS3JCLE1BQU0sQ0FBQyxXQUFXLEVBQUM7UUFFdEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUUvQixDQUFDO0lBR0QsU0FBUztJQUNUOzs7OztPQUtHO0lBQ08sZUFBZSxDQUFDLFFBQTRCO1FBR3BELE9BQU87WUFDTCxRQUFRLEVBQUUsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3pELGNBQWMsRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3BDLENBQUM7SUFFSixDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQXdCO1FBRS9CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUVqRCxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQXdCO1FBRS9CLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEMsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFFOUUsQ0FBQztJQUVEOzs7T0FHRztJQUNILFFBQVEsQ0FDTixRQUF1QztRQUd2QyxPQUFPLElBQUksT0FBTyxDQUFZLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFekUsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUF3QjtRQUVsQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFcEQsQ0FBQztJQUVELFVBQVUsQ0FBQyxVQUEwQjtRQUVuQyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoRCxJQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxpQkFBaUIsRUFBQztZQUV2QyxPQUFPLEtBQUssQ0FBQztTQUVkO2FBQU0sSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBRS9CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBRXBEO2FBQU07WUFFTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUV0RDtJQUVILENBQUM7SUFFRCxVQUFVLENBQUMsVUFBMEI7UUFFbkMsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFaEQsSUFBRyxpQkFBaUIsS0FBSyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUM7WUFFdkMsT0FBTyxJQUFJLENBQUM7U0FFYjtRQUVELElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTtZQUV4QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUV0RDthQUFNO1lBRUwsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FFL0Q7SUFFSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsVUFBVSxDQUNSLFVBQTZDO1FBRzdDLE9BQU8sSUFBSSxPQUFPLENBQWMsVUFBVSxFQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFckMsQ0FBQztJQUVELGFBQWEsQ0FBQyxVQUEwQjtRQUV0QyxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoRCxJQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBRXhDLE9BQU8sS0FBSyxDQUFDO1NBRWQ7YUFBTSxJQUFHLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1lBRTlCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1NBRXREO2FBQU07WUFFTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUV6RDtJQUVILENBQUM7SUFFRCxRQUFRO1FBRU4sT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFFakMsQ0FBQztJQUVELENBQUMsT0FBTztRQUVOLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4QixPQUFNLElBQUksS0FBSyxJQUFJLEVBQUM7WUFFbEIsTUFBTSxJQUFJLENBQUM7WUFFWCxJQUFJLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBRTVCO0lBRUgsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSTtRQUUzQixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUM7WUFFdkIsSUFBRyxXQUFXLEVBQUM7Z0JBRWIsTUFBVyxJQUFJLENBQUM7YUFFakI7WUFFRCxPQUFPO1NBRVI7UUFFRCxLQUFLLENBQUMsQ0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXpDLElBQUcsV0FBVyxFQUFDO1lBRWIsTUFBVyxJQUFJLENBQUM7U0FFakI7SUFFSCxDQUFDO0lBRUQsQ0FBQyxRQUFRO1FBRVAsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFNLElBQUksQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTFELEtBQUksTUFBTSxPQUFPLElBQUksWUFBWSxFQUFDO1lBRWhDLElBQUcsT0FBTyxLQUFLLElBQUksRUFBQztnQkFFbEIsTUFBYSxPQUFPLENBQUM7YUFFdEI7U0FFRjtJQUVILENBQUM7SUFFRCxRQUFRO1FBRU4sSUFBSSxPQUFPLEdBQWMsSUFBSSxDQUFDO1FBRTlCLE9BQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUV0QyxPQUFPLEdBQVUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBRWxDO1FBRUQsT0FBWSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDL0MsQ0FBQztDQUVGO0FBbFlELDBCQWtZQztBQUVELElBQUksSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDcEIsSUFBSSxJQUFzQixDQUFDIn0=