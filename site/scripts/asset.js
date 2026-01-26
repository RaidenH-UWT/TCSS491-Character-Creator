/**
 * This is a class representing a basic asset
 * @param config the data representing this asset, which contains all the necessary
 * information about the asset.
 * @param resources array of Image and/or ArrayBuffer objects associated with this asset.
 */
class Asset {
    constructor(config, resources) {
        this.config = config;
        this.resources = [];
        // these coords are relative; all assets start at 0 and their resources are offset by their respective coords
        // by this method i can modify the asset coords when the user moves it, then reset to 0 for original position.
        this.x = 0;
        this.y = 0;

        // whether this asset is currently toggled or not. I plan to implement something a bit more sophisticated.
        this.isEnabled = false;
        
        for (resource of resources) {
            let img = new Image();
            if (resource.data instanceof ArrayBuffer) {
                img.src = URL.createObjectURL(new Blob([resource.data], {type: "image/png"}));
            } else {
                img = resource.data;
            }
            
            this.resources.push({asset: this.config.name, img: img, layer: resource.layer, x: resource.x, y: resource.y, scale: resource.scale});
        }
    }
    
    update() {
        // handle movement in here
    }
    
    draw(context) {
        for (resource of this.resources) {
            console.log(resource.img);
            context.drawImage(resource.img, this.x + resource.x, this.y + resource.y, resource.scale * resource.img.width, resource.scale * resource.img.height);
        }
    }
}
