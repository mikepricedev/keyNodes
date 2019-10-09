"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
const KeyNode_1 = require("./KeyNode");
const CUR_VALUE_INDEX = Symbol();
const HISTORY_EPOCH = Symbol();
const KEEP_HISTORY = Symbol();
const VALUES = Symbol();
class KeyValueNode extends KeyNode_1.default {
    constructor(key, value, _privateIniArgs_) {
        super(key, _privateIniArgs_);
        this[_a] = [];
        this[_b] = 0;
        this[_c] = typeof KeyValueNode[KEEP_HISTORY] === 'number' &&
            KeyValueNode[KEEP_HISTORY] < 1 ? false : KeyValueNode[KEEP_HISTORY];
        this[_d] = Symbol();
        if (key instanceof KeyValueNode) {
            this[KEEP_HISTORY] = key[KEEP_HISTORY];
            this[CUR_VALUE_INDEX] = key[CUR_VALUE_INDEX];
            this[VALUES].push(...key[VALUES]);
        }
        else {
            this[VALUES].push(value);
        }
    }
    //Accessors
    get value() {
        return this[VALUES][this[CUR_VALUE_INDEX]];
    }
    set value(value) {
        // Do not update exactly equal values
        if (value === this[VALUES][this[CUR_VALUE_INDEX]]) {
            return;
        }
        if (this[KEEP_HISTORY] === false) {
            this[VALUES][0] = value;
            return;
        }
        this[HISTORY_EPOCH] = Symbol();
        // Overwrite forward history items
        this[VALUES].splice(this[CUR_VALUE_INDEX] + 1);
        this[VALUES].push(value);
        // No limits on history
        if (this[KEEP_HISTORY] === true) {
            this[CUR_VALUE_INDEX]++;
            return;
        }
        // Sub 1 to keep history count to account for the current value
        const deleteCount = this[VALUES].length - this[KEEP_HISTORY] - 1;
        if (deleteCount > 0) {
            this[VALUES].splice(0, deleteCount);
        }
        this[CUR_VALUE_INDEX] = this[VALUES].length - 1;
    }
    get keepHistory() {
        return this[KEEP_HISTORY];
    }
    /**
     * Overrides default history condition for this [[KeyValueNode]]. Set `true`
     * to keep all set values, `false` to keep no historical values, or set the
     * `number` of historical values to keep.
     */
    set keepHistory(keepHistory) {
        const prevKeepHistory = this[KEEP_HISTORY];
        this[KEEP_HISTORY] = typeof keepHistory === 'number'
            && keepHistory < 1 ? false : keepHistory;
        // Change does not require historical values modification nor epoch update.
        if (this[KEEP_HISTORY] === prevKeepHistory || this[KEEP_HISTORY] === true) {
            return;
        }
        if (typeof this[KEEP_HISTORY] === 'number') {
            // Sub 1 to keep history count to account for the current value
            let deleteCount = this[VALUES].length - this[KEEP_HISTORY] - 1;
            // Change require values modification and new epoch.
            if (deleteCount > 0) {
                // Remove items from the front of the values array until the delete
                // count is 0 or the current value index is 0.
                while (this[CUR_VALUE_INDEX] > 0 && deleteCount-- > 0) {
                    this[VALUES].shift();
                    this[CUR_VALUE_INDEX]--;
                }
                // Remove values from the end of the values array until delete 
                // count is 0
                while (deleteCount-- > 0) {
                    this[VALUES].pop();
                }
                this[HISTORY_EPOCH] = Symbol();
            }
            // this[KEEP_HISTORY] === false 
            // If more than one value is being stored in values array Change require
            // values modification and new epoch.
        }
        else if (this[VALUES].length > 1) {
            this[VALUES][0] = this[VALUES][this[CUR_VALUE_INDEX]];
            this[CUR_VALUE_INDEX] = 0;
            this[VALUES].splice(1);
            this[HISTORY_EPOCH] = Symbol();
        }
    }
    addChild(childKey, value) {
        return new KeyValueNode(childKey, value, this._privateIniArgs('child'));
    }
    addSibling(siblingKey, value) {
        return new KeyValueNode(siblingKey, value, this._privateIniArgs('sibling'));
    }
    undo() {
        if (this[CUR_VALUE_INDEX] === 0) {
            return false;
        }
        this[CUR_VALUE_INDEX]--;
        return true;
    }
    redo() {
        if (this[CUR_VALUE_INDEX] + 1 === this[VALUES].length) {
            return false;
        }
        this[CUR_VALUE_INDEX]++;
        return true;
    }
    history(direction = 'undo') {
        // Capture history history epoch state
        const historyEpoch = this[HISTORY_EPOCH];
        return new KeyValueNodeHistoricalIterableIterator(direction, direction === 'undo' ?
            this[CUR_VALUE_INDEX] - 1 : this[CUR_VALUE_INDEX] + 1, this[VALUES], (index) => this._setHistoricalValue(index, historyEpoch), () => this._historyIteratorIsValid(historyEpoch));
    }
    /**
     * Provides hook for derived classes to be notified when value is updated by
     * a historical undo or redo action, reference [[KeyValueNode.history]] for
     * context.
     * @note
     * When overriding, *MUST* call `super._setHistoricalValue` and pass through
     * args.
     */
    _setHistoricalValue(index, historyEpoch) {
        if (historyEpoch === this[HISTORY_EPOCH]) {
            this[CUR_VALUE_INDEX] = index;
            return true;
        }
        return false;
    }
    /**
     * Provides hook for derived classes. Reference [[KeyValueNode.history]] for
     * context.
     * @note
     * When overriding, *MUST* call `super._historyIteratorIsValid` and pass
     * through args.
     */
    _historyIteratorIsValid(historyEpoch) {
        return this[KEEP_HISTORY] === false || historyEpoch !== this[HISTORY_EPOCH]
            ? false : true;
    }
    /**
     * Sets default history conditions for all [[KeyValueNode]] instances.
     * Individual instances can override this default. Set `true` to keep all set
     * values, `false` to keep no historical values, or set the `number` of
     * historical values to keep per [[KeyValueNode]] instance.
     */
    static get keepHistory() {
        return this[KEEP_HISTORY];
    }
    static set keepHistory(keepHistory) {
        this[KEEP_HISTORY] = typeof keepHistory === 'number'
            && keepHistory < 1 ? false : keepHistory;
    }
}
exports.default = KeyValueNode;
_a = VALUES, _b = CUR_VALUE_INDEX, _c = KEEP_HISTORY, _d = HISTORY_EPOCH, _e = KEEP_HISTORY;
KeyValueNode[_e] = false;
const HIST_DIRECTION = Symbol();
const HIST_DONE = Symbol();
const HIST_INDEX = Symbol();
const HIST_SET = Symbol();
const HIST_VALID = Symbol();
class KeyValueNodeHistoricalResultValue {
    constructor(value, set) {
        this.value = value;
        this[HIST_SET] = set;
    }
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    /**
     * Returns `true` if historical value was successfully set.
     * @note
     * Setting a historical value via this method performs and undo or redo type
     * operation i.e. it does not utilize assignment.
     */
    set() {
        return this[HIST_SET]();
    }
}
exports.KeyValueNodeHistoricalResultValue = KeyValueNodeHistoricalResultValue;
/**
 * IterableIterator of historical values returned from [[KeyValueNode.history]]
 */
class KeyValueNodeHistoricalIterableIterator {
    constructor(direction, startIndex, values, set, isValid) {
        this[HIST_DONE] = !isValid() || startIndex >= values.length
            || startIndex < 0;
        this[HIST_DIRECTION] = direction;
        this[HIST_INDEX] = startIndex;
        this[HIST_SET] = set;
        this[HIST_VALID] = isValid;
        this[VALUES] = values;
    }
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
    next(...args) {
        if (this[HIST_DONE] || this[HIST_VALID]() === false) {
            // Insure [HIST_DONE] is true
            this[HIST_DONE] = true;
            return { value: undefined, done: true };
        }
        const historicalValueIndex = this[HIST_INDEX];
        const result = {
            value: new KeyValueNodeHistoricalResultValue(this[VALUES][historicalValueIndex], () => this[HIST_SET](historicalValueIndex)),
            done: false
        };
        // Increment or decrement history index and check if done
        this[HIST_DONE] = this[HIST_DIRECTION] === 'undo' ?
            --this[HIST_INDEX] < 0 : ++this[HIST_INDEX] >= this[VALUES].length;
        return result;
    }
    [Symbol.iterator]() {
        return this;
    }
}
exports.KeyValueNodeHistoricalIterableIterator = KeyValueNodeHistoricalIterableIterator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5VmFsdWVOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0tleVZhbHVlTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBbUQ7QUFFbkQsTUFBTSxlQUFlLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQy9DLE1BQU0sYUFBYSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUM3QyxNQUFNLFlBQVksR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDNUMsTUFBTSxNQUFNLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBRXRDLE1BQXFCLFlBSW5CLFNBQVEsaUJBQW9CO0lBa0I1QixZQUFZLEdBQXFDLEVBQUUsS0FBYSxFQUM5RCxnQkFBaUQ7UUFFakQsS0FBSyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBbEJkLFFBQVEsR0FBWSxFQUFFLENBQUM7UUFDaEMsUUFBaUIsR0FBVSxDQUFDLENBQUM7UUFDN0IsUUFBYyxHQUNwQixPQUFPLFlBQVksQ0FBQyxZQUFZLENBQUMsS0FBSyxRQUFRO1lBQzVDLFlBQVksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hFLFFBQWUsR0FBVSxNQUFNLEVBQUUsQ0FBQztRQWV4QyxJQUFHLEdBQUcsWUFBWSxZQUFZLEVBQUU7WUFFOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUVuQzthQUFNO1lBRUwsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENB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