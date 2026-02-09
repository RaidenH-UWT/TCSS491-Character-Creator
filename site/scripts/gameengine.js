// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
// Further modified by Raiden for the Character Creator.
class GameEngine {
    constructor() {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.context = null;
        
        // Everything that will be updated and drawn each frame
        this.assets = [];
        
        this.popup = null;
        
        this.categories = [];
        
        // Information on the input
        this.click = null;
        this.clickTime = 0;
        this.mouse = {x: 0, y: 0};
        this.mouseDelta = {x: 0, y: 0};
        this.mouseDown = false;
        this.wheel = null;
        this.keys = {};
        
        this.temp = [];
    };
    
    init(ctx) {
        this.context = ctx;
        this.startInput();
        this.timer = new Timer();
    };
    
    start() {
        this.running = true;
        const gameLoop = async () => {
            this.loop();
            requestAnimFrame(gameLoop, this.context.canvas);
        };
        gameLoop();
    };
    
    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.context.canvas.getBoundingClientRect().left,
            y: e.clientY - this.context.canvas.getBoundingClientRect().top
        });
        
        this.context.canvas.addEventListener("mousemove", e => {
            if (DEBUG.io) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
            this.mouseDelta = {x: e.movementX, y: e.movementY};
        });
        
        this.context.canvas.addEventListener("mousedown", e => {
            if (DEBUG.io) {
                console.log("MOUSE_DOWN", getXandY(e));
            }
            this.mouseDown = true;
            this.mouseDelta = {x: 0, y: 0};
            this.mouse = getXandY(e);
        });
        
        this.context.canvas.addEventListener("mouseup", e => {
            if (DEBUG.io) {
                console.log("MOUSE_UP", getXandY(e));
            }
            this.mouseDown = false;
            this.mouseDelta = {x: 0, y: 0};
            this.clickTime = 0;
            this.mouse = getXandY(e);
        });
        
        this.context.canvas.addEventListener("click", e => {
            if (DEBUG.io) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
            this.ui.handleClick(this.click.x, this.click.y);
        });
        
        this.context.canvas.addEventListener("wheel", e => {
            if (DEBUG.io) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
            // send the values to the UI to scroll, and allow for either vertical or horizontal scrolling with wheelDelta
            this.ui.scroll(getXandY(e).x, getXandY(e).y, -this.wheel.wheelDelta);
        });
        
        this.context.canvas.addEventListener("contextmenu", e => {
            if (DEBUG.io) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });
        
        this.context.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.context.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };
    
    addAsset(asset) {
        this.assets.push(asset);
        if (!this.categories.includes(asset.config.category)) this.categories.push(asset.config.category);
        if (DEBUG.loader) console.log("Added Asset:", asset, "\nStored categories: ", this.categories);
    };
    
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // queue up enabled assets for drawing
        let resources = [];
        for (let asset of this.assets) {
            if (asset.isEnabled) {
                resources.push(asset.resources);
            }
        }

        // sort the resources by layer
        resources = resources.flat();
        resources.sort((a, b) => a.layer - b.layer);
        
        // draw resources in order
        for (let resource of resources) {
            this.context.drawImage(resource.img, resource.asset.x + resource.x, resource.asset.y + resource.y, resource.scale * resource.img.width, resource.scale * resource.img.height);
        }
        
        this.ui.draw(this.context);
        
        this.popup?.draw(this.context);
        
        if (DEBUG.visualization) {
            for (asset of this.assets) {
                if (asset.isEnabled) {
                    let box = asset.getBoundingBox();
                    this.context.strokeStyle = "#00FF00";
                    this.lineWidth = 2
                    this.context.strokeRect(box.x, box.y, box.width, box.height);
                }
            }
            
            this.context.fillStyle = "white";
            this.context.font = "12pt serif";
            this.context.fillText(`(${this.mouse.x}, ${this.mouse.y})`, this.mouse.x, this.mouse.y);
        }
    };
    
    update() {
        if (this.mouseDown) {
            this.clickTime += this.clockTick;
        }
        
        let assetCount = this.assets.length;
        // all enabled assets beneath the mouse
        let focusedAssets = this.assets.filter((a) => a.isEnabled && this.insideBox(this.mouse, a.getBoundingBox()));
        // sort so the topmost asset is first
        focusedAssets.sort((a, b) => Math.max(...b.resources.map((b) => b.layer)) - Math.max(...a.resources.map((a) => a.layer)));
        if (this.mouseDown && focusedAssets[0]?.config.type == "movable" && this.clickTime >= 0.05) {
            focusedAssets[0].x += this.mouseDelta.x;
            focusedAssets[0].y += this.mouseDelta.y;
            focusedAssets[0].update();
        } else if (this.mouseDown && focusedAssets[0]) {
            this.popup = new Popup(focusedAssets[0]);
        }
        
        if (this.popup?.removeFromWorld) {
            this.popup = null;
        }
        this.mouseDelta = {x: 0, y: 0};
    };
    
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
    
    insideBox(pos, box) {
        return pos.x >= box.x && pos.x <= box.x + box.width && pos.y >= box.y && pos.y <= box.y + box.height
    }
};

// KV Le was here :)
