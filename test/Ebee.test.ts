import { EventDispatcher } from ".."
import { expect } from "chai"

type TestEventsMap = {
    "mocha.test.register": () => void
    "mocha.test.unregister": () => void
    "mocha.test.multi": () => void
    "mocha.test.before.reset": () => void
    "mocha.test.after.reset": () => void
    "mocha.test.with.arg": (arg: string) => void
    "mocha.test.with.args": (arg1: string, arg2: string) => void
}

describe("EBEE", async (): Promise<void> => {

    let dispatcher: EventDispatcher<TestEventsMap> | undefined = undefined

    beforeEach(() => {
        dispatcher = EventDispatcher.get<TestEventsMap>()
    })

    afterEach(() => {
        dispatcher?.reset()
    })

    it("should register callbacks to the event bus", (done: Mocha.Done) => {

        const eventName = "mocha.test.register"

        dispatcher?.register(eventName, done)

        dispatcher?.dispatch(eventName)
    })

    it("should unregister callbacks from the event bus", (done: Mocha.Done) => {

        const eventName = "mocha.test.unregister"

        const timeoutId = setTimeout(() => {
            done()
        }, 23)

        const reg = dispatcher?.register(eventName, () => {
            clearTimeout(timeoutId)
            done(new Error("callback was not removed"))
        })

        reg?.unregister()

        dispatcher?.dispatch(eventName)
    })

    it("should unregister multiple callbacks from the event bus", (done: Mocha.Done) => {

        const eventName = "mocha.test.multi"

        const reg1 = dispatcher?.register(eventName, () => {
            done(new Error("callback 1 was not removed"))
        })

        const reg2 = dispatcher?.register(eventName, () => {
            done(new Error("callback 2 was not removed"))
        })

        dispatcher?.register(eventName, done)

        reg1?.unregister()
        reg2?.unregister()

        dispatcher?.dispatch(eventName)
    })

    it("should create a new default instance", async (): Promise<void> => {
        expect(dispatcher).to.be.instanceOf(EventDispatcher)

        const dispatcher2 = EventDispatcher.get<TestEventsMap>("default")

        expect(dispatcher2).to.be.instanceOf(EventDispatcher)

        expect(dispatcher).to.equal(dispatcher2)
    })

    it("should create new named instances", async (): Promise<void> => {
        const newDispatcher = EventDispatcher.get<TestEventsMap>("test")

        expect(newDispatcher).to.be.instanceOf(EventDispatcher)

        expect(newDispatcher).to.not.equal(dispatcher)
    })

    it("should be able to reset the instance", (done: Mocha.Done) => {

        dispatcher?.register("mocha.test.before.reset", () => {
            done(new Error("Failed to reset"))
        })

        dispatcher?.reset()

        dispatcher?.dispatch("mocha.test.before.reset")

        dispatcher?.register("mocha.test.after.reset", () => {
            done()
        })

        dispatcher?.dispatch("mocha.test.after.reset")
    })

    it("should dispatch an event with arguments", (done: Mocha.Done) => {

        const eventName = "mocha.test.with.arg"

        dispatcher?.register(eventName, (arg: string) => {
            expect(arg).to.equal("test")
            done()
        })

        dispatcher?.dispatch(eventName, "test")
    })

    it("should dispatch an event with multiple arguments", (done: Mocha.Done) => {

        const eventName = "mocha.test.with.args"

        dispatcher?.register(eventName, (arg1: string, arg2: string) => {
            expect(arg1).to.equal("test")
            expect(arg2).to.equal("test")
            done()
        })

        dispatcher?.dispatch(eventName, "test", "test")
    })

    it("should dispatch events only to the correct subscribers", (done: Mocha.Done) => {

        const eventName = "mocha.test.with.arg"

        dispatcher?.register(eventName, (arg: string) => {
            expect(arg).to.equal("test")
            done()
        })

        dispatcher?.dispatch("mocha.test.with.arg", "wrong")
        dispatcher?.dispatch(eventName, "test")
    })

    it("should be possible to run a registry unregister even if the event is no longer registered", (done: Mocha.Done) => {

        const eventName = "mocha.test.register"

        const reg = dispatcher?.register(eventName, () => {
            done(new Error("callback was not removed"))
        })

        dispatcher?.reset()

        reg?.unregister()

        dispatcher?.dispatch(eventName)

        done()
    })

    it("should be possible to run a registry unregister multiple times", (done: Mocha.Done) => {

        const eventName = "mocha.test.register"

        const reg = dispatcher?.register(eventName, () => {
            done(new Error("callback was not removed"))
        })

        dispatcher?.register(eventName, () => {})

        dispatcher?.reset()

        reg?.unregister()
        reg?.unregister()
        reg?.unregister()

        dispatcher?.dispatch(eventName)

        done()
    })
})
