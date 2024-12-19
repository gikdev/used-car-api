import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app/app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle("Messages")
    .setDescription("Messages API to communicate")
    .setVersion("1.0")
    .addTag("message")
    .build()
  const docFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, docFactory)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
