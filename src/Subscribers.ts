import { EventMap } from "./types"

/**
 * Subscribers are a collection of callbacks for an event.
 */
export type Subscribers<T extends EventMap> = {
    [K in keyof T]?: Set<T[K]>
}
