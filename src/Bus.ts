import EventBus from "./EventBus"
import Registry from "./Registry"
import Subscribers from "./Subscribers"

/**
 * Default implementation of the event bus interface as a singleton.
 */
export default class Bus implements EventBus {

    /**
     * The actual instance is saved here.
     */
    protected static _instance: Bus | undefined

    /**
     * Will return the instance.
     */
    public static get instance(): Bus {
        if (this._instance === undefined || this._instance.shouldReset) {
            this._instance = new Bus()
        }

        return this._instance
    }

    protected shouldReset: boolean = false

    /**
     * Collection of subscriber callbacks for an event.
     */
    protected subscribers: Subscribers = {}

    /**
     * Singleton pattern constructor
     */
    protected constructor() {
        this.shouldReset = false
        this.subscribers = {}
    }

    public dispatch<T>(event: string, arg?: T): void {

        /* Get all callback functions for the given event */
        const subs = this.subscribers[event]

        /* In case the event is unknown */
        if (subs === undefined) {
            return
        }

        /* Execute all callbacks with given argument */
        for (const f of subs) {
            f(arg)
        }
    }

    public register(event: string, callback: CallableFunction): Registry {

        /* Create collection for event if not exists */
        const subscribers = this.subscribers[event] || []

        /* Save index for unregister callback */
        subscribers.push(callback)

        /* Put collection back to instance */
        this.subscribers[event] = subscribers

        return {
            unregister: () => {

                const temporarySubscribers = this.subscribers[event] || []

                const index = temporarySubscribers.indexOf(callback)

                if (index === undefined) {
                    return
                }

                temporarySubscribers.splice(index, 1)

                this.subscribers[event] = temporarySubscribers

                if (Object.keys(temporarySubscribers).length === 0) {
                    delete this.subscribers[event]
                }
            }
        }
    }

    /**
     * Toggles creation of a new instance during the next instance access.
     * This will wipe any registered subscribers from the new instance.
     */
    public reset (): void {
        this.shouldReset = true
    }
}
