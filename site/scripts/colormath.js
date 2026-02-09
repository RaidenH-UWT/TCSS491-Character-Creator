function hsv(args) {
    if (args.length == 3) {
        return {h: args[0], s: args[1], v: args[2]};
    } else if (args.r && args.g && args.b) {
        const R = args.r / 255;
        const G = args.g / 255;
        const B = args.b / 255;
        
        const cMax = Math.max(R, G, B);
        const cMin = Math.min(R, G, B);
        const delta = cMax - cMin;
        
        if (delta == 0) {
            var H = 0;
        } else if (cMax == R) {
            var H = 60 * ((G-B) / delta % 6);
        } else if (cMax == G) {
            var H = 60 * ((B-R) / delta + 2);
        } else if (cMax == B) {
            var H = ((R-G) / delta + 4);
        }
        
        const S = cMax == 0 ? 0 : delta / cMax;
        const V = cMax;
    
        return {h: H, s: S, v: V} // TODO: transform from rgb to hsv
    } else if (typeof args == "string") {
        return hsv({
            r: parseInt(args.substr(args.length - 6, 2), 16),
            g: parseInt(args.substr(args.length - 4, 2), 16),
            b: parseInt(args.substr(args.length - 2, 2), 16)
        });
    }
}

function hueShift(img, shift) {
    
}

function setColor(img, color) {
    
}