
Oppgave 3 - Shader-introduksjon
===============================

I denne oppgaven skal vi bruke shadere til å fargelegge en kube:

![Resultat Shader Intro](./img/shader-intro.gif)

Utdelt oppsett
---------------

Filene med `(*)` må endres for å løse oppgaven

```javascript
oppgave-3-shader-intro/
├── (*) fragmentshader.glsl     // Koden for fragment shader
├── index.html                  // Html-en ligger her, og starter index.js
├── (*) index.js                // Javascriptet ligger her
├── package.json                // Byggekonfigurasjonen til npm
├── (*) vertexshader.glsl       // Kode for vertex shader
└── README.md                   // Denne readme-filen
```

Bygging og kjøring
------------------

Bygg med `npm install`. Dette gjøres typisk kun 1 gang.

Kjør med `npm start`. Dette vil åpne en utviklings-server som serverer applikasjonen og oppdaterer seg automatisk hver gang du lagrer filer.

Teori og tips
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

(Forklar oppbygningen til koden til en vertex shader)

(Variablene, main-metoden, matriseregningen, outputen som er vec4 med x,y,Z og den rare W)

TODO: Sats på at Stian forklarer vertexshader på dag 2

```c
uniform float time;

void main() {
  // position er vertex-koordinatene gitt av webgl til shaderen
  vec4 modelSpaceCoordinates = vec4(position.x, position.y, position.z, 1.0);

  // modelViewMatrix inneholder modellens translasjon og rotasjon
  vec4 worldSpaceCoordinates = modelViewMatrix * modelSpaceCoordinates;

  // projectionMatrix projiserer til 2D
  vec4 screenSpaceCoordinate = projectionMatrix * worldSpaceCoordinates;

  // gl_Position er output som en vektor av (x, y, z, w)
  gl_Position = screenSpaceCoordinate;
}
```

### Fragmentshader

(Forklar oppbyngingen)

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

### Uniform, attribute og varying
(-> TODO: FLYTT DETTE KAPITLET TIL DAG 2)

I webgl er det definert tre typer variabler som shaderkoden bruker. Forskjellen mellom dem er
 
- når de kan endres
- hvilken kode som kan lese dem
- når de leses, om man får verdien deres direkte eller en interpolasjon mellom to nabo-verdier

De tre typene er

- `uniform` Variabler som kan skrives av Javascript-koden og sendes over 1 gang per rendret bilde, er read-only for shaderne og har samme globale verdi for alle vertices og alle piksler til hvert Mesh
-- For eksempel tid, museposisjon, animasjonshastighet, osv
-- Hensikten med dette er at GPU-en så kan kjøre shaderkoden uten å gjøre flere trege dataoverføringen fra resten av datamaskinen
- `attribute` Samme som uniform, men kan kun leses i vertex shader, og skal ha en separat verdi for hver eneste vertex
-- For eksempel farge, teksturkoordinat, osv
-- Hensikten med denne typen er at GPU-en kan optimalisere minnet og kjernene sine slik at flest mulig beregninger kan kjøre samtidig uten å måtte snakke sammen
- `varying` Kan ikke skrives til av Javascript-koden, men av vertexshaderen. Får dermed en separat verdi per vertex. Men den kan leses av fragmentshaderen, og den verdien som leses da er interpolert mellom de tre vertexene som pikselen er mellom
-- Typisk eksempel er den interpolerte fargen pikselen skal ha fra en tekstur. Men generelt er denne typen brukt hvis man vil at vertexshaderen skal beregne en verdi som fragmentshaderen igjen skal bruke til å beregne fargen. Slik kan vertex shader og fragment shader snakke sammen.

Fasit
------

Se i mappen `fasit-shader-intro` for en mulig løsning med forklaringer i koden. 

Det er viktig å huske at det er som regel veldig mange forskjellige måter å lage samme visualisering på. Det kan også hende at fasiten har med ekstra visuelle effekter fordi forfatterne liker å leke seg litt.

