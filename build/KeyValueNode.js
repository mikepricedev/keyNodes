"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5VmFsdWVOb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0tleVZhbHVlTm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsdUNBQW1EO0FBRW5ELE1BQU0sZUFBZSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUMvQyxNQUFNLGFBQWEsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDN0MsTUFBTSxZQUFZLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQzVDLE1BQU0sTUFBTSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUV0QyxNQUFxQixZQUluQixTQUFRLGlCQUFvQjtJQWtCNUIsWUFBWSxHQUFxQyxFQUFFLEtBQWEsRUFDOUQsZ0JBQWlEO1FBRWpELEtBQUssQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQWxCZCxRQUFRLEdBQVksRUFBRSxDQUFDO1FBQ2hDLFFBQWlCLEdBQVUsQ0FBQyxDQUFDO1FBQzdCLFFBQWMsR0FDcEIsT0FBTyxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssUUFBUTtZQUM1QyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoRSxRQUFlLEdBQVUsTUFBTSxFQUFFLENBQUM7UUFleEMsSUFBRyxHQUFHLFlBQVksWUFBWSxFQUFFO1lBRTlCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FFbkM7YUFBTTtZQUVMLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FFMUI7SUFFSCxDQUFDO0lBRUQsV0FBVztJQUNYLElBQUksS0FBSztRQUVQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBRTdDLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFZO1FBRXBCLHFDQUFxQztRQUNyQyxJQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUU7WUFFaEQsT0FBTztTQUVSO1FBRUQsSUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBRS9CLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDeEIsT0FBTztTQUVSO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBRS9CLGtDQUFrQztRQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpCLHVCQUF1QjtRQUN2QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7WUFDeEIsT0FBTztTQUNSO1FBRUQsK0RBQStEO1FBQy9ELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6RSxJQUFHLFdBQVcsR0FBRyxDQUFDLEVBQUU7WUFFbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FFckM7UUFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFFbEQsQ0FBQztJQUVELElBQUksV0FBVztRQUViLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTVCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxXQUFXLENBQUMsV0FBNEI7UUFFMUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxPQUFPLFdBQVcsS0FBSyxRQUFRO2VBQy9DLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBRTNDLDJFQUEyRTtRQUMzRSxJQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxlQUFlLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUN4RSxPQUFPO1NBQ1I7UUFFRCxJQUFHLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUV6QywrREFBK0Q7WUFDL0QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXZFLG9EQUFvRDtZQUNwRCxJQUFHLFdBQVcsR0FBRyxDQUFDLEVBQUU7Z0JBRWxCLG1FQUFtRTtnQkFDbkUsOENBQThDO2dCQUM5QyxPQUFNLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFO29CQUVwRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO2lCQUV6QjtnQkFFRCwrREFBK0Q7Z0JBQy9ELGFBQWE7Z0JBQ2IsT0FBTSxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBRXZCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztpQkFFcEI7Z0JBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDO2FBRWhDO1lBR0gsZ0NBQWdDO1lBQ2hDLHdFQUF3RTtZQUN4RSxxQ0FBcUM7U0FDcEM7YUFBTSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBRWpDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztTQUVoQztJQUVILENBQUM7SUFTRCxRQUFRLENBQ04sUUFBeUQsRUFDekQsS0FBa0I7UUFHbEIsT0FBTyxJQUFJLFlBQVksQ0FDVCxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVoRSxDQUFDO0lBUUQsVUFBVSxDQUNSLFVBQWlFLEVBQ2pFLEtBQW9CO1FBR3BCLE9BQU8sSUFBSSxZQUFZLENBQ1AsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFdEUsQ0FBQztJQUVELElBQUk7UUFFRixJQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFFOUIsT0FBTyxLQUFLLENBQUM7U0FFZDtRQUVELElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO1FBRXhCLE9BQU8sSUFBSSxDQUFDO0lBRWQsQ0FBQztJQUVELElBQUk7UUFFRixJQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUVwRCxPQUFPLEtBQUssQ0FBQztTQUVkO1FBRUQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7UUFFeEIsT0FBTyxJQUFJLENBQUM7SUFFZCxDQUFDO0lBRUQsT0FBTyxDQUFDLFlBQTZDLE1BQU07UUFJekQsc0NBQXNDO1FBQ3RDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV6QyxPQUFPLElBQUksc0NBQXNDLENBQUMsU0FBUyxFQUN6RCxTQUFTLEtBQUssTUFBTSxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ3JFLENBQUMsS0FBWSxFQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxFQUN2RSxHQUFFLEVBQUUsQ0FBQSxJQUFJLENBQUMsdUJBQXVCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUVwRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLG1CQUFtQixDQUFDLEtBQVksRUFBRSxZQUFtQjtRQUU3RCxJQUFHLFlBQVksS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFFdkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUU5QixPQUFPLElBQUksQ0FBQztTQUViO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFFZixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ08sdUJBQXVCLENBQUMsWUFBbUI7UUFFbkQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssS0FBSyxJQUFJLFlBQVksS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQ3pFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVuQixDQUFDO0lBSUQ7Ozs7O09BS0c7SUFDSCxNQUFNLEtBQUssV0FBVztRQUVwQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUU1QixDQUFDO0lBRUQsTUFBTSxLQUFLLFdBQVcsQ0FBQyxXQUE0QjtRQUVqRCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsT0FBTyxXQUFXLEtBQUssUUFBUTtlQUMvQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUU3QyxDQUFDOztBQS9SSCwrQkFpU0M7S0ExUm1CLE1BQU0sT0FDZixlQUFlLE9BQ2YsWUFBWSxPQUdaLGFBQWEsT0FnUU4sWUFBWTtBQUFiLGdCQUFjLEdBQXFCLEtBQUssQ0FBQztBQXVCMUQsTUFBTSxjQUFjLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQzlDLE1BQU0sU0FBUyxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUN6QyxNQUFNLFVBQVUsR0FBaUIsTUFBTSxFQUFFLENBQUM7QUFDMUMsTUFBTSxRQUFRLEdBQWlCLE1BQU0sRUFBRSxDQUFDO0FBQ3hDLE1BQU0sVUFBVSxHQUFpQixNQUFNLEVBQUUsQ0FBQztBQUkxQyxNQUFhLGlDQUFpQztJQU01QyxZQUFZLEtBQVksRUFBRSxHQUFlO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBRXRCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFFL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsR0FBRztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBMUJELDhFQTBCQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxzQ0FBc0M7SUFXakQsWUFBWSxTQUEwQyxFQUFFLFVBQWlCLEVBQ3ZFLE1BQWUsRUFBRSxHQUEyQixFQUFFLE9BQW1CO1FBR2pFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLFVBQVUsSUFBSSxNQUFNLENBQUMsTUFBTTtlQUN0RCxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUV4QixDQUFDO0lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFFdEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUUvQixDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQUcsSUFBVTtRQUdoQixJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUU7WUFFbEQsNkJBQTZCO1lBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFdkIsT0FBTyxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBQyxDQUFDO1NBRXJDO1FBRUQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFNUMsTUFBTSxNQUFNLEdBQ1o7WUFDRSxLQUFLLEVBQUUsSUFBSSxpQ0FBaUMsQ0FDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQ2xDLEdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3JELElBQUksRUFBQyxLQUFLO1NBQ1gsQ0FBQztRQUVGLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVyRSxPQUFPLE1BQU0sQ0FBQztJQUVsQixDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBRUY7QUFqRUQsd0ZBaUVDIn0=