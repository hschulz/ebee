import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { EventDispatcher } from "../src/index.js"

type TestEventsMap = {
    "test.register": () => void
    "test.unregister": () => void
    "test.multi": () => void
    "test.before.reset": () => void
    "test.after.reset": () => void
    "test.with.arg": (arg: string) => void
    "test.with.args": (arg1: string, arg2: string) => void
}

describe("EBEE", () => {

    let dispatcher: EventDispatcher<TestEventsMap>

    beforeEach(() => {
        dispatcher = EventDispatcher.get<TestEventsMap>()
    })

    afterEach(() => {
        dispatcher.reset()
    })

    it("should register callbacks to the event bus", async () => {
        const eventName = "test.register"
        let called = false

        dispatcher.register(eventName, () => { called = true })
        await dispatcher.dispatch(eventName)

        expect(called).toBe(true)
    })

    it("should unregister callbacks from the event bus", async () => {
        const eventName = "test.unregister"
        let called = false

        const reg = dispatcher.register(eventName, () => {
            called = true
        })

        await reg.unregister()
        await dispatcher.dispatch(eventName)

        expect(called).toBe(false)
    })

    it("should unregister multiple callbacks from the event bus", async () => {
        const eventName = "test.multi"
        let called1 = false
        let called2 = false
        let called3 = false

        const reg1 = dispatcher.register(eventName, () => { called1 = true })
        const reg2 = dispatcher.register(eventName, () => { called2 = true })
        dispatcher.register(eventName, () => { called3 = true })

        await reg1.unregister()
        await reg2.unregister()
        await dispatcher.dispatch(eventName)

        expect(called1).toBe(false)
        expect(called2).toBe(false)
        expect(called3).toBe(true)
    })

    it("should create a new default instance", () => {
        expect(dispatcher).toBeInstanceOf(EventDispatcher)

        const dispatcher2 = EventDispatcher.get<TestEventsMap>("default")
        expect(dispatcher2).toBeInstanceOf(EventDispatcher)
        expect(dispatcher).toBe(dispatcher2)
    })

    it("should create new named instances", () => {
        const newDispatcher = EventDispatcher.get<TestEventsMap>("test")

        expect(newDispatcher).toBeInstanceOf(EventDispatcher)
        expect(newDispatcher).not.toBe(dispatcher)
    })

    it("should be able to reset the instance", async () => {
        let beforeCalled = false
        let afterCalled = false

        dispatcher.register("test.before.reset", () => { beforeCalled = true })
        dispatcher.reset()
        await dispatcher.dispatch("test.before.reset")

        dispatcher.register("test.after.reset", () => { afterCalled = true })
        await dispatcher.dispatch("test.after.reset")

        expect(beforeCalled).toBe(false)
        expect(afterCalled).toBe(true)
    })

    it("should dispatch an event with arguments", async () => {
        const eventName = "test.with.arg"
        let receivedArg = ""

        dispatcher.register(eventName, (arg: string) => {
            receivedArg = arg
        })

        await dispatcher.dispatch(eventName, "test")

        expect(receivedArg).toBe("test")
    })

    it("should dispatch an event with multiple arguments", async () => {
        const eventName = "test.with.args"
        let receivedArg1 = ""
        let receivedArg2 = ""

        dispatcher.register(eventName, (arg1: string, arg2: string) => {
            receivedArg1 = arg1
            receivedArg2 = arg2
        })

        await dispatcher.dispatch(eventName, "test", "test")

        expect(receivedArg1).toBe("test")
        expect(receivedArg2).toBe("test")
    })

    it("should be possible to run a registry unregister even if the event is no longer registered", async () => {
        const eventName = "test.register"
        let called = false

        const reg = dispatcher.register(eventName, () => {
            called = true
        })

        dispatcher.reset()
        await reg.unregister()
        await dispatcher.dispatch(eventName)

        expect(called).toBe(false)
    })

    it("should be possible to run a registry unregister multiple times", async () => {
        const eventName = "test.register"
        let called = false

        const reg = dispatcher.register(eventName, () => {
            called = true
        })

        dispatcher.register(eventName, () => {})

        dispatcher.reset()

        await reg.unregister()
        await reg.unregister()
        await reg.unregister()

        await dispatcher.dispatch(eventName)

        expect(called).toBe(false)
    })
})
