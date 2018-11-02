import { BaseModelVM } from '../../../shared/base.model'
import { TodoLevel } from '../todo-level.enum'
import { ApiModelProperty } from '@nestjs/swagger'
import { EnumToArray } from '../../../shared/utilities/enum-to-array'

export class TodoVm extends BaseModelVM{
  @ApiModelProperty() content: string
  @ApiModelProperty({ enum: EnumToArray(TodoLevel) }) level: TodoLevel
  @ApiModelProperty() isCompleted: boolean
}
