/**
 * A registry describes an object that has the sole purpose of unregistering
 * a callback registered with the event bus.
 */
export default interface Registry {

    /**
     * Calling this function will unregister the callback from the event bus.
     */
    unregister: () => void;
}
