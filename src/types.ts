export interface RicochetParams {
    /**
     * The container element where the item will bounce.
     */
    container: HTMLElement

    /**
     * The element that moves and bounces inside the container.
     */
    item: HTMLElement

    /**
     * Horizontal movement speed in pixels per second.
     * Default `370`.
     */
    horizontalSpeed?: number

    /**
     * Vertical movement speed in pixels per second.
     * Default is `200`.
     */
    verticalSpeed?: number

    /**
     * The initial direction the item moves in.
     * Options: "bottom-right", "bottom-left", "top-right", "top-left".
     * Default is `"bottom-right"`.
     */
    initialDirection?: InitialDirection

    /**
     * Callback fired when the item hits any border.
     */
    onHitBorder?: () => void | Promise<void>

    /**
     * Callback fired when the item hits the left border.
     */
    onHitLeft?: () => void | Promise<void>

    /**
     * Callback fired when the item hits the right border.
     */
    onHitRight?: () => void | Promise<void>

    /**
     * Callback fired when the item hits the top border.
     */
    onHitTop?: () => void | Promise<void>

    /**
     * Callback fired when the item hits the bottom border.
     */
    onHitBottom?: () => void | Promise<void>
}

export type InitialDirection = (
    "bottom-right" |
    "bottom-left" |
    "top-right" |
    "top-left"
)
