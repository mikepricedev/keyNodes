import PathNotation from 'path-notation';
declare const CHILDREN: unique symbol;
declare const DEPTH: unique symbol;
declare const KEY: unique symbol;
declare const KEY_TYPE: unique symbol;
declare const PARENT: unique symbol;
declare const ROOT_KEY_NODES: unique symbol;
export interface IprivateIniArgs<Tself extends KeyNode> {
    _parent_: Tself | null;
    _rootKeyNodes_: Map<string, Tself>;
}
/**
 * @note
 * Derived class definitions **MUST** pass themselves to `Tself`.  `Tself` should
 * **NOT** be passed during [[KeyNode]] instantiation.
 */
export default class KeyNode<Tkey extends string | number = string | number, Tself extends KeyNode = KeyNode<string | number, any>> {
    private readonly [CHILDREN];
    private [DEPTH];
    private readonly [KEY];
    private readonly [KEY_TYPE];
    private [PARENT];
    private [ROOT_KEY_NODES];
    /**
     * @param _privateIniArgs_ This argument is used internally and should **NOT**
     *  be passed during instantiations.
     */
    constructor(key: Tkey | KeyNode<Tkey>, _privateIniArgs_?: Partial<IprivateIniArgs<Tself>>);
    readonly parent: Tself | null;
    readonly key: Tkey;
    /**
     * Returns "index" for keys of type "number" and "key" for keys of type
     * "string".
     * @note
     * Type "index" is overridden to "key" when a sibling [[KeyNode]] is
     * type "key".
     */
    readonly keyType: 'index' | 'key';
    /**
     * Returns the root [[KeyNode]] of the path that leads to this [[KeyNode]].
     */
    readonly rootKey: Tself;
    readonly isRootKey: boolean;
    readonly isTerminalKey: boolean;
    readonly numSiblings: number;
    readonly numChildren: number;
    readonly depth: number;
    /**
     * `PathNotation` from the root to the [[KeyNode]].
     */
    readonly path: PathNotation;
    readonly [Symbol.toStringTag]: string;
    /**
     * @note
     * Supplies base class constructor `_privateIniArgs_` [[IprivateIniArgs]] for
     * derived class overrides of [[KeyNode.addChild]] and [[KeyNode.addSibling]]
     * **Required** when extending this [[KeyNode]].
     */
    protected _privateIniArgs(relation: 'child' | 'sibling'): IprivateIniArgs<Tself>;
    hasChild(childKey: string | number): boolean;
    getChild(childKey: string | number): Tself | null;
    /**
     * @note
     * When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] **required** with override
     * implementations.
     */
    addChild<TchildKey extends number | string>(childKey: TchildKey | KeyNode<TchildKey>): KeyNode<TchildKey>;
    /**
     * @note
     * When removal is successful, the removed child [[KeyNode]] is transformed
     * into a root [[KeyNode]].
     */
    removeChild(childKey: string | number): boolean;
    hasSibling(siblingKey: string | number): boolean;
    getSibling(siblingKey: string | number): Tself | null;
    /**
     * @note
     * When extending, must be overridden and return derived class.
     * Utility [[KeyNode._privateIniArgs]] **required** with override
     * implementations.
     */
    addSibling<TsiblingKey extends number | string>(siblingKey: TsiblingKey | KeyNode<TsiblingKey>): KeyNode<TsiblingKey>;
    /**
     * @note
     * When removal is successful, the removed sibling [[KeyNode]] is
     * transformed into a root [[KeyNode]].
     */
    removeSibling(siblingKey: string | number): boolean;
    children(): IterableIterator<Tself>;
    ancestors(): IterableIterator<Tself>;
    /**
     * Iterates all [[KeyNode]]s along path to the [[KeyNode]].
     * @param includeSelf when `false` does NOT include this [[KeyNode]].
     */
    pathToKey(includeSelf?: boolean): IterableIterator<Tself>;
    siblings(): IterableIterator<Tself>;
    rootKeys(): IterableIterator<Tself>;
    /**
     * Iterates decedent terminal [[KeyNode]]s (default).  If this [[KeyNode]]
     * is terminal, iterates self.
     * @param global pass `true` to iterate all terminal keys in the hierarchy
     * from the terminal [[KeyNode]]s.
     */
    terminalKeys(global?: boolean): IterableIterator<Tself>;
    toString(): string;
    valueOf(): string | number;
}
export {};
