// List of the names of premade extensions included in the program
const BASE_EXTENSIONS = ["demo"/*, "dragon"*/];

const extensionSpec = new Map();

/**
 * Load a specification.toml into the program along with it's assets
 * @param specFile String text of a specification.toml file
 */
async function loadSpec(specFile) {
    // Import the smol-toml library to parse the data
    const TOML = await import("https://cdn.jsdelivr.net/npm/smol-toml@1.6.0/+esm");
    const data = TOML.parse(specFile);
    
    // Don't overwrite extensions if there's a name collision
    if (extensionSpec.has(data.name)) {
        alert(`COLLISION\nExtension with name: ${data.name} already loaded`);
        return -1;
    } else {
        extensionSpec.set(data.name, data);
        console.log("Loaded " + data.name);
        console.log(extensionSpec);
        return data.name;
    }
}

/**
 * Loads the TOML data from each extension specified in the extensions list
 * @param theFilepath the local filepath to the specification.toml
 * @param theGame GameEngine to add assets to
 */
async function loadExtension(theFilepath, theGame) {
    console.log("loading " + theFilepath);
    let extText = await fetch(theFilepath)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not OK");
            }
            return response.text();
        });
    await loadSpec(extText);
}

/**
 * Load an extension file (.zip) from the user.
 * This function should only be called by the extensionUpload element.
 * @param theFile .zip archive to load
 * @param theGame GameEngine to add assets to
 */
async function loadUserExtension(theFile, theGame) {
    JSZip.loadAsync(theFile).then(async function (zip) {
        let text = await zip.file("specification.toml").async("string");
        let result = await loadSpec(text);
        if (result == -1) {
            return;
        }
        
        assets = extensionSpec.get(result).assets;
        
        for (asset of assets) {
            let resources = [];
            for (resource of asset.resources) {
                if (!Object.hasOwn(resource, "scale")) {
                    resource.scale = 1;
                }
                resources.push({data: await zip.file(resource.path.slice(1)).async("arraybuffer"), layer: resource.layer, x: resource.x, y: resource.y, scale: resource.scale});
            }
            // make new asset with extensionSpec.get(result) and resources
            // need to pass it back to the main engine. wokr on that.
        }
        // how i sent iamge data over
        result = await zip.file(extensionSpec.get("Demo Extension").assets[0].resources[0].path.slice(1)).async("arraybuffer");
        testing = new Tester(result);
    });
}

/**
 * Load all the base extensions
 * @param theGame GameEngine to add assets to
 */
async function loadBaseExtensions(theGame) {
    for (const extension of BASE_EXTENSIONS) {
        await loadExtension(`./extensions/${extension}/specification.toml`, theGame);
    }
}