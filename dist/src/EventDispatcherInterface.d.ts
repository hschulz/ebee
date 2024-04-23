import { EventMap } from "./types";
import { Registry } from "./Registry";
/**
 * Interface for the EventDispatcher class that describes the public API.
 */
export interface EventDispatcherInterface<T extends EventMap> {
    /**
     * Register a callback function for a given event.
     *
     * @param event The event name.
     * @param cb The callback function.
     * @returns A registry object that allows to unregister the callback.
     */
    register<K extends keyof T>(event: K, cb: T[K]): Registry;
    /**
     * Dispatch an event with optional arguments.
     *
     * @param event The event name.
     * @param args The arguments for the callback functions.
     * @returns A promise that resolves when all callbacks are executed.
     */
    dispatch<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void>;
    /**
     * Remove all subscribers from the event dispatcher.
     *
     * @returns void
     */
    reset(): void;
}
//# sourceMappingURL=EventDispatcherInterface.d.ts.map