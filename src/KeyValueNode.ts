import KeyNode, {IprivateIniArgs} from './KeyNode';

const VALUES:unique symbol = Symbol();
const CUR_VALUE_INDEX:unique symbol = Symbol();
const KEEP_HISTORY:unique symbol = Symbol();
const HISTORY_EPOCH:unique symbol = Symbol();

export default class KeyValueNode <
  Tkey extends string | number = string | number,
  Tvalue = any,
  Tself extends KeyValueNode = KeyValueNode<string | number, any, any>>
  extends KeyNode<Tkey, Tself>
{

  private readonly [VALUES]:Tvalue[] = [];
  private [CUR_VALUE_INDEX]:number = 0;
  private [KEEP_HISTORY]: number | boolean = 
    typeof KeyValueNode[KEEP_HISTORY] === 'number' &&
      KeyValueNode[KEEP_HISTORY] < 1 ? false : KeyValueNode[KEEP_HISTORY];
  private [HISTORY_EPOCH]:symbol = Symbol(); 

  constructor(key:KeyValueNode<Tkey, Tvalue>, value?:undefined,
    _privateIniArgs_?:Partial<IprivateIniArgs<Tself>>);
  constructor(key:Tkey, value?:Tvalue,
    _privateIniArgs_?:Partial<IprivateIniArgs<Tself>>);
  constructor(key:Tkey | KeyValueNode<Tkey, Tvalue>, value?:Tvalue,
    _privateIniArgs_?:Partial<IprivateIniArgs<Tself>>) {

    super(key, _privateIniArgs_);
    
    this[VALUES].push(key instanceof KeyValueNode ? key.value : value);

  }

  //Accessors
  get value():Tvalue {
    
    return this[VALUES][this[CUR_VALUE_INDEX]];
  
  }

  set value(value:Tvalue) {

    this[HISTORY_EPOCH] = Symbol();

    if(this[KEEP_HISTORY] === false) {
      
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
    const deleteCount = this[VALUES].length - <number>this[KEEP_HISTORY] - 1;

    if(deleteCount > 0) {
      
      this[VALUES].splice(0, deleteCount);

    }

    this[CUR_VALUE_INDEX] = this[VALUES].length - 1;

  }

  get keepHistory():boolean | number {
    
    return this[KEEP_HISTORY];
  
  }

  /**
   * Overrides default history conditions for this [[KeyValueNode]] instance.
   * Set `true` to keep all set values, `false` to keep no
   * historical values, or a `number` indicating the number historical values 
   * to keep.
   */
  set keepHistory(keepHistory:boolean | number) {

    const prevKeepHistory = this[KEEP_HISTORY];

    this[KEEP_HISTORY] = typeof keepHistory === 'number'
      && keepHistory < 1 ? false : keepHistory;

      // Change does not require historical values modification nor epoch update.
    if(this[KEEP_HISTORY] === prevKeepHistory || this[KEEP_HISTORY] === true) {
      return;
    }

    if(typeof this[KEEP_HISTORY] === 'number') {
      
      // Sub 1 to keep history count to account for the current value
      let deleteCount = this[VALUES].length - <number>this[KEEP_HISTORY] - 1;

      // Change require values modification and new epoch.
      if(deleteCount > 0) {

        // Remove items from the front of the values array until the delete
        // count is 0 or the current value index is 0.
        while(this[CUR_VALUE_INDEX] > 0 && deleteCount-- > 0) {

          this[VALUES].shift();
          this[CUR_VALUE_INDEX]--;
          
        }

        // Remove values from the end of the values array until delete 
        // count is 0
        while(deleteCount-- > 0) {

          this[VALUES].pop();

        }

        this[HISTORY_EPOCH] = Symbol();

      }
      
      
    // this[KEEP_HISTORY] === false 
    // If more than one value is being stored in values array Change require
    // values modification and new epoch.
    } else if(this[VALUES].length > 1) { 

      this[VALUES][0] = this[VALUES][CUR_VALUE_INDEX];
      this[VALUES].splice(1);
      this[HISTORY_EPOCH] = Symbol();

    }
  
  }

  //Methods
  addChild<Tchildvalue, TchildKey extends string | number>(
    childKey:KeyValueNode<TchildKey, Tchildvalue>)
      :KeyValueNode<TchildKey, Tchildvalue>;
  addChild<Tchildvalue, TchildKey extends string | number>(
    childKey:TchildKey,
    value?:Tchildvalue):KeyValueNode<TchildKey, Tchildvalue>;
  addChild<Tchildvalue, TchildKey extends string | number>(
    childKey:TchildKey | KeyValueNode<TchildKey, Tchildvalue>,
    value?:Tchildvalue):KeyValueNode<TchildKey, Tchildvalue>
  {

    return new KeyValueNode<TchildKey, Tchildvalue>
      (<TchildKey>childKey, value, this._privateIniArgs('child'));

  }

  addSibling<Tsiblingvalue, TsiblingKey extends string | number>(
    siblingKey:KeyValueNode<TsiblingKey, Tsiblingvalue>)
      :KeyValueNode<TsiblingKey, Tsiblingvalue>;
  addSibling<Tsiblingvalue, TsiblingKey extends string | number>(
    siblingKey:TsiblingKey,
    value?:Tsiblingvalue):KeyValueNode<TsiblingKey, Tsiblingvalue>;
  addSibling<Tsiblingvalue, TsiblingKey extends string | number>(
    siblingKey:TsiblingKey | KeyValueNode<TsiblingKey, Tsiblingvalue>,
    value?:Tsiblingvalue):KeyValueNode<TsiblingKey, Tsiblingvalue>
  {

    return new KeyValueNode<TsiblingKey, Tsiblingvalue>
      (<TsiblingKey>siblingKey, value, this._privateIniArgs('sibling'));

  }

  undo():boolean {

    if(this[CUR_VALUE_INDEX] === 0) {

      return false;

    }

    this[CUR_VALUE_INDEX]--;

    return true;

  }

  redo():boolean {

    if(this[CUR_VALUE_INDEX] + 1 === this[VALUES].length) {

      return false;

    }

    this[CUR_VALUE_INDEX]++;

    return true;

  }

  /**
   * Historical values set via [[KeyValueNode.value]]
   */
  history(direction:TkeyValueNodeHistoricalDirection = 'undo'):
    KeyValueNodeHistoricalIterableIterator<Tvalue> 
  {

    // Capture history history epoch state
    const historyEpoch = this[HISTORY_EPOCH];

    return new KeyValueNodeHistoricalIterableIterator(direction,
      direction === 'undo' ? this[CUR_VALUE_INDEX] - 1 : this[CUR_VALUE_INDEX] + 1, this[VALUES],
      (index:number):boolean => this._setHistoricalValue(index, historyEpoch),
      ()=>this._historyIteratorIsValid(historyEpoch));

  }

  /**
   * Provides hook for derived classes to be notified when value is updated by
   * an historical undo or redo action, reference [[KeyValueNode.history]] for
   * context. *NOTE:* when overriding, *MUST* call `super._setHistoricalValue`
   * and pass through args.
   */
  protected _setHistoricalValue(index:number, historyEpoch:symbol):boolean {

    if(historyEpoch === this[HISTORY_EPOCH]) {
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
  protected _historyIteratorIsValid(historyEpoch:symbol):boolean {
    
    return this[KEEP_HISTORY] === false || historyEpoch !== this[HISTORY_EPOCH] 
      ? false : true;
  
  }

  private static [KEEP_HISTORY]: number | boolean = false;

  /**
   * Sets default history conditions for all [[KeyValueNode]] instances.
   * Individual instances can override this default.
   * Set `true` to keep all set values, `false` to keep no
   * historical values, or a `number` indicating the number historical values 
   * to keep per [[KeyValueNode]] instance.
   */
  static get keepHistory():boolean | number {
  
    return this[KEEP_HISTORY];
  
  }

  static set keepHistory(keepHistory:boolean | number) {

    this[KEEP_HISTORY] = typeof keepHistory === 'number'
      && keepHistory < 1 ? false : keepHistory;

  }



}

const HIST_DIRECTION:unique symbol = Symbol();
const HIST_DONE:unique symbol = Symbol();
const HIST_INDEX:unique symbol = Symbol();
const HIST_SET:unique symbol = Symbol();
const HIST_VALID:unique symbol = Symbol();

export type TkeyValueNodeHistoricalDirection = 'undo' | 'redo';

export class KeyValueNodeHistoricalResultValue<Tvalue> {
  
  private readonly [HIST_SET]:()=>boolean;
  
  constructor(readonly value:Tvalue, set:()=>boolean) {
    this[HIST_SET] = set;
  }
  
  /**
   * Returns `true` if historical value was successfully set.
   */
  set():boolean {
    return this[HIST_SET]();
  }
}

/**
 * IterableIterator of historical values returned from [[KeyValueNode.history]]
 */
export class KeyValueNodeHistoricalIterableIterator<Tvalue>
  implements IterableIterator<KeyValueNodeHistoricalResultValue<Tvalue>> 
{

  private readonly [HIST_DIRECTION]:TkeyValueNodeHistoricalDirection;
  private [HIST_DONE]:boolean;
  private [HIST_INDEX]:number;
  private readonly [HIST_SET]:(index:number)=>boolean;
  private readonly [HIST_VALID]:()=> boolean;
  private readonly [VALUES]:Tvalue[];

  constructor(direction:TkeyValueNodeHistoricalDirection, startIndex:number,
    values:Tvalue[], set:(index:number)=>boolean, isValid:()=>boolean)
  {

    this[HIST_DONE] = !isValid() || startIndex >= values.length 
      || startIndex < 0;
    this[HIST_DIRECTION] = direction;
    this[HIST_INDEX] = startIndex;
    this[HIST_SET] = set;
    this[HIST_VALID] = isValid;
    this[VALUES] = values;
  
  }

  next(...args:any[]):IteratorResult<KeyValueNodeHistoricalResultValue<Tvalue>> {

    if(this[HIST_DONE] || this[HIST_VALID]() === false) {
      
      // Insure [HIST_DONE] is true
      this[HIST_DONE] = true;
      
      return {value:undefined, done:true};

    }

    const historicalValueIndex = this[HIST_INDEX];

      const result = <IteratorResult<KeyValueNodeHistoricalResultValue<Tvalue>>>
      {
        value: new KeyValueNodeHistoricalResultValue(
          this[VALUES][historicalValueIndex], 
          ():boolean => this[HIST_SET](historicalValueIndex)),
        done:false
      };

      // Increment or decrement history index and check if done
      this[HIST_DONE] = this[HIST_DIRECTION] === 'undo' ?
        --this[HIST_INDEX] < 0 : ++this[HIST_INDEX] >= this[VALUES].length;
      
      return result;

  }

  [Symbol.iterator]():KeyValueNodeHistoricalIterableIterator<Tvalue>  {
    return this;
  }

}