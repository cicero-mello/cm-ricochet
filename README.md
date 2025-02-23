## cm-ricochet
[![npm](https://img.shields.io/npm/v/cm-ricochet)](https://www.npmjs.com/package/cm-ricochet)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/cm-ricochet)](https://bundlephobia.com/package/cm-ricochet)

### **Function: `startRicochet`**

`startRicochet` creates a ricochet effect on an element (`item`) inside a container (`container`). The element moves in a specified initial direction and bounces off the container's borders. The function returns a method to stop the ricochet effect.

---

### **Parameters:**

| Parameter         | Type                      | Default       | Description |
|------------------|--------------------------|--------------|-------------|
| `container`      | `HTMLElement`             | **(required)** | The container in which the ricochet effect occurs. |
| `item`           | `HTMLElement`             | **(required)** | The element that moves and bounces inside the container. |
| `horizontalSpeed` | `number`                  | `370`         | The horizontal speed of the item (in pixels per second). |
| `verticalSpeed`  | `number`                  | `200`         | The vertical speed of the item (in pixels per second). |
| `initialDirection` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `"bottom-right"` | The initial movement direction of the item. |
| `onHitBorder`    | `() => void \| Promise<void>` | `undefined`  | Callback function triggered when the item hits any border. |
| `onHitLeft`      | `() => void \| Promise<void>` | `undefined`  | Callback function triggered when the item hits the left border. |
| `onHitRight`     | `() => void \| Promise<void>` | `undefined`  | Callback function triggered when the item hits the right border. |
| `onHitTop`       | `() => void \| Promise<void>` | `undefined`  | Callback function triggered when the item hits the top border. |
| `onHitBottom`    | `() => void \| Promise<void>` | `undefined`  | Callback function triggered when the item hits the bottom border. |

---

### **Return:**
- A function `endRicochet(): void`, which stops the ricochet effect by canceling all animations.

---

### **General Usage Example:**
```ts
const stopRicochet = startRicochet({
    container: document.getElementById("game-container"),
    item: document.getElementById("ball"),
    horizontalSpeed: 400,
    verticalSpeed: 250,
    initialDirection: "top-left",
    onHitBorder: () => console.log("Hit a border!"),
    onHitLeft: () => console.log("Hit left!"),
    onHitRight: () => console.log("Hit right!"),
    onHitTop: () => console.log("Hit top!"),
    onHitBottom: () => console.log("Hit bottom!"),
});

// To stop the ricochet effect:
setTimeout(() => stopRicochet(), 5000); // Stops after 5 seconds
```
### **With React:**
```ts
import { startRicochet } from "cm-ricochet"

const Component = () => {
    const containerRef = useRef(null)
    const itemRef = useRef(null)

    useEffect(() => {
        const stopRicochet = startRicochet({
            container: containerRef.current,
            item: itemRef.current
        })
        return stopRicochet
    }, [])

    return (
        <div ref={containerRef}>
            <p ref={itemRef}>🏀</p>
        </div>
    )
}
```
---

### **Notes:**
- The `container` will have `position: relative`.
- The `item` will have `position: absolute`.
- The movement update is synchronized with the screen's refresh rate.
- The speed is **frame rate independent**, meaning it adapts to different refresh rates.
- The function runs indefinitely unless manually stopped.
- Callbacks allow custom behaviors when the item collides with the container’s edges.
- Works in responsive containers.