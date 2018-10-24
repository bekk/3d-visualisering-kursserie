exports.addKeyListeners = function(keyPressed) {
    Object.assign(keyPressed, {left: 0, right: 0, up: 0, down: 0});

    const keyCodeMapping = {
        38: "up",
        37: "left",
        40: "down",
        39: "right"   
    }

    function onKey(event) {
        const keyName = keyCodeMapping[event.keyCode];
        keyPressed[keyName] = event.type == "keydown" ? 1 : 0;
    }

    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKey);
}

exports.random = function(min, max) {
  return min + Math.random()*(max-min);
}