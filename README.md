## swagger
```
http://localhost:3000/api
```

## erd

![image](https://github.com/heyfuxkingcheez/ticketing_project/assets/143869354/97797007-b374-44bc-b81f-bab80cd31119)

## directory structure

```
📦ticketing_project
 ┣ 📂src
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜auth.middleware.ts
 ┃ ┃ ┣ 📜auth.module.ts
 ┃ ┃ ┣ 📜auth.service.ts
 ┃ ┃ ┣ 📜jwt.strategy.ts
 ┃ ┃ ┣ 📜naver.auth.guard.ts
 ┃ ┃ ┣ 📜naver.strategy.ts
 ┃ ┃ ┣ 📜roles.decorator.ts
 ┃ ┃ ┗ 📜roles.guard.ts
 ┃ ┣ 📂performance
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-performance.dto.ts
 ┃ ┃ ┃ ┗ 📜update-performance.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜performance.entity.ts
 ┃ ┃ ┣ 📜performance.controller.ts
 ┃ ┃ ┣ 📜performance.module.ts
 ┃ ┃ ┗ 📜performance.service.ts
 ┃ ┣ 📂point
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-point.dto.ts
 ┃ ┃ ┃ ┗ 📜update-point.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜point.entity.ts
 ┃ ┃ ┣ 📜point.controller.ts
 ┃ ┃ ┣ 📜point.module.ts
 ┃ ┃ ┗ 📜point.service.ts
 ┃ ┣ 📂reservation
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-reservation.dto.ts
 ┃ ┃ ┃ ┗ 📜update-reservation.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜reservation.entity.ts
 ┃ ┃ ┣ 📜reservation.controller.ts
 ┃ ┃ ┣ 📜reservation.module.ts
 ┃ ┃ ┗ 📜reservation.service.ts
 ┃ ┣ 📂schedule
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-schedule.dto.ts
 ┃ ┃ ┃ ┗ 📜update-schedule.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜schedule.entity.ts
 ┃ ┃ ┣ 📜schedule.controller.ts
 ┃ ┃ ┣ 📜schedule.module.ts
 ┃ ┃ ┗ 📜schedule.service.ts
 ┃ ┣ 📂seat
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜create-seat.dto.ts
 ┃ ┃ ┃ ┗ 📜update-seat.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜seat.entity.ts
 ┃ ┃ ┣ 📜seat.controller.ts
 ┃ ┃ ┣ 📜seat.module.ts
 ┃ ┃ ┗ 📜seat.service.ts
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📜login.dto.ts
 ┃ ┃ ┃ ┗ 📜register.dto.ts
 ┃ ┃ ┣ 📂entities
 ┃ ┃ ┃ ┗ 📜user.entity.ts
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┣ 📜grade.type.ts
 ┃ ┃ ┃ ┣ 📜performance.type.ts
 ┃ ┃ ┃ ┗ 📜userRole.type.ts
 ┃ ┃ ┣ 📜user.controller.ts
 ┃ ┃ ┣ 📜user.module.ts
 ┃ ┃ ┗ 📜user.service.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜userInfo.decorator.ts
 ┃ ┣ 📜app.controller.ts
 ┃ ┣ 📜app.module.ts
 ┃ ┣ 📜app.service.ts
 ┃ ┗ 📜main.ts
 ┣ 📂test
 ┃ ┣ 📜app.e2e-spec.ts
 ┃ ┗ 📜jest-e2e.json
 ┣ 📜.env
 ┣ 📜.eslintrc.js
 ┣ 📜.gitignore
 ┣ 📜.http
 ┣ 📜.prettierrc
 ┣ 📜logic.md
 ┣ 📜nest-cli.json
 ┣ 📜package-lock.json
 ┣ 📜package.json
 ┣ 📜README.md
 ┣ 📜tsconfig.build.json
 ┣ 📜tsconfig.json
 ┗ 📜webpack-hmr.config.js
```

## .env setting

```
JWT_SECRET_KEY
JWT_EXPIRE
DB_USERNAME
DB_PASSWORD
DB_HOST
DB_PORT
DB_NAME
DB_SYNC
CLIENT_ID
CLIENT_SECRET
CALLBACK_URL
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
