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
| ***A választott téma szerinti logika megvalósítása (számítás, nem csak CRUD)*** | 6 | Payment és Creditcard controllerek |
| | |
| **API Gateway használat - Kong** | | |
| API Gateway használata reverse proxy-ként | 3 | Kong a docker-compose.yml fájlban lesz felállítva. Ennek a konfigurálása a kong.sh fájl lefuttatásával történik. |
| API Key használata kliens azonosításra (mobil, web) | 4 | X |
| Rate limit használata (globális) | 3 | 6. curl parancs |
| Rate limit használata (klienstől függő - Kong consumer) | 4 | X |
| Dinamikus terhelés (load balancing) | 4 | Upstream: 1. curl parancs<br>Targetek: 2. és 3. curl parancs |
| **Docker Compose** | |
| Működő Docker-compose deployment Kong-gal és OpenAPI-val (verzio min 3) | 5 | docker-compose.yml fájl |
| Verziózott Docker image-ek használata | 3 | X |
| Health check definiálása az API-hoz | 2 | docker-compose.yml fájl |
