"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
const KeyNode_1 = require("./KeyNode");
const VALUES = Symbol();
const CUR_VALUE_INDEX = Symbol();
const KEEP_HISTORY = Symbol();
const HISTORY_EPOCH = Symbol();
class KeyValueNode extends KeyNode_1.default {
    constructor(key, value, _privateIniArgs_) {
        super(key, _privateIniArgs_);
        this[_a] = [];
        this[_b] = 0;
        this[_c] = typeof KeyValueNode[KEEP_HISTORY] === 'number' &&
            KeyValueNode[KEEP_HISTORY] < 1 ? false : KeyValueNode[KEEP_HISTORY];
        this[_d] = Symbol();
        this[VALUES].push(key instanceof KeyValueNode ? key.value : value);
    }
    //Accessors
    get value() {
        return this[VALUES][this[CUR_VALUE_INDEX]];
    }
    set value(value) {
        this[HISTORY_EPOCH] = Symbol();
        if (this[KEEP_HISTORY] === false) {
            this[VALUES][0] = value;
            return;
        }
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
     * Overrides default history conditions for this [[KeyValueNode]] instance.
     * Set `true` to keep all set values, `false` to keep no
     * historical values, or a `number` indicating the number historical values
     * to keep.
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
            this[VALUES][0] = this[VALUES][CUR_VALUE_INDEX];
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
    /**
     * Historical values set via [[KeyValueNode.value]]
     */
    history(direction = 'undo') {
        // Capture history history epoch state
        const historyEpoch = this[HISTORY_EPOCH];
        return new KeyValueNodeHistoricalIterableIterator(direction, direction === 'undo' ? this[CUR_VALUE_INDEX] - 1 : this[CUR_VALUE_INDEX] + 1, this[VALUES], (index) => this._setHistoricalValue(index, historyEpoch), () => this._historyIteratorIsValid(historyEpoch));
    }
    /**
     * Provides hook for derived classes to be notified when value is updated by
     * an historical undo or redo action, reference [[KeyValueNode.history]] for
     * context. *NOTE:* when overriding, *MUST* call `super._setHistoricalValue`
     * and pass through args.
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
     * context. *NOTE:* when overriding,  *MUST* call
     * `super._historyIteratorIsValid` and pass through args.
     */
    _historyIteratorIsValid(historyEpoch) {
        return this[KEEP_HISTORY] === false || historyEpoch !== this[HISTORY_EPOCH]
            ? false : true;
    }
    /**
     * Sets default history conditions for all [[KeyValueNode]] instances.
     * Individual instances can override this default.
     * Set `true` to keep all set values, `false` to keep no
     * historical values, or a `number` indicating the number historical values
     * to keep per [[KeyValueNode]] instance.
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
    /**
     * Returns `true` if historical value was successfully set.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5VmFsdWVOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0tleVZhbHVlTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsdUNBQW1EO0FBRW5ELE1BQU0sTUFBTSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUN0QyxNQUFNLGVBQWUsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDL0MsTUFBTSxZQUFZLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQzVDLE1BQU0sYUFBYSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUU3QyxNQUFxQixZQUluQixTQUFRLGlCQUFvQjtJQWM1QixZQUFZLEdBQXFDLEVBQUUsS0FBYSxFQUM5RCxnQkFBaUQ7UUFFakQsS0FBSyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBZGQsUUFBUSxHQUFZLEVBQUUsQ0FBQztRQUNoQyxRQUFpQixHQUFVLENBQUMsQ0FBQztRQUM3QixRQUFjLEdBQ3BCLE9BQU8sWUFBWSxDQUFDLFlBQVksQ0FBQyxLQUFLLFFBQVE7WUFDNUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEUsUUFBZSxHQUFVLE1BQU0sRUFBRSxDQUFDO1FBV3hDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxZQUFZLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFckUsQ0FBQztJQUVELFdBQVc7SUFDWCxJQUFJLEtBQUs7UUFFUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUU3QyxDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsS0FBWTtRQUVwQixJQUFJLENBQUMsYUFBYSxDQUFD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