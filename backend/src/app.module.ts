import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/user.model";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: "postgres",
      port: 5432,
      username: "postgres",
      password: "1",
      database: "postgresdb",
      models: [User],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
