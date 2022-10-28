# EBee 🐝

A server side event bus.

## Example

```typescript
import Bus from "ebee"

/**
 * My callback function for my event.
 * Greets the given value with hello and writes to console.log
 *
 * @param value Some string
 */
function myCallback (value: string): void {
    console.log("hello " + value)
}

/* Register my function for my callback and receive the unregister function */
const unregister = Bus.instance.register("my.event", myCallback)

/* Trigger my event with some string value */
Bus.instance.dispatch<string>("my.event", "world")

/* Unregister my callback function */
unregister.unregister()
```
