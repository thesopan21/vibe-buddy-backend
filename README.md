# 🎧 Vibe Buddy Backend

The Vibe Buddy Backend is a scalable and high-performance backend built with Node.js, Express, and TypeScript. It powers the Vibe Buddy podcast listening platform, handling user authentication, podcast streaming, playlist management, and analytics.

## Why This Backend?

🚀 Optimized for High Performance – Handles large-scale podcast streaming.

🔒 Secure & Scalable – Robust authentication and database design.

🎧 User-Friendly Features – Personalized recommendations, seamless playback.

##  Key Features
1️⃣ User Authentication & Security

- JWT Authentication – Secure login and session management.
- Role-Based Access Control (RBAC) – Different permissions for listeners, creators, and admins.
- OAuth Integration – Supports Google/Facebook login (working on it).

2️⃣ Podcast & Audio Streaming
- Podcast Upload & Management – Allows creators to upload episodes with metadata.
- Adaptive Bitrate Streaming – Ensures smooth audio playback based on network conditions.
- Resume Listening – Saves playback progress for users.

3️⃣ Playlist & Favorites
- User Playlists – Users can create, edit, and share playlists.
- Favorites & Likes – Allows users to like and save episodes.
- Recently Played – Tracks listening history.

4️⃣ Notifications & Engagement (upcoming feature)
- Push Notifications – New episode alerts, creator updates.
- Comments & Reviews – Users can rate and review podcasts.
- Follow Creators – Get updates from favorite podcasters.

5️⃣ Performance & Optimization (upcoming feature)
- Caching with Redis – Faster API responses.
- MongoDB with Indexing – Optimized queries for large datasets.
- Rate Limiting – Prevents abuse of API requests.

6️⃣ Analytics & Insights (upcoming feature)
- Listener Stats – Track engagement, most played episodes.
- Ad Monetization – Tracks ad impressions and revenue.
- Admin Dashboard – View platform analytics.

## Folder Structure

```
backend-project-name/
├── src/
│   ├── config/
│   │   └── environment.ts
│   ├── controllers/
│   │   └── exampleController.ts
│   ├── middlewares/
│   │   └── logger.ts
│   ├── models/
│   │   └── exampleModel.ts
│   ├── routes/
│   │   └── index.ts
│   ├── services/
│   │   └── exampleService.ts
│   ├── app.ts
│   └── server.ts
├── tsconfig.json
├── package.json
└── .env
```

### 1. Initialize the Node Project `package.json`

```bash
npm init -y
```

### 2. Install Typescript and Express

```bash
npm install express
```

```bash
npm install typescript ts-node @types/node @types/express --save-dev
```

### 3. Setup `tsconfig.json`

```bash
npx tsc --init
```

### 4. Update `tsconfig.json`

- [official doc](https://www.typescriptlang.org/tsconfig/)
- [example](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```bash
{
    "compilerOptions": {
        "module": "ES6",
        "strict": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "./dist",
        "rootDir": "./src"
        "baseUrl": ".",
        "paths": {
            "@/*": [
                "./node_modules/*",
                "./src/*"
              ],
        }
    },
    "include": [
        "./src/**/*",
        "./src/**/*.ts",
    ],
    "exclude": ["node_modules"]
}
```

### 5. Adding Production Tools Linting & Formatting:

```bash
npm install eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

### 6. Create `.eslintrc.json` customize your configurations

```bash
{
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended"],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
}
```

### 7. Add a logger middleware

```bash
npm install morgan
```

```bash
npm i --save-dev @types/morgan
```

### 8. Security

```bash
npm install helmet cors
```

```bash
  npm i --save-dev @types/cors @types/helmet
```

### 9. Database Installation

```bash
npm install mongoose
```

```bash
npm install @types/mongoose --save-dev
```

### 10. update a Production Script in `package.json`

```bash
{
    // ...
    "scripts": {
        "start": "node dist/server.js",
        "build": "tsc",
        "devserver": "node --import=tsx --watch --env-file=.env server.ts",
    }
    // ...
}
```

### 11. To start the project in development mode, use the following

```bash
  npm run devserver
```

### 12. Build the Project

```bash
npm run build
```

### 13. To start the production-ready server using the compiled files:

```bash
npm start
```
