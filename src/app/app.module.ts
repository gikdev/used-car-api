import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Report } from "src/reports/report.entity"
import { User } from "src/users/user.entity"
import { ReportsModule } from "../reports/reports.module"
import { UsersModule } from "../users/users.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    ReportsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [User, Report],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
