function hsv(args) {
    if (args.length == 3) {
        return {h: args[0], s: args[1], v: args[2]};
    } else if (typeof args == "string") {
        return hsv({
            r: parseInt(args.substr(args.length - 6, 2), 16),
            g: parseInt(args.substr(args.length - 4, 2), 16),
            b: parseInt(args.substr(args.length - 2, 2), 16)
        });
    } else if ('r' in args && 'g' in args && 'b' in args) {
        const R = args.r / 255;
        const G = args.g / 255;
        const B = args.b / 255;
        
        const cMax = Math.max(R, G, B);
        const cMin = Math.min(R, G, B);
        const delta = cMax - cMin;
        
        if (delta == 0) {
            var H = 0;
        } else if (cMax == R) {
            var H = 60 * (((G-B) / delta) % 6);
        } else if (cMax == G) {
            var H = 60 * (((B-R) / delta) + 2);
        } else if (cMax == B) {
            var H = 60 * (((R-G) / delta) + 4);
        }
        
        const S = cMax == 0 ? 0 : delta / cMax;
        const V = cMax;
    
        return {h: Math.round(H * 100) / 100, s: Math.round(S * 10000) / 10000, v: Math.round(V * 10000) / 10000}
    }
}

function hsl(args) {
    const hsv = this.hsv(args);
    const H = hsv.h;
    const L = hsv.v * (1 - hsv.s / 2);
    const S = L == 0 || L == 1 ? 0 : (hsv.v - L) / Math.min(L, 1 - L);
    return {h: H, s: S, l: L};
}

function rgb(args) {
    if (args.length == 3) {
        return {r: args[0], g: args[1], b: args[2]};
    } else if (typeof args == "string") {
        return {
            r: parseInt(args.substr(args.length - 6, 2), 16),
            g: parseInt(args.substr(args.length - 4, 2), 16),
            b: parseInt(args.substr(args.length - 2, 2), 16)
        }
    } else if ('h' in args && 's' in args && 'v' in args) {
        const transform = (n) => {
            const k = (n + args.h / 60) % 6;
            return args.v - args.v * args.s * Math.max(0, Math.min(k, 4 - k, 1));
        };
        return {r: Math.round(transform(5) * 255), g: Math.round(transform(3) * 255), b: Math.round(transform(1) * 255)};
    }
}

function colorToCSS(obj) {
    if ('r' in obj && 'g' in obj && 'b' in obj) {
        return `rgb(${obj.r} ${obj.g} ${obj.b})`;
    } else if ('h' in obj && 's' in obj && 'l' in obj) {
        return `hsl(${obj.h} ${obj.s * 100} ${obj.l * 100})`;
    }
}

function hueShift(img, shift) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        let forward = this.rgb([data[i], data[i+1], data[i+2]]);
        let transform = this.hsv(forward);
        transform.h = (transform.h + Math.abs(shift)) % 360;
        let back= this.rgb(transform);
        data[i] = back.r;
        data[i+1] = back.g;
        data[i+2] = back.b;
        data[i+3] = data[i+3];
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.putImageData(imageData, 0, 0);
    const newImg = new Image();
    newImg.src = canvas.toDataURL();
    
    return newImg;
}

function setColor(img, color) {
    
}