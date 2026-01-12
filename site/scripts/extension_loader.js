import TOML from 'https://esm.sh/smol-toml@1.6.0'

var demoSpec;

async function loadTOML() {
    let demoFile = await fetch("../extensions/demo/specification.toml")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response not OK");
            }
            return response.text();
        });

    demoSpec = TOML.parse(demoFile);
    console.log(demoSpec);
    console.log(demoSpec.name);
}

async function listFolders() {
    let dirListing = await fetch("../extensions").then(response => {
        if (!response.ok) {
            throw new Error("Network response not OK");
        }
        return response.text();
    });
    console.log(dirListing);
    let dirList = dirListing.getElementsByTag("ul")[0];

    console.log(dirList);
}

// await loadTOML();
await listFolders();
