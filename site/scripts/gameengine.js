// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
// Further modified by Raiden for this project.
class GameEngine {
    constructor(debug) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;
        
        // Everything that will be updated and drawn each frame
        this.assets = [];
        
        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};
        
        this.debug = debug;
    };
    
    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
    };
    
    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };
    
    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
                               y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.debug) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });
        
        this.ctx.canvas.addEventListener("click", e => {
            if (this.debug) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });
        
        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.debug) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });
        
        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.debug) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });
        
        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };
    
    addAsset(asset) {
        this.assets.push(asset);
    };
    
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        let resources = [];
        for (asset of this.assets) {
            resources.push(asset.resources);
        }
        
        // sort the list by layer
        let compareLayer = function(a, b) {
            return a.layer - b.layer;
        }
        
        resources = resources.flat();
        resources.sort(compareLayer);
        
        // draw resources in order
        for (asset of this.assets) {
            let toDraw = resources.filter(function(elem) {
                return elem.asset == asset.config.name;
            });
            
            for (resource of toDraw) {
                this.ctx.drawImage(resource.img, asset.x + resource.x, asset.y + resource.y, resource.scale * resource.img.width, resource.scale * resource.img.height);
            }
        }
        
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