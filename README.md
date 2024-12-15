# Production Ready Setup (NodeJs and Typescript)

Setting up a production-ready backend with Node.js and TypeScript involves several steps to ensure scalability, maintainability, and security.

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
            "*": [
                "node_modules/*",
                "src/types/*"
              ],
            "@utils/*": ["src/utils/*"]
        }
    },
    "include": [
        "src/**/*",
        "src/**/*.ts",
        "src/utils/*"
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

### 9. Database Integration

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

## Basic Setup

- [app.ts](#app)
- [server.ts](#server)
- [config/environment.ts](#environment)
- [routes/routes.ts](#routes)
- [controllers/controller.ts](#contrller)
- [middleware/logger.ts](#logger)
- [models/mongodb.ts](#database)

### app

```bash
import express from 'express';
import routes from './routes';
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet());
app.use(cors());

const app = express();

app.use(express.json());
app.use('/api', routes);

export default app;
```

### server

```bash
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### environment

```bash
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI || '',
};
```

### routes

```bash
import { Router } from 'express';
import { exampleController } from '../controllers/exampleController';

const router = Router();

router.get('/example', exampleController);

export default router;
```

### contrller

```bash
import { Request, Response } from 'express';

export const exampleController = (req: Request, res: Response) => {
  res.json({ message: 'Hello, Production!' });
};
```

### logger

```bash
import morgan from 'morgan';
import { Application } from 'express';

export const setupLogging = (app: Application) => {
  app.use(morgan('combined'));
};
```

### database

```bash
import mongoose, { Schema, Document } from 'mongoose';

export interface IExample extends Document {
  name: string;
  value: number;
}

const ExampleSchema: Schema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

export default mongoose.model<IExample>('Example', ExampleSchema);
```
