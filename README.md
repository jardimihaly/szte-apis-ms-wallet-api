| OpenAPI Elemek Megvalósítása | Pontszám | Megjegyzés |
| --- | --- | --- |
| ***JSON támogatás*** | 1 | Összes végpont |
| Swagger request és response validation használata | 1 | Összes végpont |
| ***GET, PUT, POST, DELETE végpontok*** | 3 | Creditcard és Payment controllerek | 
| Újrahasznosítható objektum definíciók használata minden végponthoz | 1 | api/swagger/swagger.yaml 239-EOF |
| Required mezők használata az objektum definíciókban és paraméterekben | 1 | api/swagger/swagger.yaml legtöbb végpontban |
| Query string paraméter használat lekérdezésnél | 1 | api/swagger/swagger.yaml néhány végpontban |
| Hibakezelés: Közös hiba definíció használata, minden endpoint által használva, controllerekben megvalósítva | 2 | Definíció: api/swagger/swagger.yaml <br> Megvalósítás: legtöbb végpontban |
| Hibakezelés: HTTP hibakódok használata különböző hiba esetekre (pl. hiányzó objektum, authentikációs hiba, hiányzó jogosultság, egyéb szerver hiba), controllerekben megvalósítva | 2 | Creditcard controller |
| Tag-ek használata végpontok csoportosítására | 1 | X |
| | |
| **API autentikáció - Swagger Security** | | |
| ***Globális session alapú autentikáció minden endpointra (API Key)*** | 5 | Definíció: swagger fájl <br>Megvalósítás: api/helpers/swaggerSecurity.js
| ***Login és Signup végpontok, autentikációs kivételekkel*** | 2 | Swagger fájl |
| | |
| **API üzleti logika - Controllers** | | |
| Adattárolás (in-memory vagy perzisztens) használata | 2 | Sequelize segítségével lett megvalósítva. Ha a NODE_ENV *DEVELOPMENT*, akkor sqlite adatbázis készül (*db.sqlite*). Ha az *PRODUCTION*, akkor mysql adatbázishoz próbál kapcsolódni.<br>Beállítások: api/config/config.json.<br>Adatbázis létrehozásához futtatás nélkül használd a `npx sequelize-cli db:migrate` parancsot.<br>Modellek az api/models mappában találhatóak.<br>Adatbázis migrációk az api/migrations mappában találhatóak. |
| ____A választott téma szerinti logika megvalósítása (számítás, nem csak CRUD)____ | 6 | Payment és Creditcard controllerek |
| | |
| **API Gateway használat - Kong** | | |
