import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

class ConfigService {
  public getTypeOrmConfig(entities: any): TypeOrmModuleOptions {
    const {
      ENVIRONMENT,
      USE_SSL,
      SSL_AUTHORIZE,
      DB_SYNC,
      PORT: port,
    } = process.env;
    const {
      [`${ENVIRONMENT}_DB_USERNAME`]: username,
      [`${ENVIRONMENT}_DB_PASSWORD`]: password,
      [`${ENVIRONMENT}_DB_HOST`]: host,
      [`${ENVIRONMENT}_DB_NAME`]: database,
    } = process.env;

    return {
      host,
      username,
      password,
      database,
      entities,
      port: +port,
      type: 'postgres',
      synchronize: DB_SYNC === 'true' ? true : false,
      extra:
        USE_SSL === 'true' && ENVIRONMENT !== 'DEV'
          ? {
              ssl: {
                rejectUnauthorized: SSL_AUTHORIZE === 'true' ? true : false,
              },
            }
          : {},
    };
  }
}

const configService = new ConfigService();

export { configService };
