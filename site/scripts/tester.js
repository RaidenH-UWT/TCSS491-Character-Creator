class Tester {
    // currently dmeonstrates drawing an image from an arraybuffer
    constructor(resource) {
        this.resource = resource;
        
        console.log(this.resource);
        // console.dir(this.resource);
        
        let canvas = document.getElementById("creatorCanvas");
        let context = canvas.getContext("2d");
        let blob = new Blob([this.resource], {type: "image/png"});
        let img = new Image();
        img.onload = function() {
            context.drawImage(img, 0, 0);
        }
        
        img.src = URL.createObjectURL(blob);
    }
}