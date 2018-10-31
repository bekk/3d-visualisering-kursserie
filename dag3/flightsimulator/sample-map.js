function initHeightMapPixels() {
    canvas = document.createElement("canvas");
    img = new Image();
    img.src = "flightsimulator/img/heightmap.png";

    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
}

function sampleHeightMap(x, y) {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(x, y, 1, 1).data
}
