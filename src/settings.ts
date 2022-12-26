export const settings = {
  MONGO_URI:
    process.env.mongoURI ||
    'mongodb://0.0.0.0:27017/blogPlatform?maxPoolSize=20&w=majority',
  postgres: {
    //POSTGRES_URI: 'postgresql://nIRZBHzITmAvUkhtdvZeGzaSlFbAIXVP:PWLIcDakeYEGjOdFdlIlLNhUOhggreIk@db.thin.dev/e261df19-2d78-4cad-9d17-11646bfeb98a',
    PORT: '5432',
    USERNAME: 'postgres',
    PASSWORD: 'admin',
    DATABASE_NAME: 'BlogsPlatform',
  },
  JWT_SECRET: process.env.JWT_SECRET || '123',
  basic: {
    USER: 'admin',
    PASS: 'qwerty',
  },
  SALT_GENERATE_ROUND: '10',
  timeLife: {
    CONFIRMATION_CODE: '24', // Time life for confirmation code
    ACCESS_TOKEN: '300000',
    REFRESH_TOKEN: '300000',
  },
  throttler: {
    CONNECTION_TIME_LIMIT: '10000',
    CONNECTION_COUNT_LIMIT: '5',
  },
  environment: 'dev',
};
