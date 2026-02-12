class Popup {
    constructor(asset) {
        this.asset = asset;
        // place the popup in one of four positions, whichever is furthest from the asset
        this.x = this.asset.getBoundingBox().x >= 512 ? 32 : 1024 - 32 - 256;
        this.y = this.asset.getBoundingBox().y >= 512 ? 32 : 768 - 32 - 256;
        this.width;
        this.height;
        this.removeFromWorld = false;
        if (this.asset.config.type == "static" && this.asset.config.colorMode == "static") this.removeFromWorld = true;
        if (this.asset.config.colorOptions != undefined && this.asset.config.colorOptions[0] != "#000000") this.asset.config.colorOptions.unshift("#000000");
    }
    
    update() {
        
    }

    draw(context) {
        if (typeof this.width == "undefined") {
            this.width = Math.max(Math.ceil(context.measureText(this.asset.config.name).width) + 64, 256);
            this.x -= this.x == 32 ? 0 : this.width - 256;
        }
        
        if (typeof this.height == "undefined") {
            this.height = (this.asset.config.type == "movable") * 64;
            this.height += this.asset.config.colorMode == "set" ? Math.ceil(this.asset.config.colorOptions.length / 3) * 72 : 0;
            this.height += this.asset.config.colorMode == "picker" ? 72 : 0;
            this.height = Math.max(this.height, 256);
            this.y -= this.height - 256;
        }
        
        // draw background of popup
        context.fillStyle = "#EFCE94";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = "#D28038";
        context.lineWidth = 4;
        context.strokeRect(this.x, this.y, this.width, this.height);
        
        // draw name of selected asset
        context.font = "32px serif";
        context.fillStyle = "black";
        context.fillText(this.asset.config.name, this.x + 8, this.y + 32);
        context.font = "32px sans-serif";
        context.fillText("X", this.x + this.width - 32, this.y + 32);
        
        let drawY = 48;
        if (this.asset.config.type == "movable") {
            context.drawImage(assetManager.getResource("./assets/small_arrow_left.png"), this.x + 16, this.y + drawY);
            context.drawImage(assetManager.getResource("./assets/small_arrow_right.png"), this.x + 72, this.y + drawY);
            context.drawImage(assetManager.getResource("./assets/small_arrow_up.png"), this.x + this.width - 120, this.y + drawY);
            context.drawImage(assetManager.getResource("./assets/small_arrow_down.png"), this.x + this.width - 64, this.y + drawY);
            drawY += 64;
        }
        
        if (this.asset.config.colorMode == "set") {
            const options = this.asset.config.colorOptions;
            for (let i = 0; i < options.length; i++) {
                context.fillStyle = options[i];
                context.beginPath();
                context.ellipse(this.x + 40 + [0, this.width / 2 - 40, this.width - 80][i % 3], this.y + drawY + 32 + Math.floor(i / 3) * 72, 32, 32, 0, 0, 2 * Math.PI);
                context.fill();
                context.strokeStyle = this.asset.color == options[i] ? "green" : "#D28038";
                context.stroke();
            }
        } else if (this.asset.config.colorMode == "picker") {
            const gradient = context.createLinearGradient(this.x + 8, this.y + drawY, this.x + this.width - 8, this.y + drawY);
            for (let stop = 0; stop < 360; stop ++) {
                gradient.addColorStop(stop / 360, colorToCSS(hsl([stop, 1, 1])));
            }
            context.fillStyle = gradient;
            context.fillRect(this.x + 8, this.y + drawY, this.width - 16, 32);
            context.strokeStyle = "black";
            context.lineWidth = 2;
            context.strokeRect(this.x + 8, this.y + drawY, this.width - 16, 32);
            
            if (typeof this.asset.color == "number") {
                context.drawImage(assetManager.getResource("./assets/pointer.png"), this.x + 4 + (this.asset.color / 360 * (this.width - 16)), this.y + drawY + 28);
            }
        }
    }
    
    handleClick(click) {
        if (click.x > this.x + this.width - 32 && click.y < this.y + 32) {
            this.removeFromWorld = true;
        } else if (this.asset.config.type == "movable" && insideBox(click, {x: this.x + 16, y: this.y + 48, width: this.width - 16, height: 48})) {
            // click in the arrow region
            if (click.x < this.x + 64) {
                this.asset.x -= 1;
            } else if (click.x < this.x + 120) {
                this.asset.x += 1;
            } else if (click.x < this.x + this.width - 72) {
                this.asset.y -= 1;
            } else if (click.x < this.x + this.width - 16) {
                this.asset.y += 1;
            }
            this.asset.update();
        } else if (this.asset.config.colorMode != "static") {
            // click in the colour region
            const initY = (this.asset.config.type == "movable") * 62 + this.y + 48;
            const localX = click.x - this.x;
            
            if (this.asset.config.colorMode == "picker" && click.y < initY + 32) {
                this.asset.color = Math.ceil((localX - 8) / (this.width - 16) * 360);
            } else if (this.asset.config.colorMode == "set") {
                const index = 3 - (localX < 80) * 1 - (localX < (this.width / 2 + 32)) * 1 - (localX < (this.width - 16)) * 1 + 3 * Math.floor((click.y - initY) / 72);
                this.asset.color = this.asset.config.colorOptions[index];
            }
            this.asset.update();
        }
    }
}