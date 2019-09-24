import KeyNode, { IprivateIniArgs } from './KeyNode';
declare const VALUES: unique symbol;
declare const CUR_VALUE_INDEX: unique symbol;
declare const KEEP_HISTORY: unique symbol;
declare const HISTORY_EPOCH: unique symbol;
export default class KeyValueNode<Tkey extends string | number = string | number, Tvalue = any, Tself extends KeyValueNode = KeyValueNode<string | number, any, any>> extends KeyNode<Tkey, Tself> {
    private readonly [VALUES];
    private [CUR_VALUE_INDEX];
    private [KEEP_HISTORY];
    private [HISTORY_EPOCH];
    constructor(key: KeyValueNode<Tkey, Tvalue>, value?: undefined, _privateIniArgs_?: Partial<IprivateIniArgs<Tself>>);
    constructor(key: Tkey, value?: Tvalue, _privateIniArgs_?: Partial<IprivateIniArgs<Tself>>);
    value: Tvalue;
    /**
    * Overrides default history conditions for this [[KeyValueNode]] instance.
    * Set `true` to keep all set values, `false` to keep no
    * historical values, or a `number` indicating the number historical values
    * to keep.
    */
    keepHistory: boolean | number;
    addChild<Tchildvalue, TchildKey extends string | number>(childKey: KeyValueNode<TchildKey, Tchildvalue>): KeyValueNode<TchildKey, Tchildvalue>;
    addChild<Tchildvalue, TchildKey extends string | number>(childKey: TchildKey, value?: Tchildvalue): KeyValueNode<TchildKey, Tchildvalue>;
    addSibling<Tsiblingvalue, TsiblingKey extends string | number>(siblingKey: KeyValueNode<TsiblingKey, Tsiblingvalue>): KeyValueNode<TsiblingKey, Tsiblingvalue>;
    addSibling<Tsiblingvalue, TsiblingKey extends string | number>(siblingKey: TsiblingKey, value?: Tsiblingvalue): KeyValueNode<TsiblingKey, Tsiblingvalue>;
    undo(): boolean;
    redo(): boolean;
    /**
     * Historical values set via [[KeyValueNode.value]]
     */
    history(direction?: TkeyValueNodeHistoricalDirection): KeyValueNodeHistoricalIterableIterator<Tvalue>;
    /**
     * Provides hook for derived classes to be notified when value is updated by
     * an historical undo or redo action, reference [[KeyValueNode.history]] for
     * context. *NOTE:* when overriding, *MUST* call `super._setHistoricalValue`
     * and pass through args.
     */
    protected _setHistoricalValue(index: number, historyEpoch: symbol): boolean;
    /**
     * Provides hook for derived classes. Reference [[KeyValueNode.history]] for
     * context. *NOTE:* when overriding,  *MUST* call
     * `super._historyIteratorIsValid` and pass through args.
     */
    protected _historyIteratorIsValid(historyEpoch: symbol): boolean;
    private static [KEEP_HISTORY];
    /**
     * Sets default history conditions for all [[KeyValueNode]] instances.
     * Individual instances can override this default.
     * Set `true` to keep all set values, `false` to keep no
     * historical values, or a `number` indicating the number historical values
     * to keep per [[KeyValueNode]] instance.
     */
    static keepHistory: boolean | number;
}
declare const HIST_DIRECTION: unique symbol;
declare const HIST_DONE: unique symbol;
declare const HIST_INDEX: unique symbol;
declare const HIST_SET: unique symbol;
declare const HIST_VALID: unique symbol;
export declare type TkeyValueNodeHistoricalDirection = 'undo' | 'redo';
export declare class KeyValueNodeHistoricalResultValue<Tvalue> {
    readonly value: Tvalue;
    private readonly [HIST_SET];
    constructor(value: Tvalue, set: () => boolean);
    /**
     * Returns `true` if historical value was successfully set.
     */
    set(): boolean;
}
/**
 * IterableIterator of historical values returned from [[KeyValueNode.history]]
 */
export declare class KeyValueNodeHistoricalIterableIterator<Tvalue> implements IterableIterator<KeyValueNodeHistoricalResultValue<Tvalue>> {
    private readonly [HIST_DIRECTION];
    private [HIST_DONE];
    private [HIST_INDEX];
    private readonly [HIST_SET];
    private readonly [HIST_VALID];
    private readonly [VALUES];
    constructor(direction: TkeyValueNodeHistoricalDirection, startIndex: number, values: Tvalue[], set: (index: number) => boolean, isValid: () => boolean);
    next(...args: any[]): IteratorResult<KeyValueNodeHistoricalResultValue<Tvalue>>;
    [Symbol.iterator](): KeyValueNodeHistoricalIterableIterator<Tvalue>;
}
export {};
