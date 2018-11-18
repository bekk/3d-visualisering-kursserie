### Gjør morsomme ting med lyd(Fortsettelse av dag 1 oppgave 3)

Vi skal i denne oppgaven ta utgangspunkt i løsningen din fra oppgave 3 fra dag 1 og gjøre følgende for å få noe som ligner på resultatet i bildet over:
1. Få rødheten til lydsøylene til å avhenge av høyden på lydsøylen
2. Få lydsøylene til å rotere

Hvis du ikke vil ta utgangspunkt i din egen løsning kan du ta utgangspunkt i løsningsforslaget som ligger i play-with-sound-mappen

##### Rødhet til lydsøylene

For å få rødheten til lydsøylene til å avhenge av høyden på lydsøylen må vi kaste ut shaderen og bestemme fargen til søylene i Javascripten. 

Kaste ut shader og erstatte materialet med BasicMeshMaterial:
```diff
- const fragmentShaderCode = fs.readFileSync(
-   __dirname + "/fragmentshader.glsl",
-   "utf8"
- );
...
- const UNIFORMS = {
-   soundLevel: { value: 0.0 }
- };
...
-  const material = new THREE.ShaderMaterial({
-    uniforms: UNIFORMS,
-    fragmentShader: fragmentShaderCode
-  });
+ const material = new THREE.MeshBasicMaterial( { color: 0xff0000} )); //rød
...
-  let soundLevel = 0;
-  for (let i = 0; i < frequencies.length; i++) {
-    soundLevel = soundLevel += frequencies[i];
-  }
-  UNIFORMS.soundLevel.value = soundLevel;
```
Når det nå er borte kan vi begynne å bli kreative med søylene. For hver søyle setter vi som kjent høyden til hver kube med følgende loop:
```
  cubes.forEach((c, i) => {
    const freq = normalise(min, max, frequencies[i]);
    c.scale.set(1, freq, 1);
  });
```

Her inne har vi en freq-variabel vi scaler kubene med. Bruk den samme variabelen til å regne ut en hexadesimal fargekode for rød som blir rødere jo høyere frekvensen er. Sett så fargen med følgende kode:
```
  c.material.color.setHex( colorhex );
```

Hint: en farge-hex består av en rød, en gul og en blå del. det er kun den røde delen du trenger å bry deg om her. 0xff0000 er helt rød og 0x000000 er selvfølgelig helt fargeløs.

##### Rotasjon til lydsøylene
Gjør nå det samme for rotasjonen til kubene om x-aksen. Vi vil oppnå større rotasjon ved en høyere freq-verdi. Man kan rotere kubene med følgende innebygde funksjon. Husk at vinkelen er i radianer

```
c.rotateX(angle);
```
##### dat.gui
Til slutt kan du parametrisere det hele ved hjelp av dat.gui. Parametre her kan være fart på rotasjon, bakgrunnsfarge, etc.