# Flight simulator

I denne lager du en flight simulator med teksturert terreng:

![Resultat Flight Simulator](./img/TODO.gif)

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