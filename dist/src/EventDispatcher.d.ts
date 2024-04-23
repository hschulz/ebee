import { EventDispatcherInterface } from "./EventDispatcherInterface";
import { EventMap } from "./types";
import { Registry } from "./Registry";
import { Subscribers } from "./Subscribers";
/**
 *
 */
export declare class EventDispatcher<T extends EventMap> implements EventDispatcherInterface<T> {
    /**
     * The default name of the event dispatcher.
     */
    static readonly DefaultName: string;
    /**
     * The actual instances are saved here.
     */
    protected static instances: Map<string, EventDispatcher<EventMap>>;
    /**
     * Will return the instance for the given name.
     */
    static get<T extends EventMap>(name?: string): EventDispatcher<T>;
    /**
     * Collection of subscriber callbacks for an event.
     */
    protected subscribers: Subscribers<T>;
    /**
     * Singleton pattern constructor
     */
    protected constructor();
    /**
     * Registers the given callback to the given event name.
     *
     * @param event An event name
     * @param cb A callback function that matches the dispatch call
     * @returns A registry object for the given callback
     */
    register<K extends keyof T>(event: K, cb: T[K]): Registry;
    /**
     * Dispatches the event with the given name and argument.
     *
     * @param event Some event name or identifier
     * @param args An optional typed argument
     * @returns A promise that resolves when all callbacks are executed
     */
    dispatch<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void>;
    /**
     * Removes all subscribers from the event dispatcher.
     */
    reset(): void;
}
//# sourceMappingURL=EventDispatcher.d.ts.map