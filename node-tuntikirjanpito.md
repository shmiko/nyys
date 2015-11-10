# Keskiviikko 14.10
## 0900-1200
Aloitetaan projektin tekeminen asentamalla express-generator, noden ollessa jo asennettuna koneelle. Luodaan uusi projekti ajamalla `express forum —git`, ja ihmetellään luotua tiedostorakennetta ja yritetään hahmottaa mikä tulee mihinkin. Muokataan `package.jsonia` ja lisätään `sequelize` sekä `sqlite3` -paketit.

Luodaan javascriptillä uusi sqlite-tietokanta, jossa on tällä hetkellä vain taulukko Users, jolla kolumnit username ja password. Katsotaan web-selainohjelmointi -kurssin ihanista ohjeista ja github-reposta miten sequelize on laitettu toimimaan sqliten kanssa.

Huomaan, että on olemassa `sequelize-cli` -työkalu, joka tarjoaa läjän hyödyllisiä komentoja expressin kanssa käytettäväksi. Poistan vanhan db-kansion, ja kokeilen käyttää tätä työkalua sequelizen pystyttämiseksi. Ajamalla `Init` työkalu loi `config`, `migrations`, `seeders` sekä `models` -kansiot. Config-kansioon luotiin automaattisesti `config.json`, joka sisältää kehitys-, testi- ja tuotantotietokantojen tiedot. Tiedosto on kuitenkin tehty mysql-tietokannalle, mikä ei tosin ole ongelma. Sequelizen tarjoamien ohjeiden avulla saan sen helposti muutettua sqlitelle.

Luodaan uusi malli ajamalla `node_modules/.bin/sequelize model:create --name User --attributes 'username:string, password:string’`. Muokataan mallia hieman lisäämällä attribuutille `username` validaatiot `unique: true` ja `allowNull: false`. Lisäksi lisätään modelille sekä funktio `generateHash`, joka suolaa ja hashaa salananan bcryptillä että funktio `validPassword`, joka bcryptin avulla vertailee annettua salasanaa model-instancen salasanaan.

## 1200-1500
Aluksi ajattelin luoda autentikaation itse, mutta tajusin että tämä on oikeastaan aika huono idea, vaikka `express-session` tarjoaisi ilmeisesti ihan hyvät työkalut keksien ja sessioiden hallinnointiin. Vaikka olin jo ehtinyt koodaamaan sen avulla yksinkertaisen sisäänkirjautumisen ja rekisteröinnin, päätän silti vaihtaa `passport.js`-kirjastoon ihan vain turvallisuuden vuoksi.

Ihan triviaalein homma tämä ei kuitenkaan ollut. Aluksi ongelmaa aiheutti sequelizen syntaksi, sillä en ollut sitä ennen käyttänyt. Kuitenkin saatuani queryt pelittämään, oli tutoriaalien avulla melko helppo luoda omat local-strategyt `config/passport.js` -tiedostoon. Flash-viestejä en kuitenkaan jostain syystä saanut toimimaan, jätän niiden ratkaisun myöhemmälle.

# Perjantai 16.10
## 1200-1500
Alkuperäisessä tutoriaalissa, jota seurasin scotch.ion sivuilta, lähetettiin `req.flash` suoraan passportin done-callbackissa `config/passport.js` -tiedostossa. Tämä ei kuitenkaan näyttänyt toimivan, joten noudatin passport.js:n virallista dokumentaatiota ja korvasin tämän messagen normaalilla stringillä, jonka lähetän templatelle flashina. En kuitenkaan tunnu pääsevän käsiksi tähän messageen.

Jossain vaiheessa tajusin kuitenkin console.logata mitä `req.flash()` lähettää. Selviää, että message, joka palautetaan passportin puolella assignataan ‘error’ -attribuuttiin, joten lähettämälle expressissä viewille `req.flash(‘error’)` toimii. Tähänkin meni ehkä vähän liikaa aikaa.

# Lauantai 17.10
## 1200-1600
Saatuani User-modelien luonnin sekä autentikaation toimimaan, on aika tehdä niillä jotain. Luodaan User-modelille uusi attribuutti bio, joka voidaan muokata ja näyttää käyttäjän profiilissa. Bion maksimipituus on 300 merkkiä. Tämä tarkoittaa myös migraatiofilen muuttamista, sillä ilmeisesti sequelizessa migraatioita ei voi generoida modeleista, toisin kun railsin ormissa.

Kun bio on lisätty Userille, voidaan aloittaa käyttäjäprofiilin rakentaminen. Käyttäjäprofiilit tulevat löytymään polusta `/users/:user_id/profile`, joten tehdään route `users.js`-tiedostoon. Tehdään testiksi profiilit simppelisti res.renderillä, koska en ole vielä angularia ehtinyt katsoa ja haluan varmistua siitä, että backend toimii ennen. Lähetetään sequelizen `route_params.user_id`:llä löytämän käyttäjän tiedot viewiin ja renderataan se. Toimii odotetusti.

Viritetään user-profileen mahdollisuus myös muokata bioa, jos käyttäjä on kirjautunut sisään. Bion muokkaaminen toimii odotetusti, sekä serveripuolen validaatiot. Toistaiseksi kuka tahansa voi muokata kenen tahansa bioa, mutta en ole tästä toistaiseksi huolestunut, kuhan backend toimii. Lisäsin profiiliin myös väliaikainen placeholder käyttäjän luontiajalle joka voidaan siistiä kun aloitan frontendin kehittämisen.

# Tiistai 21.10
## 1100-1600
Tässä vaiheessa aloin implementoimaan postauksia. Luodaan uusi model `Post`, jolla `title`, `url`, sekä `content`. Koska kyseessä on Reddit/Hacker News -klooni, eli joko url tai content on tyhjä, enforcetaan ainoastaan titlelle `allowNull: false`. Asetetaan titlelle 150 merkin raja, urlille höveli 1000, ja contentille 5000. Uutta modelia luodessa sequelize osaa luoda migraatiotiedoston tälle modelille, joten ainoaksi muutokseksi migration-tiedostossa jää validaatiot sekä foreign key Useriin, joka postauksen loi. Jälkimmäinen osoittautuukin hiuksia revittävän turhauttavaksi, sillä sequelize ei oikein tarjoa dokumentaatiota miten foreign key pitäisi migrationissa declareta. Löydän kuitenkin lopulta internetin syövereistä miten tämä tehdään, ja saan migraatiotiedoston toimimaan.

Tämän jälkeen formi uuden postauksen luomisen testaamiselle onkin helppo tehdä, ja se saadaankin melko liukkaasti toimimaan, onneksi. En ole varma olisiko pääni kestänyt ongelmia sen kanssa sequelizen kanssa rimpuilemisen jälkeen. Päätänkin lopettaa tähän, seuraavaksi kerraksi jätän tehtäväksi yksittäisen postin gettaamisen, sekä kaikkien postien gettaamisen listaukseen.

#Sunnuntai 25.10
## 1300-1600
Post-showin sekä kaikkien postien listaaminen hoituu melko kivuttomasti sequelizen queryillä. Isoimmat ongelmat tulivat käyttäjänimen sisällyttämisessä viewille lähetetyjen `Post`-modelien mukana. Saadaan tämäkin kuitenkin setvittyä käyttämällä sequelizen includea queryissä. Lähetetään viewille vain tarvitut attribuutit userilta, eli `id` ja `username`.

# Maanantai 26.10
## 1200-1400
Tässä vaiheessa aloitin kommenttien modelaamisen, luodaan niille oma model. Kommentti sisältää pelkän contentin, jonka maksimipituus on 3000 merkkiä. Kommentti vaatii useamman foreign keyn, sillä kommentit pitää osata yhdistää Userin lisäksi oikeaan Postiin sekä oikeaan kommenttiin, mikäli kyseessä on vastaus kommenttiin. Tällä kertaa migraatiotiedoston muokkaaminen assosiaatioiden luomiseksi hoituu jo paljon nopeammin kun sen on Postin kanssa kerran tehnyt. Luon samaan viewiin joka näyttää postauksen yksinkertaisen formin kommentin submittaamiseksi. Tämän toimimaan saaminen on melko helppoa, foreign keyt otetaan tällä hetkellä sisäänkirjautuneen käyttäjän id:stä sekä `route_params.post_id`:stä. Testataan myös hakea kaikki postauksen kommentit post-show-viewiin. Tässä hyvin vähän voisi mennä vikaan, joten toimii helposti.

Luodaan myös kommentille oma view ja reply-form, ja testataan toimiiko kommenttiin vastaaminen ja kommentin vastausten hakeminen palvelinpuolelta. Logiikka on melko pitkälti sama kuin postauksen kanssa, joten tämä saatiin toimimaan myös tosi helposti. Tässä vaiheessa lähden angularintroon, jonka jälkeen aion aloittaa frontendin devaamisen.

# Sunnuntai 1.11
## 1600-2000
Aloitetaan nested kommenttien tekeminen. Jokaisella kommentilla on siis optionaalinen foreign key `CommentId` riippuen siitä onko kyseessä vastaus alkuperäiseen postaukseen vai toiseen kommenttiin. Palvelinpuolella haetaan valmiiksi jo lista kaikista postauksen kommenteista. Tämä lista pitäisi nestata oikein, eli kommenteille attribuutti `Comments`, joka on lista kaikista kommentin vastauksista. Näillä vastauksilla voi olla myös vastauksia. Lähdetään tekemään tätä toiminnallisuutta uuteen serviceen, eli luodaan express-puolelle kansio `services` ja sinne tiedosto `nest-comments.js`.

Koska en ole hirveän pätevä rekursiossa saatika puumaisissa rakenteissa tässä meni oikeasti aika kauan ja menetin elinikää varmasti muutaman vuoden. Aluksi lähdin ratkaisemaan tätä ongelmaa täysin väärästä suunnasta, eli etsimään jokaisen vastauksen parentkommenttia, mutta eihän siitä mitään tullut.

Jossain vaiheessa kuitenkin tajusin että ehkä on parempi etsiä jokaisen kommentin vastaukset, eli jos `CommentId == null`, etsitään tämän kommentin vastaukset ja näiden vastauksien vastaukset. Jaetaan ongelma siis kahteen funktioon, toiseen joka etsii vastaukset, ja toinen joka muodostaa siistityn, sisennetyn listan kommenteista.

Vastaukset etsivä funktio tarvitsee parametreikseen alkuperäisen siistimättömän listan, sekä sen kommentin id:n, jonka vastauksia etsitään. Jos jonkun alkuperäisellä listalla olevan kommentin CommentId on sama kuin sen kommentin id, jonka vastauksia etsitään, kutsutaan funktiota rekursiivisesti ja etsitään tämän vastauksen mahdolliset vastaukset. Tätä tehdään niin kauan kunnes vastauksia ei enää löydy, jonka jälkeen lähdetään rekursioläjässä taaksepäin. Lopuksi palautetaan lista lapsista, joka assignataan siistityn listan luovassa funktiossa parentkommentin Comments-attribuuttiin.

# Perjantai 6.11
## 1100-1200
Lisätään CSRF-token Csurfilla Expressiin. Tämä on melko helppoa, asetetaan app.js:ssä res.cookieen `XSRF-TOKEN` csurfin tarjoamalla `req.csrfToken()` -funkkarilla. Koska signup ja login ovat angularista irrallaan, lisätään niiden formeihin piilotettu csrf-token -kenttä, jolle annetaan arvo expressistä samalla funktiolla.

# Sunnuntai 8.11
## 1200-1700
Deadline lähestyy, ja tämän viikon aikana olen lähinnä keskittynyt angular-puolen kuntoon laittamiseen. Nyt pitäisi kuitenkin implementoida yksi sovellukseni keskeisistä ominaisuuksista, nimittäin upvotet. Luodaan aluksi many-to-many relaatioilla välitaulu `PostVotes`, jossa on postauksen id sekä äänen antaneen käyttäjän id, kummatkin kolumnit ovat siis foreign keytä. Rivin lisääminen tähän välitauluun onnistuu melko helposti luomalla route `/posts/:post_id/upvote`, johon `POST`aamalla lisätään uusi rivi tauluun. Ilmeisesti sequelize jotenkin estää myös duplikaattirivien luomisen, eli sama käyttäjä ei voi upvoteta moneen otteeseen.

Luodaan uusi service, jonka tarkoituksena olisi laskea sille annetun posts-listan jokaisen postauksen upvotejen lukumäärä sekä tarkistaa onko sisäänkirjautunut käyttäjä upvotennut postausta. Tässä vaiheessa homma menee taas ihan sairaan vaikeaksi. Jokaiselle postaukselle pitäisi saada attribuutti upvotes johon tämä kokonaisluku laitettaisiin. Sequelizen tarjoamat `getAssociations()` ja `countAssociations()` eivät paljoa lämmitä, sillä niiden sisältä ei voi puskea sitä itemiä ulos, joille jompaa kumpaa näistä funktioista kutsuttiin. Alkuperäinen ajatukseni loopata siis posts-arrayn jokaisen itemin läpi ja kutsua niille `countAssociations()`, assignata sen callbackissa postille attribuutti upvotes ja palauttaa muokattu posts kaatuu siis tähän. Kumpikin `getAssociations()` ja `countAssociations()` palauttavan promisen, joka ilmeisesti johtuu asynkronisuudesta. Vaikeaa.

Onneksi kaverini sattuu olemaan webdev-guru, ja ehdottaa että käyttäisin bluebirdin promiseja. Upvotes-servicessäni on nyt siis pari callback-joulukuusta, jotka mappaavat posts-arrayhin niiden vaatimat attribuutit. Kutsuttuani nämä kummatkin funktiot, lähetän ne jälkimmäisen funktion palauttamassa callbackissa viewille. Tarvitsen selvästi lukumateriaalia javascriptista ja asynkronisuudesta. Lopputuloksena upvotejen laskeminen ja käyttäjän upvotejen tarkistaminen kuitenkin toimii, joten all good.

# Tuntimäärä: 34 (Pe 6.11 tunteja ei laskettu, sillä laskin ne angularkirjanpidossa)
