import { scrypt as _scrypt, randomBytes } from "node:crypto"
import { promisify } from "node:util"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { UsersService } from "./users.service"

const scrypt = promisify(_scrypt)
const SEPERATOR = "."

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email in use
    const users = await this.usersService.find(email)
    if (users.length) throw new BadRequestException("Email in use")

    // Hash users password: gen a salt - hash salt + pw - and join 'em
    const salt = randomBytes(8).toString("hex")
    const hash = (await scrypt(password, salt, 32)) as Buffer
    const result = salt + SEPERATOR + hash.toString("hex")

    // Create a new user & save it
    const user = await this.usersService.create(email, result)

    // Return the user
    return user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) throw new NotFoundException("User not found")

    const [salt, storedHash] = user.password.split(SEPERATOR)
    const hash = (await scrypt(password, salt, 32)) as Buffer
    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestException("Bad password")
    }

    return user
  }
}
