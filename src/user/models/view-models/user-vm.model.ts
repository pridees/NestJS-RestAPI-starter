import { BaseModel } from '../../../shared/base.model'
import { UserRole } from '../user-role.enum'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { EnumToArray } from '../../../shared/utilities/enum-to-array'
import { User } from '../user.model'

export class UserVm extends BaseModel<User> {
  @ApiModelProperty() username: string
  @ApiModelPropertyOptional() firstName?: string
  @ApiModelPropertyOptional() lastName?: string
  @ApiModelPropertyOptional() fullName?: string
  @ApiModelPropertyOptional({ enum: EnumToArray(UserRole)}) role?: UserRole
}
