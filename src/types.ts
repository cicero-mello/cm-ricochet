export interface RicochetParams {
    container: HTMLElement
    item: HTMLElement
    horizontalSpeed?: number
    verticalSpeed?: number
    initialDirection?: InitialDirection
    onHitBorder?: () => void | Promise<void>
    onHitLeft?: () => void | Promise<void>
    onHitRight?: () => void | Promise<void>
    onHitTop?: () => void | Promise<void>
    onHitBottom?: () => void | Promise<void>
}

export type InitialDirection = (
    "bottom-right" |
    "bottom-left" |
    "top-right" |
    "top-left"
)
