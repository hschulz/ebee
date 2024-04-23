import { EventDispatcherInterface } from "./EventDispatcherInterface"
import { EventMap } from "./types"
import { Registry } from "./Registry"
import { Subscribers } from "./Subscribers"

/**
 *
 */
export class EventDispatcher<T extends EventMap> implements EventDispatcherInterface<T> {

    /**
     * The default name of the event dispatcher.
     */
    public static readonly DefaultName: string = "default"

    /**
     * The actual instances are saved here.
     */
    protected static instances: Map<string, EventDispatcher<EventMap>> = new Map()

    /**
     * Will return the instance for the given name.
     */
    public static get<T extends EventMap>(name: string = EventDispatcher.DefaultName): EventDispatcher<T> {
        if (this.instances.has(name)) {
            return this.instances.get(name) as EventDispatcher<T>
        }

        const instance = new EventDispatcher<T>()
        this.instances.set(name, instance)

        return instance
    }

    /**
     * Collection of subscriber callbacks for an event.
     */
    protected subscribers: Subscribers<T> = {}

    /**
     * Singleton pattern constructor
     */
    protected constructor() {
        this.subscribers = {}
    }

    /**
     * Registers the given callback to the given event name.
     *
     * @param event An event name
     * @param cb A callback function that matches the dispatch call
     * @returns A registry object for the given callback
     */
    public register<K extends keyof T>(event: K, cb: T[K]): Registry {

        if (this.subscribers[event] === undefined) {
            this.subscribers[event] = new Set()
        }

        this.subscribers[event]?.add(cb)

        return {
            unregister: async (): Promise<void> => {

                const temporarySubscribers = this.subscribers[event]

                if (temporarySubscribers === undefined) {
                    return
                }

                if (temporarySubscribers.has(cb)) {
                    temporarySubscribers.delete(cb)
                }

                if (temporarySubscribers.size === 0) {
                    delete this.subscribers[event]
                    return
                }

                this.subscribers[event] = temporarySubscribers
            }
        }
    }

    /**
     * Dispatches the event with the given name and argument.
     *
     * @param event Some event name or identifier
     * @param args An optional typed argument
     * @returns A promise that resolves when all callbacks are executed
     */
    public async dispatch<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void> {
        this.subscribers[event]?.forEach(cb => cb(...args))
    }

    /**
     * Removes all subscribers from the event dispatcher.
     */
    public reset(): void {
        this.subscribers = {}
    }
}
