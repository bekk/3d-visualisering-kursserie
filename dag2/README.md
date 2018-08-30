# Del 2: Dypdykk i shaderprogrammering

## Oppgaver

- [Oppgave 4](#oppgave-4)
- [Oppgave 5](#oppgave-5)
- [Oppgave 6](#oppgave-6)

## Oppgave 4

> Interaktiv stjerne

I denne oppgaven skal vi bruke en fragmentshader til å lage en fin stjerne med interaktive kontrollere:

![Resultat Shader Intro](./bilder/fasit-oppgave4-controlpanel-small.gif)

### Utdelt oppsett

I mappen `oppgave-4-fragment-shader` finner du et oppsett som ligner det vi lagde på dag 1, men uten noe innhold. Her skal du skrive koden for denne oppgaven.

### Teori

Siden det er flere dager siden forrige gang kan det være greit å friske opp teorien fra siste oppgave den forrige kursdagen før man går videre: (LINK TIL OPPGAVE-3-SHADER-INTRO)

### Uniform, attribute og varying

Vi har lært om `uniform`, men i webgl er det faktisk definert tre typer variabler som shaderkoden bruker. Forskjellen mellom dem er
 
- når de kan endres
- hvilken kode som kan lese dem
- når de leses, om man får verdien deres direkte eller en interpolasjon mellom to nabo-verdier

De tre typene er

- `uniform` Variabler som kan skrives av Javascript-koden og sendes over 1 gang per rendret bilde, er read-only for shaderne og har samme globale verdi for alle vertices og alle piksler til hvert Mesh
  - For eksempel tid, museposisjon, animasjonshastighet, osv
  - Hensikten med dette er at GPU-en så kan kjøre shaderkoden uten å gjøre flere trege dataoverføringen fra resten av datamaskinen
- `attribute` Samme som uniform, men kan kun leses i vertex shader, og skal ha en separat verdi for hver eneste vertex
  - For eksempel farge, teksturkoordinat, osv
  - Hensikten med denne typen er at GPU-en kan optimalisere minnet og kjernene sine slik at flest mulig beregninger kan kjøre samtidig uten å måtte snakke sammen
- `varying` Kan ikke skrives til av Javascript-koden, men av vertexshaderen. Får dermed en separat verdi per vertex. Men den kan leses av fragmentshaderen, og den verdien som leses da er interpolert mellom de tre vertexene som pikselen er mellom
  - Typisk eksempel er den interpolerte fargen pikselen skal ha fra en tekstur. Men generelt er denne typen brukt hvis man vil at vertexshaderen skal beregne en verdi som fragmentshaderen igjen skal bruke til å beregne fargen. Slik kan vertex shader og fragment shader snakke sammen.

### Anatomy of a star

(Forklar at vi vil bruke polarkoordinater for å lage stjernen, fordi da kan vi ha forskjellige intensitet i sentrum, og vi kan ha stråler som varierer med vinkelen rundt sentrum)

(Steg for steg kode for å beregne polarkoordinater)
(Inkl steg hvor vertex shader må gir videre vertexposition-varying)
(Slutter med at man har disk med baseColor og coreSize uten noe annet)

### Sexify

(Forklar at vi må lage glød og stråler for at det skal bli fint)

(x-y-graf over glød som avtar exponensielt med radius)

(steg for steg å beregne glød-komponent fra glowRange og glowIntensity)
(Slutter med at man har disk med glød)

(Forklar at stråler kan være bølger som en funksjon av vinkelen)

(x-y-graf over sinus over vinkel)
(polar-graf over sinus over vinkel)

(steg for steg å beregne sinus-stråler med samme rayRange og rayIntensity)

// TODO: parametriser rayRange og rayIntensity i fasitkoden

(slutter med at stjernen er fin, men hardkodet)

### DAT.gui kontrollpanel

(Forklar hva DAT.gui er)

(Steg for steg kode for å koble alle parameterne til dat.gui)

## Oppgave 5

> Wobbling sphere

Du bruker en vertex shader til å lage en boblende, kokende ball of love

## Oppgave 6

> Partikkelsystem

Du skal benytter deg av GPU-en enorme parallellitet for å visualisere tusenvis av partikler
