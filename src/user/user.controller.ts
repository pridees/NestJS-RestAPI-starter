import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { User } from './models/user.model'
import { UserService } from './user.service'
import { UserVm } from './models/view-models/user-vm.model'
import { ApiException } from '../shared/api-exception.model'
import { GetOperationId } from '../shared/utilities/get-operation-id'
import { RegisterVm } from './models/view-models/register-vm.model'
import { LoginResponseVm } from './models/view-models/login-response-vm.model'
import { LoginVm } from './models/view-models/login-vm.model'

@ApiUseTags(User.modelName)
@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
  ) {}

  @Post('register')
  @ApiResponse({ status: HttpStatus.CREATED, type: UserVm })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Register'))
  async register(@Body() registerVm: RegisterVm): Promise<UserVm> {
    const { username, password } = registerVm

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST)
    }

    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST)
    }

    let exists

    try {
      exists = await this._userService.findOne({ username })
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (exists) {
      throw new HttpException(`${username} exists yet`, HttpStatus.BAD_REQUEST)
    }

    const newUser = await this._userService.register(registerVm)

    return this._userService.map<UserVm>(newUser)
  }

  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseVm })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiOperation(GetOperationId(User.modelName, 'Login'))
  async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(loginVm)

    fields.forEach(field => {
      if (!loginVm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST)
      }
    })

    return this._userService.login(loginVm)
  }
}
