// List of the names of premade extensions included in the program
const BASE_EXTENSIONS = ["demo", "dragon"];

const extensionSpec = new Map();

const extensionUploader = document.getElementById("extensionUpload");
extensionUploader.addEventListener("change", (event) => {
    for (file of event.target.files) {
        loadUserExtension(file);
    }
});

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
    } else {
        extensionSpec.set(data.name, data);
        console.log("Loaded " + data.name);
        console.log(extensionSpec);
    }
}

/**
 * Loads the TOML data from each extension specified in the extensions list
 * @param filepath the local filepath to the specification.toml
 */
async function loadExtension(filepath) {
    let extText = await fetch(filepath)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response not OK");
        }
        return response.text();
    });
    loadSpec(extText);
    // Create Assets for everything in the spec file
        
}

/**
 * Load an extension file (.zip) from the user.
 * This function should only be called by the extensionUpload element.
 * @param theFile .zip archive to load
 */
async function loadUserExtension(theFile) {
    JSZip.loadAsync(theFile).then(async function (zip) {
        let text = await zip.file("specification.toml").async("string");
        loadSpec(text);
        zip.forEach(async function (relativePath, zipEntry) {
            // Load all the resource files into the program
            if (zipEntry.name.includes(".png")) {
                // TODO: Send these files over to the game engine as Assets, so we save them
                // use the asset config from extensionSpec which should be loaded now
                // plus the file as a resource. might want to do this outside the forEach
                // actually, because each asset has specific resource(s) associated with it
            }
            // ignore any other files, we can't use them
        });
    });
}

/**
 * Load all the base extensions
 */
function loadBaseExtensions() {
    for (const extension of BASE_EXTENSIONS) {
        loadExtension(`./extensions/${extension}/specification.toml`);
    }
}