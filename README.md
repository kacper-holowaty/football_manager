# FC Manager

Football club management application for managing clubs, players and club achievements. It also allows users to browse clubs created by other users.

## Technologies used:
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![JUnit 5](https://img.shields.io/badge/JUnit5-25A162?style=for-the-badge&logo=JUnit5&logoColor=white)


## Run locally

Clone project
```bash
git clone https://github.com/kacper-holowaty/football_manager
```

Go to project directory
```bash
cd football_manager
```

Create `.env` file to set environment variables. Use the provided `.env.example` file as a reference.

Build and run the application using Docker Compose:
```bash
docker compose -f docker-compose.yml up --build --watch
```

The --watch flag enables automatic reload of the server when source files change.

The application will ba available on: **http://localhost:4200**

To stop application and remove containers and networks use:
```bash
docker compose -f docker-compose.yml down
```

## Preview

**Start screen**
![Start screen](preview/start_screen.png)

**Main club owner view**
![Main view](preview/main.png)

**Club main**
![Club main](preview/club_main.png)

**Create club form**
![Create club form](preview/create_club_form.png)

**List of players**
![List of players](preview/player_list.png)

**Player details**
![Player details](preview/player_details.png)

**Club achievements**
![Club achievements](preview/achievements.png)

**List of all clubs**
![List of clubs](preview/club_list.png)