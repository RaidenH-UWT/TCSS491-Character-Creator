/*
 * This class provides the user interface for the character creator
 */
class UserInterface {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.assets = gameEngine.assets;
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
        this.tabWidths = {};
        this.options = [];
    }
    
    draw(context) {
        this.assets = gameEngine.assets;
        /* TODO:
         * Draw category tabs
         *   - made up of three sprites, start, 0* middle, and an end, to completely encapsulate the category name
         *   - need to be clickable, default to displaying the first one
         * Draw assets within category
         *   - scale asset down to same size
         *   - draw border around each asset
         *   - draw enough assets to fill the menu, and overflow to more pages
         *   - asset borders should have an "on" and "off" state for toggle
         * Implement asset pages
         *   - arrow control sprites (buttons)
         *   - arrows appear only when necessary (when there is a page to the right/left)
         * 
         * For future, implement asset customization UI
         */
        
        context.drawImage(this.sprites.background, 0, 816);
        this.drawCategories(context);
        this.drawAssets(context);
        if (this.gameEngine.debug) context.drawImage(this.sprites.guides, 0, 768);
    }
    
    drawCategories(context) {
        // draw all categories in a row, with backgrounds made from sprite segments
        // when the user scrolls, offset the drawing so that a different section shows up.
        context.font = "32px serif";
        context.fillStyle = "black";
        let category;
        for (category of this.gameEngine.categories) {
            if (!this.category) {
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
            
            context.fillText(category, this.tabOffset, 806);
            this.tabOffset += width + 10;
            
            this.tabWidths[category] = {start: this.tabOffset, end: this.tabOffset + width};
        }
    }
    
    drawAssets(context) {
        // draw all assets that will fit on the page, then borders on top of them
        // select assets from the current category, and then page based on this.page
        // 90px * 90px
        // also draw page arrows if necessary
        // bin is 6x2
        
        // grab all assets of the category currently selected
        this.category = "Hats";
        let assets = this.assets.filter((asset) => asset.config.category == this.category);
        // take only 12 assets at the current page
        assets = assets.slice(12 * this.page, 12 * this.page + 12);
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
                context.drawImage(resources[r].img, x + offset.x, y + offset.y, 90, 90);
            }
            
            context.drawImage(assets[i].isEnabled ? this.sprites.asset_border_on : this.sprites.asset_border_off, x, y);
        }
        
        // only draw the arrows if there are enough assets & pages to warrant it
        if (assets.length > 12 * (this.page + 1)) {
            context.drawImage(this.sprites.arrow_right, 1002, 896);
        }
        
        if (this.page > 0) {
            context.drawImage(this.sprites.arrow_left, 6, 896);
        }
    }
}
