# Maanantai 26.10
## 1700-1900
Aloitin frontend-puolen tekemisen angularilla projektin infotilaisuuden jälkeen. Infon takia alkuun päästiin melko helposti, apuna toimivat myös angularin viralliset tutorialit. Aluksi setuppailin `nodemon`in, `bower`in sekä `gulp`in helpottaakseni elämääni, ja erottamaan frontendin ja backendin riippuvuuksia. Päätin aluksi sijoittaa kontrollerit yhteen tiedostoon `public/javascripts` -kansioon.

Aloittelin kontrolleripuolella hakemalla kaikki sovelluukseni tehdyt postaukset. Tämä onnistui suhteellisen yksinkertaisesti, jouduin siirtämään express-puolella postauksien hakemisesta vastaavan routen `posts.js` -tiedostoon sekä muuttamaan responsea renderistä sendiksi. Tässä vaiheessa aloitin myös hieman postilistauksen layoutin tekemistä css:llä jotta sitä sietäisi kehittäessä katsoa. Siirsin myös datetimejen siistimiseen käytetyn moment-kirjaston frontend-puolelle ja asensin angular-momentin hyödyntääkseni sitä.

# Keskiviikko 28.10
## 1400-1700
Päätin olla luomatta signuppia ja loginia angularilla, kokeilin sitä kyllä aluksi, mutta jo implementoimani `passport.js`:n flash-messaget eivät ottaneet toimiakseen. Erillään ollessaan login- ja signup toimivat oikeastaan sellaisenaan, ainoana muutoksena loin angularille endpointin `/user`, josta angular voi tarkistaa onko `req.user` olemassa, eli onko käyttäjä sisäänkirjautunut, ja asettaa `req.user`in arvon muuttujaan `$rootScope.currentUser`.

Loin myös tässä vaiheessa yksinkertaisen post-submitin angularilla, jossa ei tosin ole toistaiseksi minkäänlaista error handlingia. Päätän lisätä sen myöhemmin.

# Torstai 29.10
## 1200-1300
Lisään post-submitiin errorit lähettämällä expressin puolelta errorstatuksen ja viestin, ja näytän viestin käyttäjälle angularilla. Huomasin myös pelkkiä urleja submitatessa (palveluni on Reddit/Hacker news -klooni, joten contentia ei aina submitata), että palvelinpuoli ulisee undefined contentin `.length`-propertyn puuttumisesta. Tämän takia jouduin myös muokkaamaan postauksen content-kentälle defaulttina arvoksi tyhjän merkkijonon `ng-init`illä.

## 1600-1800
Siistin sovelluksen etusivun yleistä ulkonäköä css:llä. Lisäsin myös jokaiseen postaukseen etusivulle linkin postauksen lähettäneen käyttäjän profiiliin, jonka jälkeen loin viewin käyttäjäprofiilille. Tämä ei jälleen vaatinut backendistä muuta kuin routen palautusarvon muuttamista, funktionaalisuuden olin jo tehnyt ennen kuin alotin frontendin tekemisen.

Käyttäjän pitää myös pystyä päivittämään bioaan jos tarkastelee omaa profiiliaan sisäänkirjautuneena. Toteutetaan tämä yksinkertaisella `ng-if` -lausekkeella tarkistamalla onko `currentUser.id` sama kuin tarkasteltavan profiilin id. Mikäli on, näytetään form bion muokkaamiseen, mikäli ei, näytetään pelkkä bio-paragraph.

Tässä vaiheessa huomaan myös, että voin etsiä käyttäjien profiileita, joita ei ole olemassa kirjoittamalla olemattoman käyttäjän id:n urlikenttään. Laitetaan yksinkertaisesti angular redirectaamaan roottiin, jos userin etsintä userprofilea getatessa palauttaa errorin.

Lisäsin myös käyttäjäprofiileihin linkin käyttäjän tekemiin postauksiin, tämänkin olin oikeastaan implementoinut jo ennen kuin aloitin angularpuolen tekemisen, joten ainoa lisäys tähän oli renderöidä virheviesti mikäli käyttäjällä ei ole yhtään postausta.

# Perjantai 30.10
## 1600-1800
Luodaan yksittäisen postauksen tarkasteluun oma view. Lisätään viewiin formi kommentin submittaamiselle ja tälle formille oma funktio angularin kontrolleriin. Jostain syystä jouduin myös ensimmäistä kertaa kontrollerissa alustamaan modelin, eli luomaan `$scope.comment` -objektin jonka lähetettävät attribuutit ovat tyhjät. Voi olla että angular meni jotenkin sekaisin kommenttilistauksesta joka renderataan postauksen alle post-show-viewissä.

Tätä kommenttilistausta varten joudun muuttamaan aavistuksen backendia lähettämään datan takaisin `res.json`illa sendin sijaan, jotta post ja comments saatiin eroteltua ja yhdistettyä oikeisiin scopevariableihin angularissa.

Tässä vaiheessa kommentin submittaus ei automaattisesti appendaa sitä kommenttilistauksen loppuun lähetettyä, mutta lisään tämän toiminnallisuuden myöhemmin.

# Sunnuntai 1.11
## 1100-1200
Nyt kun postausten mukana tulee kommentit, täytyy nämä laskea etusivun postilistauksessa. Lisätään backendissa jokaiseen haettavaan postaukseen mukaan kommentien lukumäärä, ja renderataan tämä lukumäärä viewissä kätevää `ng-pluralize`a käyttäen.

Luon myös tässä vaiheessa mahdollisuuden vastata kommenteihin. Tällöin kommenttiin tallenettaan `postId`:n ohella myös `CommentId`. Toistaiseksi sekä kommentit postaukseen että kommentien vastaukset näkyvät hölmösti listana samalla tasolla, tarkoituksena on lisätä nämä nested kommentit seuraavaksi.


# Maanantai 2.11
## 1500-1700
Saadaan nestatut kommentit toimimaan, kirjanpidon niiden tekemisestä löytyy express-kirjanpidosta, sillä kyseessä oli lähinnä backendin homma. Nestaaminen angularin puolella hoituu käyttämällä `ng-include`a rekursiivisesti ja renderaamalla template kommentille `post-show.html`:n comments-osiossa. Ilmeisesti html-listat muodostavat sisennettynä puumaisen rakenteen automaattisesti, joten senkään muotoilusta ei tarvitse huolehtia.

Lisätään myös kommenttin submittiin tässä vaiheessa success-message, sekä lisätään lähetetty kommentti `$scope.comments`iin, jotta se näkyy kommenttilistauksessa ilman refreshiä.

Hoidin tässä vaiheessä myös paginaation helposti pois alta automaagisella `angularUtils-directive-pagination`illa. (http://www.michaelbromley.co.uk/blog/108/paginate-almost-anything-in-angularjs)

# Tiistai 3.11
## 1200-1400
Tässä vaiheessa angular-koodini on aikamoista spagettia, joten pyhitän tämän päivän sen siistimiselle. Siirrän kaikki `$http.get`it ja `post`it pois kontrollereista serviceihin, joihin luon omat servicet `Api`lle, joka `get`taa ja `post`aa, sekä jokaiselle modelille, eli `Post`, `User` ja `Comment`-servicet, jotka kutsuvat näitä `Api`-servicen funktioita. Kontrollereissa muokataan funktiot käyttämään servicejä ja siistitään yleistä koodityyliä style guiden mukaiseksi. Enkapsuloidaan kaikki.

# Keskiviikko 4.11
## 1000-1300

Tässä vaiheessa alan viimeistelemään sovelluksen ulkoasua, ja päädyn yksinkertaiseen valkoharmaaseen ulkoasuun, joka paikkapaikoin hyödyntää bootstrapin komponentteja. Tässä vaiheessa lisään myös etusivun listaukseen postausten titlejen viereen mahdollisten urlien hostnamet seuraavalla tavalla:
https://gist.github.com/jlong/2428561

# Perjantai 6.11
## 1100-1200
Viimeistellään CSS paginationia lukuun ottamatta. Lisätään expresspuolelle CSRF-token, angular hyödyntää tätä automaagisesti.

# Sunnuntai 8.11
## 1700-1800
Tehdään paginationille oma template ja css-tyylit. Lisätään siistityt upvotearrowit jokaisen postin viereen etusivulle. Arrowin klikkaaminen olematta kirjautunut johdattaa loginiin. Jos käyttäjä on jo upvotennut, arrow ei ole linkki vaan pelkkä span jolla on tummempi väri.

Tässä vaiheessa minifoin skriptini angular-boilerplate -reposta vedetyllä gulpfilella, johon väliin olen lisännyt `gulp-ng-annotate`n. Aluksi minifiointi ei toimi, mutta siirrettyäni `forumApp.controllers` -modulen declarationin yhdestä controllerista `app.js`-tiedostoon, toimii myös minifioitu skripti.

Sovellukseni alkaakin olla valmis ja toimintakunnossa, ainakin edge caseja lukuun ottamatta. Koska kuitenkin jouduin tutustumaan kehityksessa kokonaan uusiin teknologioihin, jouduin lähestymään tätä sovellusta test later -periaatteella tavallisen TDD:n sijasta. Vikana esteenä onkin testien kirjoittaminen modelien validatioineille sekä angularin form-validationeille. En koe $http.gettien ja postien testaamista tarpeelliseksi. Nämä jätän kuitenkin huomiselle, ja keskityn tänään sovellukseni deployaamiseen huomista demoa varten.

## 1900-2100
Deployaamiseen herokuun menee aika kauan aikaa. Pitää muokata `bin/www` -tiedostoa synkkaamaan sequelizen modelit aina kun sovellus käynnistyy. Lisäksi `models/index.js` -tiedostoon pitää lisätä oma kohta tuotantotietokantaa varten. Joudun myös lisäilemään muutamia puuttuvia riippuvuuksia kuten `bower` `pg` ja `pg-hstore` `package.json` -tiedostoon. Tämän lisäksi lisään `package.json`iin `postinstall`-skriptin, joka suorittaa bower installin npm:n asennettua bowerin. Tämän jälkeen applikaatio toimiikin mutkatta, mutta en löytänyt mitään hyvää mock datan generoivaa virveliä omiin tarpeisiini, joten joudun luomaan käsin käyttäjät ja postaukset.

# Tuntimäärä: 24
