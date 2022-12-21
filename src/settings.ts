export const settings = {
  MONGO_URI:
    process.env.mongoURI ||
    'mongodb://0.0.0.0:27017/blogPlatform?maxPoolSize=20&w=majority',
  postgres: {
    POSTGRES_URI: 'postgresql://dAPJMCdzdnWGfKtjgaBcsREvhWOAOJeL:ilbnYekfrptZtwXtyUMNXezPoBdyRgST@db.thin.dev/bf72cc19-10c0-4c27-89ec-1e3681dc9ba8',
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
