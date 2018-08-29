const THREE = require("three");

function init() {
  // Disse tre linjene kan du slette når du starter på din egen kode
  const hello = document.createElement("p");
  hello.innerText = "Velkommen til kurs!";
  document.body.appendChild(hello);
}

function render() {
  requestAnimationFrame(render);
}

init();
render();
