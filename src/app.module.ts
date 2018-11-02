import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { ConfigurationService } from './shared/configuration/configuration.service'
import { Configuration } from './shared/configuration/configuration.enum'
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forRoot(ConfigurationService.connectionDB, {
      useNewUrlParser: true,
      autoIndex: false,
    }),
    UserModule,
    TodoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static host: string
  static port: string | number
  static isDev: boolean

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT))
    AppModule.host = _configurationService.get(Configuration.HOST)
    AppModule.isDev = _configurationService.isDevelopment
  }

  private static normalizePort(param: string | number): string | number {
    const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param
    if (isNaN(portNumber)) return param
    else if (portNumber >= 0) return portNumber
  }
}
