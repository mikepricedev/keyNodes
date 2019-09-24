// import RootKeyNodes from './RootKeyNodes';
import PathNotation from 'path-notation';
import KeyNodeError from './KeyNodeError';

const CHILDREN:unique symbol = Symbol();
const DEPTH:unique symbol = Symbol();
const KEY:unique symbol = Symbol();
const PARENT:unique symbol = Symbol();
const PATH_NOTATION:unique symbol = Symbol();
const ROOT_KEY:unique symbol = Symbol();
const ROOT_KEY_NODES:unique symbol = Symbol();

export interface IprivateIniArgs<Tself extends KeyNode> {
  _parent_:Tself | null;
  _rootKeyNodes_:Map<string, Tself>
}

/**
 * @remarks
 * Derived class definitions MUST pass themselves to `Tself`.  `Tself` should
 * NOT be passed during [[KeyNode]] instantiation.
 */
export default class KeyNode<
    Tkey extends string | number = string | number,
    Tself extends KeyNode = KeyNode<string | number, any>,
  > extends String 
{

  private readonly [CHILDREN] = new Map<string, Tself>();
  private readonly [DEPTH]:number;
  private readonly [KEY]:Tkey;
  private readonly [PARENT]:Tself | null;
  private [PATH_NOTATION]:PathNotation;
  private [ROOT_KEY]:Tself;
  private readonly [ROOT_KEY_NODES]:Map<string, Tself>;

  /**
   * @param _privateIniArgs_ This argument is private and should NOT be passed
   * during instantiations.
   */
  constructor(key:Tkey | KeyNode<Tkey>,
    _privateIniArgs_:Partial<IprivateIniArgs<Tself>> = 
    {_parent_:null, _rootKeyNodes_:new Map()})
  {
    
    
    super(key.toString()); 
    
    const keyStr = key.toString();
    
    this[PARENT] = _privateIniArgs_._parent_;
    this[ROOT_KEY_NODES] = _privateIniArgs_._rootKeyNodes_;
    
    if(this.hasSibling(keyStr)) {
      
      throw new KeyNodeError<KeyNode>(`'${keyStr}' already exists in sibling set.`+
      `  Sibling key literals must be unique.`, this.getSibling(keyStr));
    
    }

    // Deep copy MUST occur before this instance is added to the root keys or
    // parent child library in order to prevent circular reference in the event 
    // the KeyNode passed is a parent of itself.
    if(key instanceof KeyNode) {
      
      this[KEY] = key.key;

      for(const childNode of key.children()) {
        
        this.addChild(childNode);
      
      }
    
    } else {
    
      this[KEY] = key;
    
    }
    
    if(this[PARENT] === null) {
      
      this[ROOT_KEY_NODES].set(keyStr, <any>this);
      this[DEPTH] = 0;
      
    } else {

      this[PARENT][CHILDREN].set(keyStr, this);
      this[DEPTH] = this[PARENT].depth + 1;

    }

  }

  //Accessors
  get parent(): Tself | null {
    
    return this[PARENT];
  
  }

  get key():Tkey {
  
    return this[KEY];
  
  }

  get keyType(): 'index' | 'key' {
  
    return typeof this[KEY] === 'string' ? 'key' : 'index';
  
  }

  /**
   * Returns the root key of the path that leads to this [[KeyNode]]
   */
  get rootKey():Tself {

    //Lazy cache
    if(this[ROOT_KEY] === undefined){

      this[ROOT_KEY] = this.pathToKey().next().value;

    }

    return this[ROOT_KEY];

  }

  get isRootKey(): boolean {
    
    return this[PARENT] === null;
  
  }

  get isTerminalKey():boolean {

    return this[CHILDREN].size === 0;

  }

  get numChildren():number{

    return this[CHILDREN].size;

  }

  get depth():number {

    return this[DEPTH];

  }

  /**
   * `PathNotation` from the root to the [[KeyNode]].
   */
  get path():PathNotation {

    //Lazy cache
    if(this[PATH_NOTATION] === undefined){

      this[PATH_NOTATION] = new PathNotation(function*(this:Tself){
        for(const keyNode of this.pathToKey()){
          yield keyNode.toString();
        }
      }.call(this));

    }

    return this[PATH_NOTATION];

  }

  get [Symbol.toStringTag]() {
  
    return this.constructor.name;
  
  }


  //Methods
  /**
   * @remarks
   * Supplies base class constructor `_privateIniArgs_` [[IprivateIniArgs]] for
   * derived class implementation overrides of [[KeyNode.addChild]] and 
   * [[KeyNode.addSibling]] (Required when extending this class).
   */
  protected _privateIniArgs(relation:'child' | 'sibling'):IprivateIniArgs<Tself>
  {

    return {
      _parent_: relation === 'child' ? <any>this : this[PARENT],
      _rootKeyNodes_:this[ROOT_KEY_NODES]
    };

  }

  hasChild(childKey:string | number):boolean {

    return this[CHILDREN].has(childKey.toString());

  }

  getChild(childKey:string | number):Tself | null {

    const childKeyLiteral = childKey.toString();

    const children = this[CHILDREN];

    return children.has(childKeyLiteral) ? children.get(childKeyLiteral) : null;

  }

  /**
   * @notes When extending, must be overridden and return derived class.
   * Utility `KeyNode._privateIniArgs` helps with override implementation.
   */
  addChild<TchildKey extends number | string>(
    childKey:TchildKey | KeyNode<TchildKey>):KeyNode<TchildKey> 
  {
    
    return new KeyNode<TchildKey>(childKey, this._privateIniArgs('child'));

  }

  removeChild(childKey:string | number):boolean {

    return this[CHILDREN].delete(childKey.toString());

  }

  hasSibling(siblingKey:string | number):boolean {

    const siblingKeyLiteral = siblingKey.toString();
    
    if(this[PARENT] === null) {

      return this[ROOT_KEY_NODES].has(siblingKeyLiteral);

    } else {
      
      return this[PARENT][CHILDREN].has(siblingKeyLiteral);

    }

  }

  getSibling(siblingKey:string | number):Tself | null {

    const siblingKeyLiteral = siblingKey.toString();
    
    if(siblingKeyLiteral === this.toString()){

      return null;

    }

    if(this[PARENT] === null) {

      return this[ROOT_KEY_NODES].has(siblingKeyLiteral) ? 
        this[ROOT_KEY_NODES].get(siblingKeyLiteral) : null;

    } else {

      return this[PARENT][CHILDREN].has(siblingKeyLiteral) ? 
        <Tself>this[PARENT][CHILDREN].get(siblingKeyLiteral) : null;

    }

  }

  /**
   * @remarks When extending, must be overridden and return derived class.
   * Utility [[KeyNode._privateIniArgs]] helps with override implementation.
   */
  addSibling<TsiblingKey extends number | string>(
    siblingKey:TsiblingKey | KeyNode<TsiblingKey>):KeyNode<TsiblingKey> 
  {
    
    return new KeyNode<TsiblingKey>(siblingKey,
      this._privateIniArgs('sibling'));

  }

  children():IterableIterator<Tself> {

    return this[CHILDREN].values();

  }

  *parents():IterableIterator<Tself> {

    let pKey = this[PARENT];

    while(pKey !== null){

      yield pKey;

      pKey = <Tself>pKey[PARENT];

    }
  
  }

  /**
   * Iterates all [[KeyNode]]s along path to the [[KeyNode]].
   * @param includeSelf when `false` does NOT include the [[KeyNode]] as last
   * iterator result.
   */
  *pathToKey(includeSelf = true):IterableIterator<Tself> {

    if(this[PARENT] === null){

      if(includeSelf){

        yield <any>this;

      }

      return;
     
    }

    yield* <any>this[PARENT].pathToKey(true);

    if(includeSelf){

      yield <any>this;

    }
  
  }

  *siblings():IterableIterator<Tself> {

    const siblingsIter = this[PARENT] ===  null ? 
      this[ROOT_KEY_NODES].values() : this[PARENT].children();

    for(const sibling of siblingsIter){

      if(sibling !== this){

        yield <Tself>sibling;

      }

    }

  }

  rootKeys():IterableIterator<Tself> {
    
    let keyNode:Tself = <any>this;
    
    while(keyNode[ROOT_KEY_NODES] === null) {

      keyNode = <Tself>keyNode[PARENT];

    }

    return <any>keyNode[ROOT_KEY_NODES].values();
  }

}

let test = new KeyNode(1);
let test2 = new KeyNode(test);
let key = test2.key;
let key2: typeof test2.key;