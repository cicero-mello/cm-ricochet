import { InitialDirection, RicochetParams } from "./types"

/**
 * Creates a ricochet effect on an element (item) inside a container (container).
 * Pauses automatically if the tab/window is hidden, and resumes when visible.
 * @returns a function to stop the ricochet.
 */
export const startRicochet = ({
    container,
    item,
    horizontalSpeed = 370,
    verticalSpeed = 200,
    initialDirection,
    onHitBorder,
    onHitLeft,
    onHitRight,
    onHitTop,
    onHitBottom
}: RicochetParams) => {

    let boxTop = 0
    let boxLeft = 0
    let horizontalAnimationId: number
    let verticalAnimationId: number
    let lastVerticalTime = performance.now()
    let lastHorizontalTime = performance.now()
    let paused = false

    let currentHorizontalMove: (time: number) => void
    let currentVerticalMove: (time: number) => void

    const boxHitsContainerOn = (direction: "top" | "bottom" | "right" | "left") => {
        const containerRect = container.getBoundingClientRect()
        const boxRect = item.getBoundingClientRect()

        const boxTop = boxRect.top - containerRect.top
        const boxLeft = boxRect.left - containerRect.left
        const boxBottom = boxTop + boxRect.height
        const boxRight = boxLeft + boxRect.width

        if (direction === "top") return boxTop <= 0
        if (direction === "bottom") return boxBottom >= containerRect.height
        if (direction === "left") return boxLeft <= 0
        if (direction === "right") return boxRight >= containerRect.width
    }

    const moveLeft = (time: number) => {
        if (paused) return
        const deltaTime = (time - lastHorizontalTime) / 1000
        lastHorizontalTime = time

        boxLeft -= horizontalSpeed * deltaTime
        item.style.left = boxLeft + "px"

        if (boxHitsContainerOn("left")) {
            onHitBorder?.()
            onHitLeft?.()
            horizontalAnimationId = requestAnimationFrame(moveRight)
            currentHorizontalMove = moveRight
            return
        }

        horizontalAnimationId = requestAnimationFrame(moveLeft)
        currentHorizontalMove = moveLeft
    }

    const moveRight = (time: number) => {
        if (paused) return
        const deltaTime = (time - lastHorizontalTime) / 1000
        lastHorizontalTime = time

        boxLeft += horizontalSpeed * deltaTime
        item.style.left = boxLeft + "px"

        if (boxHitsContainerOn("right")) {
            onHitBorder?.()
            onHitRight?.()
            horizontalAnimationId = requestAnimationFrame(moveLeft)
            currentHorizontalMove = moveLeft
            return
        }

        horizontalAnimationId = requestAnimationFrame(moveRight)
        currentHorizontalMove = moveRight
    }

    const moveUp = (time: number) => {
        if (paused) return
        const deltaTime = (time - lastVerticalTime) / 1000
        lastVerticalTime = time

        boxTop -= verticalSpeed * deltaTime
        item.style.top = boxTop + "px"

        if (boxHitsContainerOn("top")) {
            onHitBorder?.()
            onHitTop?.()
            verticalAnimationId = requestAnimationFrame(moveDown)
            currentVerticalMove = moveDown
            return
        }

        verticalAnimationId = requestAnimationFrame(moveUp)
        currentVerticalMove = moveUp
    }

    const moveDown = (time: number) => {
        if (paused) return
        const deltaTime = (time - lastVerticalTime) / 1000
        lastVerticalTime = time

        boxTop += verticalSpeed * deltaTime
        item.style.top = boxTop + "px"

        if (boxHitsContainerOn("bottom")) {
            onHitBorder?.()
            onHitBottom?.()
            verticalAnimationId = requestAnimationFrame(moveUp)
            currentVerticalMove = moveUp
            return
        }

        verticalAnimationId = requestAnimationFrame(moveDown)
        currentVerticalMove = moveDown
    }

    const pause = () => {
        if (!paused) {
            paused = true
            cancelAnimationFrame(horizontalAnimationId)
            cancelAnimationFrame(verticalAnimationId)
        }
    }

    const resume = () => {
        if (paused) {
            paused = false
            lastHorizontalTime = performance.now()
            lastVerticalTime = performance.now()
            horizontalAnimationId = requestAnimationFrame(currentHorizontalMove)
            verticalAnimationId = requestAnimationFrame(currentVerticalMove)
        }
    }

    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            pause()
        } else if (document.visibilityState === "visible") {
            resume()
        }
    }

    const start = () => {
        container.style.position = "relative"
        item.style.position = "absolute"

        const directionMap: Record<
            InitialDirection,
            [(time: number) => void, (time: number) => void]
        > = {
            "bottom-left": [moveLeft, moveDown],
            "bottom-right": [moveRight, moveDown],
            "top-right": [moveRight, moveUp],
            "top-left": [moveLeft, moveUp],
        }

        const [
            horizontalMove,
            verticalMove
        ] = directionMap[initialDirection ?? "bottom-right"]

        currentHorizontalMove = horizontalMove
        currentVerticalMove = verticalMove

        horizontalAnimationId = requestAnimationFrame(horizontalMove)
        verticalAnimationId = requestAnimationFrame(verticalMove)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    start()

    const endRicochet = () => {
        cancelAnimationFrame(horizontalAnimationId)
        cancelAnimationFrame(verticalAnimationId)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
    }

    return endRicochet
}
