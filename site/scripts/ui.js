/*
 * This class provides the user interface for the character creator
 */
class UserInterface {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.assets = gameEngine.assets;
        this.category = gameEngine.categories[0];
        this.tabOffset = 0;
        this.page = 0;
        this.sprites = {
            guides: assetManager.getResource("./assets/guides.png"),
            background: assetManager.getResource("./assets/ui_background.png"),
            tab_left: assetManager.getResource("./assets/tab_left.png"),
            tab_mid: assetManager.getResource("./assets/tab_mid.png"),
            tab_right: assetManager.getResource("./assets/tab_right.png"),
            asset_border_on: assetManager.getResource("./assets/asset_border_on.png"),
            asset_border_off: assetManager.getResource("./assets/asset_border_off.png"),
            arrow_left: assetManager.getResource("./assets/arrow_left.png"),
            arrow_right: assetManager.getResource("./assets/arrow_right.png")
        };
        this.tabWidths = [];
        this.options = [];
    }
    
    draw(context) {
        this.assets = gameEngine.assets;
        
        context.fillStyle = "#efdab6";
        context.fillRect(0, 768, 1024, 256);
        context.drawImage(this.sprites.background, 0, 816);
        this.drawCategories(context);
        this.drawAssets(context);
        if (this.gameEngine.debug) context.drawImage(this.sprites.guides, 0, 768);
    }
    
    drawCategories(context) {
        // TODO: weird issue that (i think) only shows up in prod: when loading
        // an external extension, *sometimes* one asset does not load, which causes
        // the creation of an "undefined" category which, when clicked, goes to the
        // first category. So: why is an asset missing, and why does that cause an
        // undefined category to appear.
        
        // draw all categories in a row, with backgrounds made from sprite segments
        // when the user scrolls, offset the drawing so that a different section shows up.
        let temp = this.tabOffset;
        this.tabWidths = [];
        context.font = "34px serif";
        context.fillStyle = "black";
        let category;
        // let categories = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth"];
        let categories = this.gameEngine.categories;
        for (category of categories) {
            if (typeof this.category == "undefined") {
                this.category = category;
            }
            
            context.drawImage(this.sprites.tab_left, this.tabOffset, 768);
            this.tabOffset += 8;
            
            // ceil avoids an issue where the width comes back as a float and uh. we can't draw 1/3rd of a pixel.
            let width = Math.ceil(context.measureText(category).width);

            for (let i = 0; i < Math.ceil(width / 8); i++) {
                context.drawImage(this.sprites.tab_mid, this.tabOffset + (i * 8), 768);
            }
            
            context.drawImage(this.sprites.tab_right, this.tabOffset + width, 768);
            
            if (this.category == category) {
                context.fillStyle = "#3ad43b";
            } else {
                context.fillStyle = "black";
            }
            
            context.fillText(category, this.tabOffset, 806);
            this.tabWidths.push({name: category, start: this.tabOffset, end: this.tabOffset + width + 8});
            this.tabOffset += width + 10;
        }
        this.tabWidths.sort((a, b) => a.start - b.start);
        this.tabOffset = temp;
    }
    
    drawAssets(context) {
        // grab all assets of the category currently selected
        this.assets = this.assets.filter((asset) => asset.config.category == this.category);
        
        this.isPages = this.assets.length > 12 * (this.page + 1);
        
        // take only 12 assets at the current page
        let assets = this.assets.slice(12 * this.page, 12 * this.page + 12);
        for (let i = 0;  i < assets.length; i++) {
            // row = Math.floor(i / 6); col = i % 6
            let x = 19 + 128 * (i % 6 + 1);
            let y = 827 + 96 * (Math.floor(i / 6));

            let resources = assets[i].resources;
            let offset = {x: 0, y: 0};
            for (let r = 0; r < 1; r++) {
                // ok if i wanted to fit all resources of an asset into one square, i *think* i'd
                // have to merge the images into one, and then render that scaled, or else do a fuck
                // ton of complicated math. so instead i'm just gonna crop them. good enough for a preview.
                if (r != 0) {
                    offset.x = resources[r].x - resources[r - 1].x;
                    offset.y = resources[r].y - resources[r - 1].y;
                }
                // TODO: for multi-resource assets, draw the first asset normally then crop the rest to fit inside the border
                // i couldn't figure this out, so as a bandaid fix i just draw the first resource and drop the rest.
                
                // context.drawImage(resources[r].img, offset.x >= 0 ? offset.x : resources[r].img.width + offset.x, 0, resources[r].img.width, resources[r].img.height, x + offset.x, y + offset.y, 90, 90);
                // TODO: fix scaling so that it keeps the correct aspect ratio (just calc the correct scale parameters so that 90 is the max, simple algebra)
                context.drawImage(resources[r].img, x + offset.x + 4, y + offset.y + 4, 80, 80);
            }
            
            context.drawImage(assets[i].isEnabled ? this.sprites.asset_border_on : this.sprites.asset_border_off, x, y);
            
            // only draw the arrows if there are enough assets & pages to warrant it
            if (this.isPages) {
                context.drawImage(this.sprites.arrow_right, 960, 824);
            }
            
            if (this.page > 0) {
                context.drawImage(this.sprites.arrow_left, 4, 824);
            }
        }
    }
    
    handleClick(clickX, clickY) {
        if (clickY < 768) {
            // TODO: handle movable assets and maybe asset customization in here
        } else if (clickY >= 768 && clickY <= 816) {
            let selection = this.tabWidths.filter((pair) => clickX >= pair.start - 8 && clickX <= pair.end + 8);
            if (selection) {
                this.category = selection[0].name;
                this.page = 0;
            }
        } else {
            if (clickX <= 64 && this.page > 0) {
                // left arrow
                this.page -= 1;
            } else if (clickX >= 960 && this.isPages) {
                // right arrow
                this.page += 1;
            } else if (clickX >= 147 && clickX <= 877) {
                // potentially asset click
                if (clickY >= 827 && clickY < 1013) {
                    // calculate the index of the asset within the displayed assets, from the coordinates
                    let index = Math.floor(clickX / 128) + (clickY >= 923 ? 6 : 0) - 1;
                    // toggle isEnabled if there's an asset there
                    if (this.assets.length > 12*this.page + index) {
                        this.assets[12*this.page + index].isEnabled = !this.assets[12*this.page + index].isEnabled;
                    }
                }
            }
        }
    }
    
    scroll(posX, posY, distance) {
        // only scroll if within the tab area
        if (posY >= 768 && posY <= 816) {
            // only scroll if there are enough tabs to warrant it
            let farX = this.tabWidths[this.tabWidths.length - 1].end - this.tabOffset;
            if (farX > 1024) {
                // don't allow the offset to go past the starting point, or the furthest tab
                this.tabOffset = Math.min(0, Math.max(this.tabOffset - distance, 1024 - farX));
            }
        }
    }
}
