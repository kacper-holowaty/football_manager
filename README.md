# FC Manager

Aplikacja do zarządzania klubami piłkarskimi, piłkarzami oraz osiągnięciami klubu.

### Uruchom lokalnie

#### Baza danych - PostgeSQL

Do uruchomienia potrzeba bazy danych PostgreSQL, którą można uruchomić np. w Dockerze za pomocą polecenia w terminalu:

```
docker run -d \
  --name postgres-db \
  -e POSTGRES_DB=fcmanager \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:latest
```

#### Backend

Należy kolejno wykonać:

```
cd backend
mvn clean install
mvn spring-boot:run
```

#### Frontend

Należy kolejno wykonać:

```
cd frontend
npm install
npm start
```

### Opis tymczasowy - WORK IN PROGRESS!