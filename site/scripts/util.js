/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    /**
     * Compatibility for requesting animation frames in older browsers
     * @param {Function} callback Function
     * @param {DOM} element DOM ELEMENT
     */
    ((callback, element) => {
        window.setTimeout(callback, 1000 / 60);
    });
})();

function insideBox(pos, box) {
    if (typeof pos == "undefined" || typeof box == "undefined" || pos == null || box == null) {
        return false;
    }
    return pos.x >= box.x && pos.x <= box.x + box.width && pos.y >= box.y && pos.y <= box.y + box.height;
}