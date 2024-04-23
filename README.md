# EBee 🐝

A working event dispatcher.´

## Example

```typescript
import { EventDispatcher } from "ebee"

/* Define the events that can be dispatched */
type MyEvents = {
    "my.event": string
}

/* Get the dispatcher for my events */
const dispatcher = EventDispatcher.get<MyEvents>()

/* Register my function for my callback and receive the unregister function */
const reg = dispatcher.register("my.event", (value): void => {
    console.log(`hello ${value}`)
})

/* Trigger my event with some string value */
dispatcher.dispatch("my.event", "world")

/* Unregister my callback function */
reg.unregister()
```
