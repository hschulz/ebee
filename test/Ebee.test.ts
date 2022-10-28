import { Bus } from ".."
// import { expect } from "chai"

describe("EBEE", () => {

    beforeEach(() => {
        Bus.instance.reset()
    })

    it("should register callbacks to the event bus", (done: Mocha.Done) => {

        const eventName = "mocha.test.register"

        Bus.instance.register(eventName, done)

        Bus.instance.dispatch(eventName)
    })

    it("should unregister callbacks from the event bus", (done: Mocha.Done) => {

        const eventName = "mocha.test.unregister"

        const timeoutId = setTimeout(() => {
            done()
        }, 23)

        const reg = Bus.instance.register(eventName, () => {
            clearTimeout(timeoutId)
            done(new Error("callback was not removed"))
        })

        reg.unregister()

        Bus.instance.dispatch(eventName)
    })

    it("should unregister multiple callbacks from the event bus", (done: Mocha.Done) => {

        const eventName = "mocha.test.multi"

        const reg1 = Bus.instance.register(eventName, () => {
            done(new Error("callback 1 was not removed"))
        })

        const reg2 = Bus.instance.register(eventName, () => {
            done(new Error("callback 2 was not removed"))
        })

        Bus.instance.register(eventName, done)

        reg1.unregister()
        reg2.unregister()

        Bus.instance.dispatch(eventName)
    })

    it("should be able to reset the singleton instance", (done: Mocha.Done) => {

        Bus.instance.register("mocha.test.before.reset", () => {
            done(new Error("Failed to reset"))
        })

        Bus.instance.reset()

        Bus.instance.dispatch("mocha.test.before.reset")

        Bus.instance.register("mocha.test.after.reset", () => {
            done()
        })

        Bus.instance.dispatch("mocha.test.after.reset")
    })
})
