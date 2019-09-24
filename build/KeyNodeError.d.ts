import KeyNode from './KeyNode';
export default class KeyNodeError<TKeyNode extends KeyNode = KeyNode> extends Error {
    readonly KEY_NODE: TKeyNode;
    constructor(msg: string, KEY_NODE: TKeyNode);
    readonly [Symbol.toStringTag]: string;
}
