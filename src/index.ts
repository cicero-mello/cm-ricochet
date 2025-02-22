import { InitialDirection, RicochetParams } from "./types"
/**
 * Creates a ricochet effect on an element (item) inside a container (container).
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
    const HORIZONTAL_SPEED = horizontalSpeed ?? 370
    const VERTICAL_SPEED = verticalSpeed ?? 200

    let boxTop = 0
    let boxLeft = 0
    let horizontalAnimationId: number
    let verticalAnimationId: number
    let lastVerticalTime = performance.now()
    let lastHorizontalTime = performance.now()

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
        const deltaTime = (time - lastHorizontalTime) / 1000
        lastHorizontalTime = time

        boxLeft -= HORIZONTAL_SPEED * deltaTime
        item.style.left = boxLeft + "px"

        if (boxHitsContainerOn("left")) {
            if (onHitBorder) onHitBorder()
            if (onHitLeft) onHitLeft()

            horizontalAnimationId = requestAnimationFrame(moveRight)
            return
        }
        horizontalAnimationId = requestAnimationFrame(moveLeft)
    }

    const moveRight = (time: number) => {
        const deltaTime = (time - lastHorizontalTime) / 1000
        lastHorizontalTime = time

        boxLeft += HORIZONTAL_SPEED * deltaTime
        item.style.left = boxLeft + "px"

        if (boxHitsContainerOn("right")) {
            if (onHitBorder) onHitBorder()
            if (onHitRight) onHitRight()

            horizontalAnimationId = requestAnimationFrame(moveLeft)
            return
        }
        horizontalAnimationId = requestAnimationFrame(moveRight)
    }

    const moveUp = (time: number) => {
        const deltaTime = (time - lastVerticalTime) / 1000
        lastVerticalTime = time

        boxTop -= VERTICAL_SPEED * deltaTime
        item.style.top = boxTop + "px"

        if (boxHitsContainerOn("top")) {
            if (onHitBorder) onHitBorder()
            if (onHitTop) onHitTop()

            verticalAnimationId = requestAnimationFrame(moveDown)
            return
        }
        verticalAnimationId = requestAnimationFrame(moveUp)
    }

    const moveDown = (time: number) => {
        const deltaTime = (time - lastVerticalTime) / 1000
        lastVerticalTime = time

        boxTop += VERTICAL_SPEED * deltaTime
        item.style.top = boxTop + "px"

        if (boxHitsContainerOn("bottom")) {
            if (onHitBorder) onHitBorder()
            if (onHitBottom) onHitBottom()

            verticalAnimationId = requestAnimationFrame(moveUp)
            return
        }
        verticalAnimationId = requestAnimationFrame(moveDown)
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

        horizontalAnimationId = requestAnimationFrame(horizontalMove)
        verticalAnimationId = requestAnimationFrame(verticalMove)
    }

    start()

    const endRicochet = () => {
        cancelAnimationFrame(horizontalAnimationId)
        cancelAnimationFrame(verticalAnimationId)
    }

    return endRicochet
}
