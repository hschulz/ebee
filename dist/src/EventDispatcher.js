"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = void 0;
/**
 *
 */
class EventDispatcher {
    /**
     * Will return the instance for the given name.
     */
    static get(name = EventDispatcher.DefaultName) {
        if (this.instances.has(name)) {
            return this.instances.get(name);
        }
        const instance = new EventDispatcher();
        this.instances.set(name, instance);
        return instance;
    }
    /**
     * Singleton pattern constructor
     */
    constructor() {
        /**
         * Collection of subscriber callbacks for an event.
         */
        this.subscribers = {};
        this.subscribers = {};
    }
    /**
     * Registers the given callback to the given event name.
     *
     * @param event An event name
     * @param cb A callback function that matches the dispatch call
     * @returns A registry object for the given callback
     */
    register(event, cb) {
        var _a;
        if (this.subscribers[event] === undefined) {
            this.subscribers[event] = new Set();
        }
        (_a = this.subscribers[event]) === null || _a === void 0 ? void 0 : _a.add(cb);
        return {
            unregister: () => __awaiter(this, void 0, void 0, function* () {
                const temporarySubscribers = this.subscribers[event];
                if (temporarySubscribers === undefined) {
                    return;
                }
                if (temporarySubscribers.has(cb)) {
                    temporarySubscribers.delete(cb);
                }
                if (temporarySubscribers.size === 0) {
                    delete this.subscribers[event];
                    return;
                }
                this.subscribers[event] = temporarySubscribers;
            })
        };
    }
    /**
     * Dispatches the event with the given name and argument.
     *
     * @param event Some event name or identifier
     * @param args An optional typed argument
     * @returns A promise that resolves when all callbacks are executed
     */
    dispatch(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.subscribers[event]) === null || _a === void 0 ? void 0 : _a.forEach(cb => cb(...args));
        });
    }
    /**
     * Removes all subscribers from the event dispatcher.
     */
    reset() {
        this.subscribers = {};
    }
}
exports.EventDispatcher = EventDispatcher;
/**
 * The default name of the event dispatcher.
 */
EventDispatcher.DefaultName = "default";
/**
 * The actual instances are saved here.
 */
EventDispatcher.instances = new Map();
//# sourceMappingURL=EventDispatcher.js.map