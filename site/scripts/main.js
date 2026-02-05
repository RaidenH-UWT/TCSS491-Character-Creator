const DEBUG = {error: true, loader: false, io: false, ui: false, visualization: false, step: false, other: false};

const assetManager = new AssetManager();
const gameEngine = new GameEngine();

const extensionUploader = document.getElementById("extensionUpload");
extensionUploader.addEventListener("change", (event) => {
    for (file of event.target.files) {
        addUserExtension(file);
    }
});

const debugButton = document.getElementById("debug");
debugButton.addEventListener("click", (event) => {
   gameEngine.draw(); 
});

async function startGame() {
    const canvas = document.getElementById("creatorCanvas");
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    
    gameEngine.init(context);
    
    await loadBaseExtensions();
    
    if (DEBUG.loader) console.log("loaded base");
    for (extension of extensionSpec.keys()) {
        if (DEBUG.loader) console.log(extensionSpec.get(extension).name);
        let assets = extensionSpec.get(extension).assets;
        // Download all resources to the cache
        for (asset of assets) {
            for (resource of asset.resources) {
                assetManager.queueDownload(`./extensions/${extensionSpec.get(extension).namespace}${resource.path}`);
            }
        }
    }
    
    assetManager.queueDownload("./assets/guides.png");
    assetManager.queueDownload("./assets/ui_background.png");
    assetManager.queueDownload("./assets/tab_left.png");
    assetManager.queueDownload("./assets/tab_mid.png");
    assetManager.queueDownload("./assets/tab_right.png");
    assetManager.queueDownload("./assets/asset_border_on.png");
    assetManager.queueDownload("./assets/asset_border_off.png");
    assetManager.queueDownload("./assets/arrow_left.png");
    assetManager.queueDownload("./assets/arrow_right.png");
    
    
    assetManager.downloadAll(function() {
        const ui = new UserInterface(gameEngine);
        gameEngine.ui = ui;
        
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
        
        if (DEBUG.other) console.log("starting");
        
        if (DEBUG.step) {
            gameEngine.draw();
            
            showDebug();
        } else {
            gameEngine.start();
        }
    });
}

/**
 * Called when the user uploads a new extension.
 */
async function addUserExtension(theFile) {
    await loadUserExtension(theFile, gameEngine);
    setTimeout(() => { gameEngine.draw() }, 10);
}