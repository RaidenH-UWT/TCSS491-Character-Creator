// List of the names of premade extensions included in the program
const extensions = ["demo", "dragon"];

const extensionSpec = [];

/**
 * Loads the TOML data from each extension specified in the extensions list
 */
async function loadExtensions() {
    // Load the smol-toml library to parse extensions
    const TOML = await import("https://cdn.jsdelivr.net/npm/smol-toml@1.6.0/+esm");
    
    for (let i = 0; i < extensions.length; i++) {
        let extText = await fetch(`../extensions/${extensions[i]}/specification.toml`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not OK");
            }
            return response.text();
        });
        
        extensionSpec[i] = TOML.parse(extText);
        console.log(extensionSpec[i].name);
    }

    console.log(extensionSpec);
}

/**
 * Load an extension file (.zip) from the user
 * @param theFile .zip archive to load
 */
async function loadUserExtension(theFile) {
    const zip = await import("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js");
}

// async function listFolders() {
//     let dirListing = await fetch("../extensions").then(response => {
//         if (!response.ok) {
//             throw new Error("Network response not OK");
//         }
//         return response.text();
//     });
//     // i could do some unholy code in here to grab the folder names from the returned
//     // page, but i'm just gonna hardcode the premade extensions and handle user uploaded
//     // extensions seperately.
// }