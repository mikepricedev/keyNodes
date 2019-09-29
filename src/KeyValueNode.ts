import KeyNode, {IprivateIniArgs} from './KeyNode';

const VALUES:unique symbol = Symbol();
const CUR_VALUE_INDEX:unique symbol = Symbol();
const KEEP_HISTORY:unique symbol = Symbol();
const HISTORY_EPOCH:unique symbol = Symbol();
const NODES_AND_UPDATE_ORDER:unique symbol = Symbol();

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
  private [NODES_AND_UPDATE_ORDER]:(Tself | this)[];

  constructor(key:KeyValueNode<Tkey, Tvalue>, value?:undefined,
    _privateIniArgs_?:Partial<IprivateIniArgs<Tself>>);
  constructor(key:Tkey, value?:Tvalue,
    _privateIniArgs_?:Partial<IprivateIniArgs<Tself>>);
  constructor(key:Tkey | KeyValueNode<Tkey, Tvalue>, value?:Tvalue,
    _privateIniArgs_?:Partial<IprivateIniArgs<Tself>>) {

    super(key, _privateIniArgs_);

    this[VALUES].push(key instanceof KeyValueNode ? key.value : value);
    
    // Retrieve nodes and update order lib from parent
    if(this.parent !== null) {
      
      this[NODES_AND_UPDATE_ORDER] = <any>this.parent[NODES_AND_UPDATE_ORDER];
    
    //  Retrieve nodes and update order lib from sibling  
    } else if(this.numSiblings > 0) {

      for(const sibling of this.siblings()) {

        this[NODES_AND_UPDATE_ORDER] = <any>sibling[NODES_AND_UPDATE_ORDER];
        
        break;

      }
      
    // Create nodes and update order lib
    } else {
      
      this[NODES_AND_UPDATE_ORDER] = [];
      
    }

    // Add self to nodes and update order lib
    this[NODES_AND_UPDATE_ORDER].push(this);

  }

  //Accessors
  get value():Tvalue {
    
    return this[VALUES][this[CUR_VALUE_INDEX]];
  
  }

  set value(value:Tvalue) {

    this[HISTORY_EPOCH] = Symbol();

    this._logValueUpdate();

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
  /**
   * @note
   * Derived class methods that update the value, must call this method.
   */
  protected _logValueUpdate():void {

    this[NODES_AND_UPDATE_ORDER]
        .splice(this[NODES_AND_UPDATE_ORDER].indexOf(this), 1);

    this[NODES_AND_UPDATE_ORDER].push(this);

  }

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

  removeChild(childKey:string | number):boolean {

    const child = this.getChild(childKey);

    if(child !== null && super.removeChild(childKey)) {
      
      // All the child and child's descendants must be removed from the node
      // and update order lib.  Additional all the child and child's 
      // descendants must have their node and update order libs replaced with a
      // lib only containing themselves and in the order of update thus far.
      
      const childAndDecedentUpdateOrder: (Tself | this)[] = [];

      const nodesAndUpdateOrder = this[NODES_AND_UPDATE_ORDER]; 

      for(const childOrDecedent of child.updateOrder(false)) {

        childAndDecedentUpdateOrder.push(<any>childOrDecedent);

        childOrDecedent[NODES_AND_UPDATE_ORDER] = 
          childAndDecedentUpdateOrder;
        
          nodesAndUpdateOrder
            .splice(nodesAndUpdateOrder.indexOf(<any>childOrDecedent), 1);

      }

      // Correct the order of updates
      childAndDecedentUpdateOrder.reverse();

    }

    return false;

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

  removeSibling(siblingKey:string | number):boolean {

    const sibling = this.getSibling(siblingKey);

    if(sibling !== null && super.removeSibling(siblingKey)) {
      
      // All the sibling and sibling's descendants must be removed from the node
      // and update order lib.  Additional all the sibling and sibling's 
      // descendants must have their node and update order libs replaced with a
      // lib only containing themselves and in the order of update thus far.
      
      const siblingAndDecedentUpdateOrder: (Tself | this)[] = [];

      const nodesAndUpdateOrder = this[NODES_AND_UPDATE_ORDER]; 

      for(const siblingOrDecedent of sibling.updateOrder(false)) {

        siblingAndDecedentUpdateOrder.push(<any>siblingOrDecedent);

        siblingOrDecedent[NODES_AND_UPDATE_ORDER] = 
          siblingAndDecedentUpdateOrder;
        
          nodesAndUpdateOrder
            .splice(nodesAndUpdateOrder.indexOf(<any>siblingOrDecedent), 1);

      }

      // Correct the order of updates
      siblingAndDecedentUpdateOrder.reverse();

      return true;

    }

    return false;
    
  }

  undo():boolean {

    if(this[CUR_VALUE_INDEX] === 0) {

      return false;

    }

    this[CUR_VALUE_INDEX]--;
    
    this._logValueUpdate();

    return true;

  }

  redo():boolean {

    if(this[CUR_VALUE_INDEX] + 1 === this[VALUES].length) {

      return false;

    }

    this[CUR_VALUE_INDEX]++;

    this._logValueUpdate();

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
     
      this._logValueUpdate();
     
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
  
  //Static Methods
  /**
   * Generates document from the [[KeyValueNode]] including it's siblings 
   * (default), and all of the descendants recursively in update order;
   * most recent overriding latest.
   * @param includeSiblings pass `false` to exclude siblings.
   * @note
   * [[KeyValueNode]] de-couples Javascript object as reference behavior.  As a
   * consequence setting object values on non-terminal keys will not propagate
   * to decedent [[KeyValueNode]]s.  Additionally setting a decedent 
   * [[KeyValueNode]] more recent in historical order will override the object
   * value set on the ancestor [[KeyValueNode]] when calling
   * [[KeyValueNode.generateDoc]].  It is a best practice for most use cases to
   * only set values on terminal [[KeyValueNode]]s.
   */
  generateDoc(includeSiblings = true) {

    const {depth:startDepth} = this;

    // Create root doc
    let doc;
    if(includeSiblings) {

      doc = this.keyType === 'index' ? [] : {};

    } else if(this.keyType === 'key') {

      // When siblings are NOT included key type 'index' overrides are ignored.
      doc = typeof this.key === 'number' ? [] : {};

    } else {

      doc = [];

    }

    const buildList = new Set<this| Tself>();

    for(const keyValNodeToBuild of this.updateOrder(includeSiblings)) {
      
      if(buildList.has(keyValNodeToBuild)) {

        continue;
      
      // Key/val node on the root doc
      } else if(keyValNodeToBuild.depth === startDepth)
      {

        doc[keyValNodeToBuild.key] = keyValNodeToBuild.value;

        buildList.add(keyValNodeToBuild);

        // All child nodes and descendants have been overridden by this change.
        const descendants = [...keyValNodeToBuild.children()];

        for(const descendant of descendants) {

          buildList.add(<Tself>descendant);

          descendants.push(...descendant.children());

        }

        continue;

      }

      const pathToKeyValNodeIter = keyValNodeToBuild.pathToKey(false);
      let pathToKeyValNodeIterResult = pathToKeyValNodeIter.next();
      
      // NOTE: Do not need to check done flag here b/c any KeyValueNodes with
      // depth the same as the key/val node to build would have been handled
      // by the if/else statement: keyValNodeToBuild.depth === startDepth
      // The iterator WILL NOT finish before the while condition is false.
      while(pathToKeyValNodeIterResult.value.depth < startDepth)
      {
        pathToKeyValNodeIterResult = pathToKeyValNodeIter.next();
      }
      
      let docToSetOn = doc;
      do {

        const ancestorKeyValueNode = <Tself>pathToKeyValNodeIterResult.value;
        
        if(!buildList.has(ancestorKeyValueNode)) {

          for(const ancestorChild of ancestorKeyValueNode.children()) {

            docToSetOn[ancestorKeyValueNode.key] = 
              ancestorChild.keyType === 'index' ? [] : {};

          }

        }
          
        docToSetOn = docToSetOn[ancestorKeyValueNode.key];

      } while(!pathToKeyValNodeIterResult.done);

      docToSetOn[keyValNodeToBuild.key] = keyValNodeToBuild.value;

      buildList.add(keyValNodeToBuild);

      // All child nodes and descendants have been overridden by this change.
      const descendants = [...keyValNodeToBuild.children()];

      for(const descendant of descendants) {

        buildList.add(<Tself>descendant);

        descendants.push(...descendant.children());

      }

    }

    return doc;

  }
  

  /**
   * Iterates updates of this [[KeyValueNode]], it's siblings (default), 
   * and all of the descendants recursively in order of value updates 
   * most recent to latest.
   * @param includeSiblings pass `false` to exclude the siblings.
   */
  *updateOrder(includeSiblings = true):
    IterableIterator<Tself> 
  {

    const nodesAndUpdateOrder = this[NODES_AND_UPDATE_ORDER];

    const updateOrder:(Tself)[] =
      new Array(nodesAndUpdateOrder.length);
    
    const keyValueNodes:(Tself)[] = [<any>this];
    
    if(includeSiblings) {
    
      keyValueNodes.push(...<any>this.siblings());
    
    }
    
    for(const keyValNode of keyValueNodes) {

      updateOrder[nodesAndUpdateOrder.indexOf(keyValNode)] = keyValNode;

      keyValueNodes.push(...<any>keyValNode.children());

    }

    for(let i = updateOrder.length - 1; i > -1; i--) {

      const keyValNode = updateOrder[i];

      if(keyValNode !== undefined) {

        yield keyValNode;

      }

    }

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
  
  readonly value:Tvalue;

  constructor(value:Tvalue, set:()=>boolean) {
    this.value = value;
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