import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common'
import { BaseService } from '../shared/base.service'
import { User } from './models/user.model'
import { ModelType } from 'typegoose'
import { InjectModel } from '@nestjs/mongoose'
import { MapperService } from '../shared/mapper/mapper.service'
import { RegisterVm } from './models/view-models/register-vm.model'
import { compare, genSalt, hash } from 'bcryptjs'
import { LoginVm } from './models/view-models/login-vm.model'
import { LoginResponseVm } from './models/view-models/login-response-vm.model'
import { JwtPayload } from '../shared/auth/jwt-payload.interface'
import { AuthService } from '../shared/auth/auth.service'
import { UserVm } from './models/view-models/user-vm.model'

@Injectable()
export class UserService extends BaseService<User>{
  constructor(
    @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
    private readonly _mapperService: MapperService,
    @Inject(forwardRef(() => AuthService)) private readonly _authService: AuthService,
  ) {
    super()
    this._model = _userModel
    this._mapper = _mapperService.mapper
  }

  async login(loginVm: LoginVm): Promise<LoginResponseVm> {
    const { username, password } = loginVm

    const user = await this.findOne({ username })

    if (!user) {
      throw new HttpException('Bad credentials', HttpStatus.BAD_REQUEST)
    }

    const isPasswordMatch = await compare(password, user.password)

    if (!isPasswordMatch) {
      throw new HttpException('Bad credentials', HttpStatus.BAD_REQUEST)
    }

    const payload: JwtPayload = {
      username: user.username,
      role: user.role,
    }

    const token = await this._authService.signPayload(payload)
    const userVm = await this.map<UserVm>(user.toJSON())

    return {
      token: token,
      user: userVm
    }
  }

  async register(registerVm: RegisterVm): Promise<User> {
    const { username, password, firstName, lastName } = registerVm

    const newUser = new this._model()
    newUser.username = username
    newUser.firstName = firstName
    newUser.lastName = lastName

    const salt = await genSalt(16)

    newUser.password = await hash(password, salt)

    try {
      const result = await this.create(newUser)
      return result.toJSON() as User
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
