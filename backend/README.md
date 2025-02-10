## Backend FC Manager

Backend aplikacji został stworzony przy użyciu **Node.js** i **express.js** oraz bazy danych **MongoDB**.
Korzystałem z Node.js w wersji: **v22.12.0** oraz npm w wersji: **11.0.0**

### Uruchomienie:

##### Baza danych:

Aby uruchomić bazę danych w dockerze, należy w terminalu wpisać komendę:

````
  docker run -d \
    -p 27017:27017 \
    --name baza_danych \
    -v data-vol:/data/db \
    mongo:latest
````

##### Backend:

Znajdując się w katalogu `backend` w terminalu należy wykonać następujące polecenia w celu zainstalowania zależności i uruchomienia projektu:

```
  npm install
  node server.js
```