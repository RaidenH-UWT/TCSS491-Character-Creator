class Popup {
    constructor(asset) {
        this.asset = asset;
        // place the popup in one of four positions, whichever is furthest from the asset
        this.x = this.asset.getBoundingBox().x >= 512 ? 32 : 1024 - 32 - 256;
        this.y = this.asset.getBoundingBox().y >= 512 ? 32 : 768 - 32 - 256;
        this.width;
        this.height = 256;
        this.removeFromWorld = false;
        console.log("new popup for ", this.asset.config.name);
    }
    
    update() {
        
    }

    draw(context) {
        if (!this.width) {
            this.width = Math.max(Math.ceil(context.measureText(this.asset.config.name).width) + 32, 256); // replace with width of color picker or whatev
        }
        
        // draw background of popup
        context.fillStyle = "#EFCE94";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = "#D28038";
        context.lineWidth = 4;
        context.strokeRect(this.x, this.y, this.width, this.height);
        
        // draw name of selected asset
        context.fillStyle = "black";
        context.fillText(this.asset.config.name, this.x + 8, this.y + 34);
        
        // TODO:
        //  - if movable: draw arrows for precise movement (adjust width if necessary)
        //  - depending on colorMode: display nothing, a grid of colour options, or a colour slider (adjust height accordingly)
    }
}