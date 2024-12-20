import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session } from "@nestjs/common"
import { Serialize } from "src/interceptors/serialize.interceptor"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "./create-user.dto"
import { UpdateUserDto } from "./update-user.dto"
import { UserDto } from "./user.dto"
import { UsersService } from "./users.service"

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get("/whoami")
  whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId)
  }

  @Post("/signout")
  signOut(@Session() session: any) {
    session.userId = null
  }

  @Post("/signup")
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post("/signin")
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Get("/:id")
  findUser(@Param("id") id: string) {
    return this.usersService.findOne(Number.parseInt(id))
  }

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email)
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number.parseInt(id), body)
  }

  @Delete("/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(Number.parseInt(id))
  }
}
