import Registry from "./Registry"

/**
 * The event bus interface defines the only methods required for an implementing
 * class to act like an event bus.
 */
export default interface EventBus {

    /**
     * Dispatches the event with the given name and argument.
     *
     * @param event Some event name or identifier
     * @param arg An optional typed argument
     */
    dispatch<T>(event: string, arg?: T): void;

    /**
     * Registers the given callback to the given event name.
     *
     * @param event Some event name or identifier
     * @param callback A callback function that matches the dispatch call
     * @returns A registry object for the given callback
     */
    register(event: string, callback: CallableFunction): Registry;
}
