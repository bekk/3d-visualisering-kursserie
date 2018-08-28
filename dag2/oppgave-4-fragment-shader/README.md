
Oppgave 4 - Fragment shader
===============================

I denne oppgaven skal vi bruke en fragmentshader til å lage en fin stjerne:

![Resultat Shader Intro](./img/fasit.png)

Teori og tips
-------------

Her kan det være greit å friske opp teorien fra siste oppgave den forrige kursdagen: (LINK TIL OPPGAVE-3-SHADER-INTRO)

### DAT.gui kontrollpanel

(Forklar DAT.gui)

### Uniform, attribute og varying

Vi har lært om `uniform`, men i webgl er det faktisk definert tre typer variabler som shaderkoden bruker. Forskjellen mellom dem er
 
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

Se i mappen `fasit-fragment-shader` for en mulig løsning med forklaringer i koden. 

Det er viktig å huske at det er som regel veldig mange forskjellige måter å lage samme visualisering på. Det kan også hende at fasiten har med ekstra visuelle effekter fordi forfatterne liker å leke seg litt.

