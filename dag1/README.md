# Del 1: Intro til WebGL og `three.js`

## Introduksjonsforelesning

[Slides om WebGL og 3D programmering](https://bekk.github.io/avansert-visualisering-kursserie/dag1/slides/om-3d-visualisering.html)

[Slides om three.js](https://bekk.github.io/avansert-visualisering-kursserie/dag1/slides/om-threejs.html)

## Oppgaver

- [Oppgave 1](#oppgave-1)
- [Oppgave 2](#oppgave-2)
- [Oppgave 3](#oppgave-3)

## Oppgave 1

> Hello three.js

Du skal lage en snurrende kube. Den ultimate introen til WebGL og three.js

### Komme i gang

Du har fått utdelt noe kode som du finner i `dag1`-mappen.

```sh
dag1/
├── README.md                   # Denne teksten
├── fasit                       # Fasiten på de ulike oppgavene
├── index.html                  # HTML-fila som kjører koden vår
├── index.js                    # JS-fila som blir kjørt
├── node_modules                # Her havner alle avhengighetene
├── package-lock.json           # Oversikt over versjonsnummere etc
├── package.json                # Avhengigheter etc
└── slides                      # Slides som har blitt vist frem
```

For å sparke igang utviklingsprosessen, gjør følgende i en terminal:

```sh
cd sti/til/avansert-visualisering-kursserie/dag1
npm start
```

Så åpner du `http://localhost:9966` i din utvalgte nettleser.

Du skal da kunne se teksten `Velkommen til kurs!` på skjermen.

### Skrive kode

All kode kan skrives i `index.js`-fila du finner i denne mappa. Prosessen du startet i sted vil sørge for at nettleseren blir oppdatert med nyeste kode når du lagrer den fila.

Hvis du på et eller annet tidspunkt føler for å putte kode i flere filer har du et par valg:

1.  Putte JavaScript-kode i en annen fil og bruke koden fra `index.js`.

    For å gjøre dette kan du benytte deg av node.js' modul system, som du kan lese mer om her: https://nodejs.org/dist/latest-v10.x/docs/api/modules.html#modules_modules

2.  Putte noe annet i en fil og bruke innholdet i fila fra `index.js`.

    For å gjøre dette kan du lese innholdet til fila med `fs`-modulen til node.js:

    ```js
    const fs = require("fs");
    const fileContents = fs.readFileSync(`${__dirname}/path/to/file`, "utf8");
    ```

Ellers er det fritt fram for JS-syntax som er støtta av din utvalgte nettleser. Vi har ikke lagt inn noe som oversetter syntax for å holde oppsettet så enkelt som mulig.

I `index.js`-fila er det laget en veldig enkel boilerplate:

```js
// Henter inn three.js
const THREE = require("three");

// Her kan du putte kode som bare skal gjøres en gang
function init() {}

// Her kan du putte kode som skal gjøres hver "frame"
function render() {
  // requestAnimationFrame sørger for å køe et nytt kall til render
  requestAnimationFrame(render);
}

// Kall init-koden
init();
// Spark igang render-loopen
render();
```

### Lage `three.js` renderer, scene og kamera

De første tingene du må lage for å komme i gang med `three.js` er:

- en renderer til å tegne ting på skjermen
- en scene som kan holde på elementene du vil tegne
- et kamera som styrer hva du "ser" i scena.

For å lage en renderer bruker du [`WebGLRenderer`](https://threejs.org/docs/index.html#api/renderers/WebGLRenderer) fra `three.js`. Hvis du ikke sender inn noen parametre til den vil den automatisk opprette et `canvas`-element for deg, som vil fungere som kontekst for WebGL-visualiseringen din.

```js
let renderer;
renderer = new THREE.WebGLRenderer();
```

Du kan også sette høyde og bredde på renderen. En veldig vanlig ting å gjøre her er å sette høyde og bredde til størrelsen på browservinduet.

```js
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
renderer.setSize(WIDTH, HEIGHT);
```

Renderen oppretter som sagt et `canvas`-element for deg, hvis du ønsker å se noe som helst må du legge til det elementet på nettsiden.

```js
document.body.appendChild(renderer.domElement);
```

Men for at renderen skal kunne rendre noe må den ha en scene og et kamera.

En [`Scene`](https://threejs.org/docs/index.html#api/scenes/Scene) er en gruppering av objekter som visualiseringen din består av. Å initiere en scene kan du gjøre på denne måten:

```js
let scene;
scene = new THREE.Scene();
```

Senere kommer vil også til å legge til objekter i scenen, men dette holder for nå.

Vi trenger også et kamera til å beskue scenen. Det finnes mange ulike kamera som har ulike egenskaper, men for vårt formål passer et [`PerspectiveCamera`](https://threejs.org/docs/index.html#api/cameras/PerspectiveCamera) utmerket. Det er laget for å ligne måten vi mennesker ser ting og det har forholdsvis enkle egenskaper.

```js
let camera;
camera = new THREE.PerspectiveCamera(fov, WIDTH / HEIGHT, near, far);
```

`PerspectiveCamera` tar fire argumenter:

1.  Field of View. Hvor mange grader er synsfeltet til kameraet?
2.  Aspect Ratio. Hva er forholdet mellom høyde og bredde?
3.  Near. Hvor nærme må noe være for å være nærme? Dette påvirker synligheten til objekter.
4.  Far. Hvor langt unna må noe være for å være langt unna? Dette påvirker også synligheten til objekter.

`fov` er gjerne en verdi mellom 0 og 90 grader. For vårt formål er en verdi mellom 45 og 70 godt egna.

`near` og `far` styrer hvilke objekter kameraet ser. For vårt formål er `0.01` og `1000` egna verdier. Da vil objekter som befinner seg mellom `0.01` og `1000` i koordinatsystemet være synlige.

Nå som vi har både en scene og et kamera kan vi be rendereren om å tegne ting

```js
renderer.render(scene, camera);
```

Det er fortsatt ikke stort å se, for vi har ingen objekter i scenen. Men hvis du får en svart skjerm er sansynligheten stor for at ting er OK.

### Hello Cube!

Vår første oppgave er å få en kube til å vises på skjermen. For å få til det trenger vi å lage en kube. En kube er et objekt, og de fleste objekter i `three.js` består av en geometri og et materiale. Geometrien avgjør formen på objektet og materiale avgjør utseende.

Den enkleste objekttypen er noe som kalles [`Mesh`](https://threejs.org/docs/index.html#api/objects/Mesh) som består av en masse trekanter, som vi vet WebGL er veldig glad i. Det er denne objekttypen vi vil bruke til å lage kuben vår.

Som nevnt trenger vi også en geometri, `three.js` har en hendig metode klar til bruk som heter [`BoxGeometry`](https://threejs.org/docs/#api/geometries/BoxGeometry). Den metoden tar inn tre verdier (høyde, bredde og dybde) og gir oss tilbake en geometri som representerer en boks (eller en kube) med de samme verdiene. Her er det bare å leke seg med verdiene og se på effekten.

```js
let geometry = new THREE.BoxGeometry(1, 1, 1);
```

Vi trenger også et materiale. `three.js` kommer med mange ulike materialer ut av boksen, men et veldig enkelt materiale som lar oss se full 3D-effekt er [`MeshNormalMaterial`](https://threejs.org/docs/#api/materials/MeshNormalMaterial). Det fargelegger geometrien basert på hvilken vei normal-vektoren peker.

```js
let material = new THREE.MeshNormalMaterial();
```

Nå kan vi kombinere de tre tingene og lage en ferdig kube

```js
let cube;
function makeCube(height, width, depth) {
  let geometry = new THREE.BoxGeometry(height, width, depth);
  let material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
}
```

For at kuben skal vises i visualiseringen vår må vi legge den til scena

```js
scene.add(cube);
```

Men du ser antageligvis ingenting! Det er fordi kameraet vårt for øyeblikket befinner seg på akkurat samme posisjon som kuben. Hvis vi flytter kameraet et stykke bakover, vil ting bli synlig.

```js
camera.position.z = 5;
```

Det var kanskje litt uimponerende, kuben ser helt flat ut. Men det kan vi fikse på ved å rotere kuben litt.

### Rotere kuben

Alle objekter i `three.js` har noen attributter som styrer hvor de befinner seg, hvor store de er og hvilken vei de er rotert. Vi har allerede sett et eksempel på dette når vi endret posisjonen til kameraet for å se kuben.

For å endre på hvilken vei kuben vår er rotert kan vi sette noen verdier på rotasjonen til kuben.

```js
cube.rotation.x = 1;
cube.rotation.y = 0.5;
cube.rotation.z = 1.25;
```

Da vil du kunne se at kuben har distinkte sider og faktisk er et 3D-objekt!

Men vi kan ta dette et steg videre og la kuben spinne av seg selv. For å få til det må vi endre rotasjonen litt hver frame og be rendereren om å tegne ting på nytt.

```js
const SPEED = 0.01;
function rotateCube() {
  cube.rotation.x -= SPEED;
  cube.rotation.y -= SPEED;
  cube.rotation.z -= SPEED;
}
```

Denne funksjonen kan du kalle inne i den funksjonen som blir kalt hver frame (hvis du har beholdt boilerplaten så heter den `render`), sammen med et nytt kall til rendereren's render-metode:

```js
renderer.render(scene, camera);
```

Gratulerer, du har nå en snurrende kube!

Lek deg litt med de ulike verdiene og se hva som skjer med kuben. Noen forslag fra vår side:

- Gi kuben ulik rotasjonshastighet i de ulike retningene
- Endre størrelsen på kubens geometri
- Endre på attributtene til kameraet (near, far, where ever you are 🎶)
- Endre på posisjonen til kameraet.

## Oppgave 2

> Dancing cubes!

Du skal gjøre om din snurrende kube til et ensemble av dansende kuber!

## Oppgave 3

> Shader-introduksjon

I denne oppgaven skal vi bruke shadere til å fargelegge kubene fra forrige oppgave i henhold til lydstyrken:

![Resultat Shader Intro](./img/fasit.gif)

Teori
-------------

Vertex- og fragment shadere jobber sammen for å beregne pikslene på skjermen. Når man bruker three.js setter den inn automatisk sine egne innebygde shadere som tar hensyn til attributtene på hver Mesh. Men for fullstendig kreativ frihet skriver man sine egne shadere.

Shadere er skrevet i et C-lignende språk blir kompilert av webgl og sendt til GPU-en. Når shaderkoden kjører på GPU-en har den sitt eget minne på skjermkortet og kjører helt separat fra CPU-en og resten av datamaskinen. Alle vertices og faces lastes over til GPU-minnet av webgl, og er dermed inputen til shaderkoden. Outputen er hvilken farge hver enkelt piksel skal ha på skjermbildet. Denne prosessen kalles rendering.

### Render pipeline

For å oppnå høy ytelse er renderingen arrangert i en pipeline med definert inn- og ut-verdier:

(Diagram av data (vertices, faces) inn til vertex shader, output (skjermkoordinater) til fragment shader, output (rgba-verdier) til skjerm-buffer)

### Data fra Javascript til GPU

I tillegg til vertices og faces er det mulig å sende over mer vilkårlige data som kan brukes av shaderne. Det kan være tall, vektorer og array av vektorer, og inneholder typisk fargeverdier, teksturer, animasjonsparametere og andre verdier man har tenkt å bruke i shaderne.

Javascript-koden kjører på CPU-en og har tilgang til datamaskinens vanlige minne. For å holde ytelsen høy er det nøye definert i webgl når og hvordan man kan sende innholdet i variablene sine til shaderen på GPU-en. I denne oppgaven skal vi bruke en `uniform` variabel for å sende klokketidspunktet for hver rendret frame. Slik får vi en tidsvariabel som vi kan bruke i shaderne for å fete ting™.

### Oppsett i three.js

Three.js gjør det veldig enkelt å skifte fra de innebygde shaderne og materialene til egenskrevne:

```javascript
const material = new THREE.ShaderMaterial({
    uniforms: uniforms, // Objekt med uniform-variabler
    vertexShader: vertexShaderCode, // String med vertexshader-koden
    fragmentShader: fragmentShaderCode, // String med fragmentshader-koden
    transparent: true, // Betyr at alpha-verdien skal brukes for gjennomsiktighet i tillegg til RGB
});
```

`uniforms` er et objekt med info om uniform-variablene:

```javascript
const uniforms = {
    time: {value: 0.0},
};
```

Selve shaderkoden er det mest praktisk å lagre i en separat fil som leses inn:

```javascript
const fragmentShaderCode = fs.readFileSync(__dirname + '/fragmentshader.glsl', 'utf8');
```

### Vertexshader

(Si at vertex shader skal vi lære om på dag 2)

### Fragmentshader

(Forklar oppbygningen)

```c
uniform float time;

void main() {
  // gl_FragColor er output som en vektor av (r, g, b, a)
  gl_FragColor = vec4(1.0, 0.25, 0.25, 1.0);
}
```

### WebGL shader language

WebGL shader language er det språket shaderne skrives i, og det ligner veldig mye på C, som igjen ligner veldig mye på gammeldags JavaScript. En viktig forskjell er at det er veldig strengt på at alt er helt riktig, og det er mange innebygde operasjoner for vektor- og matrise-regning.

```c
// Deklarasjoner

float a = 42.0; // Flyttall (desimaltall)
float b = 42;  // FEIL pga manglende desimaltall til float
int c = 42; // Heltall
bool d = true; // Boolean

vec3 minVektor = vec3(2.0, 1.5, 0.5); // Vektor. vec2 og vec4 går også an

float minProsedyre(float t) { // Prosedyre som kan kalles
  t = t - 1;
  return t*t*t + 1.0;
}

float minVerdi = minProsedyre(2.3); // Kall på prosedyren
```

```c
// Operasjoner

float e = (a + c) / 23.0;

vec3 lengerVektor = minVektor * 3.0; // Vektor ganger skalar! (x * 3.0, y * 3.0, z * 3.0)
vec3 prikk = minVektor * annenVektor; // Prikkprodukt! OMFG

float f = sin(0.5); // sinus
float g = pow(2.0, 8.0); // 2^8
```

De fleste matematiske og geometriske operasjoner man trenger er definert: http://www.shaderific.com/glsl-functions/

```c
// Kontrollstrukturer

if (a == 2.0) {
    b = 3.0;
}

for (float i = 0.0; i < 10.0; i++) {
    // kode
}
```

Flere detaljer kan finnes på side 3 og 4 her: https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf

### Lydstyrke

Det er mange måter å beregne lydstyrke på, men en som er ganske enkel er å summere styrken på alle frekvensene fra lydanalysen. Da får man et høyt tall på flere tusen som kanskje bør skaleres ned.
