import PathNotation from 'path-notation';
declare const CHILDREN: unique symbol;
declare const DEPTH: unique symbol;
declare const KEY: unique symbol;
declare const KEY_TYPE: unique symbol;
declare const PARENT: unique symbol;
declare const PATH_NOTATION: unique symbol;
declare const ROOT_KEY: unique symbol;
declare const ROOT_KEY_NODES: unique symbol;
export interface IprivateIniArgs<Tself extends KeyNode> {
    _parent_: Tself | null;
    _rootKeyNodes_: Map<string, Tself>;
}
/**
 * @remarks
 * Derived class definitions MUST pass themselves to `Tself`.  `Tself` should
 * NOT be passed during [[KeyNode]] instantiation.
 */
export default class KeyNode<Tkey extends string | number = string | number, Tself extends KeyNode = KeyNode<string | number, any>> extends String {
    private readonly [CHILDREN];
    private readonly [DEPTH];
    private readonly [KEY];
    private readonly [KEY_TYPE];
    private readonly [PARENT];
    private [PATH_NOTATION];
    private [ROOT_KEY];
    private readonly [ROOT_KEY_NODES];
    /**
     * @param _privateIniArgs_ This argument is private and should NOT be passed
     * during instantiations.
     */
    constructor(key: Tkey | KeyNode<Tkey>, _privateIniArgs_?: Partial<IprivateIniArgs<Tself>>);
    readonly parent: Tself | null;
    readonly key: Tkey;
    /**
     * Returns "index" for keys of type "number" and "key" for keys of type
     * "string".
     * @remarks
     * Type "index" is overridden to "key" when a sibling [[KeyNode]] is
     * type "key".
     */
    readonly keyType: 'index' | 'key';
    /**
     * Returns the root key of the path that leads to this [[KeyNode]]
     */
    readonly rootKey: Tself;
    readonly isRootKey: boolean;
    readonly isTerminalKey: boolean;
    readonly numChildren: number;
    readonly depth: number;
    /**
     * `PathNotation` from the root to the [[KeyNode]].
     */
    readonly path: PathNotation;
    readonly [Symbol.toStringTag]: string;
    /**
     * @remarks
     * Supplies base class constructor `_privateIniArgs_` [[IprivateIniArgs]] for
     * derived class implementation overrides of [[KeyNode.addChild]] and
     * [[KeyNode.addSibling]] (Required when extending this class).
     */
    protected _privateIniArgs(relation: 'child' | 'sibling'): IprivateIniArgs<Tself>;
    hasChild(childKey: string | number): boolean;
    getChild(childKey: string | number): Tself | null;
    /**
     * @notes When extending, must be overridden and return derived class.
     * Utility `KeyNode._privateIniArgs` helps with override implementation.
     */
    addChild<TchildKey extends number | string>(childKey: TchildKey | KeyNode<TchildKey>): KeyNode<TchildKey>;
    removeChild(childKey: string | number): boolean;
    hasSibling(siblingKey: string | number): boolean;
    getSibling(siblingKey: string | number): Tself | null;
    /**
     * @remarks When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] helps with override implementation.
     */
    addSibling<TsiblingKey extends number | string>(siblingKey: TsiblingKey | KeyNode<TsiblingKey>): KeyNode<TsiblingKey>;
    removeSibling(siblingKey: string | number): boolean;
    children(): IterableIterator<Tself>;
    parents(): IterableIterator<Tself>;
    /**
     * Iterates all [[KeyNode]]s along path to the [[KeyNode]].
     * @param includeSelf when `false` does NOT include the [[KeyNode]] as last
     * iterator result.
     */
    pathToKey(includeSelf?: boolean): IterableIterator<Tself>;
    siblings(): IterableIterator<Tself>;
    rootKeys(): IterableIterator<Tself>;
}
export {};
