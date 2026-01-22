const gameEngine = new GameEngine(debug = false);
const assetManager = new AssetManager();

const extensionUploader = document.getElementById("extensionUpload");
extensionUploader.addEventListener("change", (event) => {
    for (file of event.target.files) {
        addUserExtension(file);
    }
});

async function startGame() {
    const canvas = document.getElementById("creatorCanvas");
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    
    gameEngine.init(context);
    
    await loadBaseExtensions();
    
    console.log("loaded base");
    for (extension of extensionSpec.keys()) {
        console.log(extensionSpec.get(extension).name);
        let assets = extensionSpec.get(extension).assets;
        // Download all resources to the cache
        for (asset of assets) {
            for (resource of asset.resources) {
                assetManager.queueDownload(`./extensions/${extensionSpec.get(extension).namespace}${resource.path}`);
            }
        }
    }
    
    assetManager.downloadAll(function() {
        // Add assets to the game engine
        for (extension of extensionSpec.keys()) {
            let assets = extensionSpec.get(extension).assets;
            for (asset of assets) {
                let resources = [];
                for (resource of asset.resources) {
                    if (!Object.hasOwn(resource, "scale")) {
                        resource.scale = 1;
                    }
                    resources.push({data: assetManager.getResource(`./extensions/${extensionSpec.get(extension).namespace}${resource.path}`), layer: resource.layer, x: resource.x, y: resource.y, scale: resource.scale});
                }
                gameEngine.addAsset(new Asset(asset, resources));
            }
        }
        
        // console.log("starting");
        // gameEngine.start();
        gameEngine.draw();
    });
}

/**
 * Called when the user uploads a new extension.
 */
async function addUserExtension(theFile) {
    await loadUserExtension(theFile, gameEngine);
    setTimeout(() => { gameEngine.draw() }, 10);
}