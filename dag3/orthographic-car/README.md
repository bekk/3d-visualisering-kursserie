# Orthographic car

I denne oppgaven lager vi et lite bilspill i en orthografisk verden. Det er ingen shaderprogrammering i denne oppgaven!

![Resultat Orthographic Car](./img/orthographic-car.gif)

## Utdelt oppsett

Du får den vanlige skjelettkoden utdelt, og det er lagt til noen tomme funksjoner for å oppmuntre deg til å strukturere koden din litt.

Du kjører koden med følgende kommando: 

(Kjøres fra mappen over, der hvor package.json er)

```sh
npm run orthographic-car
```

og fasiten kan kjøres med:

```sh
npm run fasit-orthographic-car
```

## TODO

TODO

- Lag bakke med 5x5 BoxGeometry
- Lag bil med BoxGeometry og og CylinderGeometry

- Styr bilen med piltastene
    + car.getWorldDirection(direction)
    + car.rotation.y

- Flytt kamera like langt som bilen har flyttet seg fra startposisjonen slik at det følger etter hele tiden

- Roter hjulene på bilen når den kjører
- Fall nedover og game over når man kjører ut av brettet
    + new THREE.Box3().setFromObject()
    + carBBox.intersectsBox(groundBBox)

- Lag poeng-kuler på tilfeldig plassering med SphereGeometry
- Lag hindre med på tilfeldig plassering med ConeGeometry

- Lag skygge med 
    + renderer.shadowMap
    + shadowLight.shadow
    + .receiveShadow
    + .castShadow

- Sjekk kollisjon med alle poeng og hindre
    + Fjern poeng-kuler når man tar poeng
    + Flytt bilen i motsatt retning av hinderet når man kolliderer med det

Ytelsestips:
- Gjenbruk samme Geometry- og Material-instans
