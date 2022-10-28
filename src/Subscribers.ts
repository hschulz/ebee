/**
 * Defines the object type used to store the subscribers for named events
 * in the event bus implementation.
 */
export default interface Subscribers {

    /**
     * Some string identifier will index the collection of event callbacks.
     */
    [key: string]: CallableFunction[];
}
