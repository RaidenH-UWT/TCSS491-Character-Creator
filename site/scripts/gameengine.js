// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
// Further modified by Raiden for the Character Creator.
class GameEngine {
    constructor(debug) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.context = null;
        
        // Everything that will be updated and drawn each frame
        this.assets = [];
        
        this.categories = [];
        
        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};
        
        this.debug = debug;
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
            if (this.debug) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });
        
        this.context.canvas.addEventListener("click", e => {
            if (this.debug) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
            this.ui.handleClick(this.click.x, this.click.y);
        });
        
        this.context.canvas.addEventListener("wheel", e => {
            if (this.debug) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
            // send the values to the UI to scroll, and allow for either vertical or horizontal scrolling with wheelDelta
            this.ui.scroll(getXandY(e).x, getXandY(e).y, -this.wheel.wheelDelta);
        });
        
        this.context.canvas.addEventListener("contextmenu", e => {
            if (this.debug) {
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
        console.log(this.assets);
    };
    
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        // queue up enabled assets for drawing
        let resources = [];
        for (asset of this.assets) {
            if (asset.isEnabled) {
                resources.push(asset.resources);
            }
        }

        // sort the resources by layer
        resources = resources.flat();
        resources.sort((a, b) => a.layer - b.layer);
        
        // draw resources in order
        for (asset of this.assets) {
            let toDraw = resources.filter((resource) => resource.asset == asset.config.name)
            
            // TODO: multi-resource assets seem to have something funky going on, where they aren't offset properly. check this out
            for (resource of toDraw) {
                this.context.drawImage(resource.img, asset.x + resource.x, asset.y + resource.y, resource.scale * resource.img.width, resource.scale * resource.img.height);
            }
        }
        
        this.ui.draw(this.context);
    };
    
    update() {
        let entitiesCount = this.assets.length;
        
        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.assets[i];
            
            if (!entity.removeFromWorld) {
                entity.update();
            }
        }
        
        for (let i = this.assets.length - 1; i >= 0; --i) {
            if (this.assets[i].removeFromWorld) {
                this.assets.splice(i, 1);
            }
        }
    };
    
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};

// KV Le was here :)
