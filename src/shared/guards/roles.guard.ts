import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InstanceType } from 'typegoose'
import { User } from '../../user/models/user.model'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this._reflector.get('roles', context.getHandler())

    // @ts-ignore
    if (!roles || roles.length === 0) {
      return true
    }

    console.log(roles)

    const request = context.switchToHttp().getRequest()
    const user: InstanceType<User> = request.user

    // @ts-ignore
    const hasRole = () => roles.includes(user.role);

    if (user && user.role && hasRole())
      return true

    throw new HttpException(`Operation is permitted with your role - ${user.role}`, HttpStatus.UNAUTHORIZED)

  }
}
