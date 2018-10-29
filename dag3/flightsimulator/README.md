# Flight simulator

I denne lager du en flight simulator med teksturert terreng:

![Resultat Flight Simulator](./img/resultat.gif)

## Utdelt oppsett

Du får den vanlige skjelettkoden utdelt, og det er lagt til noen tomme funksjoner for å oppmuntre deg til å strukturere koden din litt. Det er også utdelt tekstur og height map over vårt kjære Trondheim.

Du kjører koden med følgende kommando: 

(Kjøres fra mappen over, der hvor package.json er)

```sh
npm run flightsimulator
```

og fasiten kan kjøres med:

```sh
npm run fasit-flightsimulator
```

## Lag en flate

Vi trenger en flate å legge tekstur og terreng på. La oss legge til en helt basic plane:

```javascript
const geometry = new THREE.PlaneBufferGeometry(10, 10);

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    transparent: true,
});

const plane = new THREE.Mesh(geometry, material);

scene.add(plane);
```

Men hva ser vi da? Ingenting!

Det er fordi kameraet er midt i scenen akkurat der planet er. Vi flytter kamera bakover så vi kan debugge litt:

```javascript
camera.position.set(0, 3, 15);
```

Der ja. Men planet er jo ikke horisontalt, det er vertikalt. Det er fordi PlaneBufferGeometry by defult er den veien. Men heldigvis kan vi lett rotere geometrien. Og som vi husker fra matten er 180 grader det samme som halv pi:

```javascript
geometry.rotateX(-Math.PI/2); // Viktig med minus, ellers kommer baksiden opp
```

Flott. Da kan vi jo smøre Trondheim utover dette lerretet. 

## Tekstur

Vi har et bilde `img/texture.png` med satelittbilde. Åpne den og se litt på den. Ser det kjent ut?

For å legge det på flaten som en tekstur bruker vi Three.js sin særdeles praktiske TextureLoader:

```javascript
const map = THREE.ImageUtils.loadTexture('flightsimulator/img/texture.png');
```

Og denne kan vi bruke rett i shaderen vår som en uniform. Før har vi ikke gitt uniformene våre en type, fordi Three.js selv skjønner om det er en `float` eller `vec3`. Men nå må vi eksplisitt fortelle typen, og den typen er `"t"` for "texture":

```diff
const uniforms = {
+    textureMap: {type: "t", value: map},
};
```

og i **fragmentshaderen** er denne uniformen av typen `sampler2D`:

```c
uniform sampler2D textureMap;
```

Men vi har fortsatt ikke brukt teksturen til noe, så planet ser like hvitt ut som før. For å lese ut fargene i teksturen (såkalte texels) sampler vi denne teksturen på visse koordinater. På koordinatene (0,0) får vi fargen helt nederst i hjørnet, og på (1,1) får vi den øverst i hjørnet. 

Heldigvis slipper å regne ut nøyaktige koordinater fordi Three.js smetter inn en `uv`-variabel for hver vertex i `PlaneBufferGeometry`. Det er koordinatene som vertexen skal ha i en tekstur. I tekstur-land kalles disse som regel U og V, i stedet for X og Y. Siden `uv` er per vertex er det et `attribute`, og dermed har vi den kun tilgjengelig i vertexshaderen. Men vi kan som tidligere kopiere den over i en `varying` for å sende den til fragmentshaderen.

Så, altså, i **vertexshaderen** lager vi en ny `varying` for dette og gir den verdien til `uv`:

```diff
+varying vec2 textureCoord;

void main() {
+  textureCoord = uv;
...
}
```

og så i **fragmentshaderen** kan vi endelig bruke bruke `textureCoord` til å sample `textureMap`. Det gjøres med funksjonen `texture2D`: 

```diff
uniform sampler2D textureMap;
+varying vec2 textureCoord;

void main() {
+  gl_FragColor = texture2D(textureMap, textureCoord);
}
```

Nå skal du kunne skimte Trondheim og Trondheimsfjorden!

Men dere som har syklet i området rundt byen vet godt at det ikke er så flatt.

## Height map

Et height map er en tekstur som i stedet for farger har en gråtone som er lysere jo høyere punktet er. Vi har en height map `img/heightmap.png`. Åpne den og titt litt på den.

For å bruke height mapet henter vi den inn som en tekstur på akkurat samme måte som i sted. Gjør det nå. Du får ikke all koden med teskje nå, men bare kok koden fra forrige tekstur. Kall uniformen `heightMap`.

Nå kan vi bruke høydeprofilen til å dytte alle vertices opp y-aksen. Dytting skjer som tidligere i **vertexshaderen**:

```c
vec4 texel = texture2D(heightMap, textureCoord);
newPosition.y = texel.r; // Siden height mapet er grått er r, b og g helt like
```

Men ser det bra ut? Nei! Det ble bare et litt skrått plan! 

Hvorfor det? Et fint debuggingtriks er å skru på wireframe på materialet:

```diff
const material = new THREE.ShaderMaterial({
    ...
+    wireframe: true
});
```

Aha, vi ser at det er jo bare fire vertices på dette planet. Og siden vertexshaderen bare kan dytte på vertices dytter den bare de fire, og det blir jo ikke noe særlig til terreng.

Heldigvis er det støtte i `PlaneBufferGeometry` for å legge til vilkårlig antall faces i høyden og bredden. Det er to valgfrie argumenter til konstruktøren for det:

```javascript
const detailLevel = 16;
const geometry = new THREE.PlaneBufferGeometry(10, 10, detailLevel, detailLevel);
```

Der ja. Nå begynner det å ligne på noe!

Jo høyere detaljnivå vi setter, jo flere vertices blir det. Siden heightmap-filen er på 1251 x 901 piksler er det ikke noe poeng å ha den så mye høyere enn 512 eller 1024. Sett den så høyt som datamaskinen din trives med.

## Fysisk korrekt

Terrenget er ikke helt realistisk nå. Og det er blant annet fordi planet er 10 x 10, men height map-filen er 1251 x 901 piksler. Så den er strekt feil. Vi retter dette i geometrien:

```diff
-const geometry = new THREE.PlaneBufferGeometry(10, 10, detailLevel, detailLevel);
+const mapScale = 10;
+const geometry = new THREE.PlaneBufferGeometry(1.251*mapScale, 0.901*mapScale, detailLevel, detailLevel);
```

Et godt triks i visualisering av ekte ting er å la avstand 1 tilsvare 1 meter. Slik blir verdier som lengde og fart realistisk, og det føles mer ekte. Vi kan informere om at skalaen på height mapet er 1:43000. Så før vi går videre går vi over til å bruke realistiske størrelser:

```javascript
camera.position.set(0, 3000, 15000);

const mapScale = 43000;
```

Men da blir det helt flatt, fordi høyden vi setter i **vertexshaderen** må også justeres. Undersøker man `heightmap.png` ser vi at den sorte fargen midt i Trondheimsfjorden er `0x020202` og den grå fargen på toppen av Gråkallen (552 moh) er `0x878787`. `0x87` er et hexadesimalt tall, og `0x87 = 135`. Mens `0x02 = 2`.

Enkel matematikk sier dermed at høyden `H` i meter mellom en helt lys piksel `0xff = 255` og en helt mørk piksel `0x00 = 0` dermed er gitt av 

```
(135 - 2) / (255 - 0) = 522 / H
133 / 255 = 522 / H
133 / 255 * H = 522
H = 522 / 133 * 255
H = 1000.827
```

```c
float heightScale = 1000.827;
newPosition.y = texel.r * heightScale;
```

Eventuelt driter man såklart i hele matematikken og setter landskapet så høyt som er kult. F.eks. er 2000 mer spennende.

## Bevegelse

Selv om det ser bra ut er det ikke så mye flysimalator som det er en værballongsimulator akkurat nå. La oss få inn flyfølelsen ved å flytte kamera fremover. For å finne hvor kamera faktisk peker kan vi bruke `.getWorldDirection`:

```javascript
function moveCamera() {
    const moveSpeed = 15;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    camera.position.add(direction.multiplyScalar(moveSpeed));
}
```

Det naturlige neste steget er å kunne svinge dette flyet litt rundt. Da trenger vi tastatur-input. I den utdelte `util.js` er det en funksjon `addKeyListeners` som legger til lyttere for tastetrykk og legger resultatet i et hendig `keyPressed`-objekt med verdien 0 eller 1 for hver av piltastene:

```javascript
const keyPressed = {left: 0, right: 0, up: 0, down: 0};

util.addKeyListeners(keyPressed);
```

Og da kan vi forsøke oss på å styre kameraet:

```javascript
const rotateSpeed = 0.01;

camera.rotation.x += keyPressed.down * rotateSpeed;
camera.rotation.x -= keyPressed.up * rotateSpeed;

camera.rotation.y += keyPressed.left * rotateSpeed;
camera.rotation.y -= keyPressed.right * rotateSpeed;
```

Prøv å svinge litt rundt. Det er ikke helt riktig, er det vel? Det viser seg at rotasjon er litt vanskelig fordi `.rotation` i prinsippet tolkes slik at objektet skal først roteres langs x-aksen, så y-aksen, og så z-aksen. Men det gjør jo at aksene flytter på seg i forhold til hverandre!

Det er flere mulige løsninger på dette, men en av de enkleste er å lage et hierarki av objekter i scene graphen rundt `camera`, og så rotere hver enkelt av dem separat. Vi legger camera inn i en `cameraContainer`:

```diff
+let cameraContainer;

camera = new THREE.PerspectiveCamera(50, ratio, 0.1, 1000000);
-camera.position.set(0, 3000, 15000);
+cameraContainer = new THREE.Group();
+cameraContainer.position.set(0, 3000, 15000);
+cameraContainer.add(camera);
+scene.add(cameraContainer);

function moveCamera() {
-   camera.position.add(direction.multiplyScalar(moveSpeed));
+   cameraContainer.position.add(direction.multiplyScalar(moveSpeed));
}
```

Og da kan vi rotere `cameraContainer` langs y-aksen i stedet for `camera`. Da vil ikke `camera` sin x-akse-rotasjon påvirke containerens y-akse-rotasjon:

```diff
-camera.rotation.y += keyPressed.left * rotateSpeed;
-camera.rotation.y -= keyPressed.right * rotateSpeed;

+cameraContainer.rotation.y += keyPressed.left * rotateSpeed;
+cameraContainer.rotation.y -= keyPressed.right * rotateSpeed;
```

## Den kreative veien videre

Fra nå av må du være kreativ og utvikle flysimulatoren videre.

Implementer flykræsj, legg til andre fly, legg til sol og skyer, legg til Realfagsbygget, you name it!
