Dit is de installatiehandleiding voor mijn GDPR-tool. Het is een applicatie om taken te beheren, samen te werken met collega’s, en wet- en regelgeving op te zoeken. Het is op dit moment nog een test-versie, je kunt het draaien op een localhost op je computer. Het doel is om het uiteindelijk uit te brengen en online te zetten. Hier heb ik nog meer tijd voor nodig om het verder te ontwikkelen. Hieronder lees je wat je nodig hebt om de applicatie op je comupter te installeren.

Benodigdheden

Om deze applicatie te laten lopen op je computer heb je verschillende software nodig:

    Een IDE zoals VS Code of IntelliJ om de applicatie te draaien;
    NodeJS moet geïnstalleerd zijn op je computer;
    PgAdmin4;
    Maven.

Stappenplan installatie

    Open je IDE;
    Open de terminal, en controleer of NodeJS is geïnstalleerd op je computer door "node -v" in te terminal te typen;
    Mocht dit niet geïnstalleerd zijn ga naar : https://nodejs.org/en/download/;
    Zorg dat je ingelogd bent in PgAdmin4 voordat je de gdpr-applicatie gaat starten. Als je PgAdmin nog niet hebt kun je deze downloaden via https://www.pgadmin.org/download/;
    Download het project als ZIP van Github door via de knop <> Code;
    Klik na het downloaden op de folder met de rechtermuisknop, en open het bestand in je IDE, of open je IDE en open de folder vanuit je IDE;
    Ga in je IDE naar de terminal en type ‘npm install’ voor de noodzakelijke packages;
    Zorg dat het wachtwoord van je database in PgAdmin overeenkomst in de applicatie, dit kun je vinden via main > resources > application.properties > Database Configuration > spring.datasource.password = password;
    Start de applicatie vanuit de folders: src > main > java > GdprApplication > klik op: Run public class GdprApplication;
    Type daarna ‘npm run dev’ of klik op ‘run dev’ bij de run knop;
    Alternatief voor de voorgaande stap: ga naar de folder UI > package.json > Run de applicatie via ‘’dev’’: “vite”,
    Je wordt als het goed doorgestuurd naar je browser op local host http://localhost:5173/, en je hebt de applicatie geopend!
    Krijg je een andere url? Open http://localhost:5173/ in je browser.
    Om gebruik te maken van de applicatie moet je een account aanmaken met je naam, e-mailadres, functie, en een wachtwoord.
    Daarna kun je terug naar het inlogscherm om in te loggen met je e-mailadres en wachtwoord.
    Veel plezier bij het gebruiken van de applicatie.

Gebruikersrollen en user-rollen Er zijn drie rollen beschikbaar: admin, editor en viewer. Wanneer je een account aanmaakt kun je kiezen welke rol je wilt. De verschillende rollen geven je verschillende bevoegdheden. Een admin kan bijvoorbeeld een gebruiker toevoegen of verwijderen. Iedere rol kan onder ‘users’ zien welke gebruikers er in de groep zijn. Ik raad je aan om 3 unieke accounts aan te maken met de verschillende rollen, zodat je kunt zien wat de verschillen zijn. Het hoeft niet je eigen e-mailadres te zijn, zolang het maar een e-mailadres is. Bijvoorbeeld floris@gmail.com.
