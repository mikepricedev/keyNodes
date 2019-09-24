"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyNodeError extends Error {
    constructor(msg, KEY_NODE) {
        super(msg);
        this.KEY_NODE = KEY_NODE;
    }
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}
exports.default = KeyNodeError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2V5Tm9kZUVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0tleU5vZGVFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLE1BQXFCLFlBQWlELFNBQVEsS0FBSztJQUVqRixZQUFZLEdBQVUsRUFBVyxRQUFpQjtRQUVoRCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFGb0IsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUlsRCxDQUFDO0lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFFdEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztJQUUvQixDQUFDO0NBRUY7QUFkRCwrQkFjQyJ9