/**
 * An object that maps event names to event handlers.
 */
export type EventMap = {

    /**
     * The index signature allows for any event name to be mapped to a function
     * with any number of arguments.
     */
    [key: string]: (...args: any[]) => void
}
