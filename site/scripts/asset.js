/**
 * This is a class representing a basic asset
 * @param config the data representing this asset, which contains all the necessary
 * information about the asset.
 * @param resources array of Image objects for this asset.
 */
class Asset {
    constructor(config, resources) {
        this.config = config;
        this.resources = [];
        
        downloader = new AssetManager();
        
        for (resource of resources) {
            let img = new Image();
            let source;
            if (typeof resource == "arraybuffer") {
                source = URL.createObjectURL(new Blob([resource], {type: "image/png"}));
            } else {
                source = resource;
            }
            
            img.src = source;
            
            this.resources.push(img);
            console.log(img);
        }
        
        downloader.downloadAll(
    }
}