import { TodoLevel } from '../todo-level.enum'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'

export class TodoParams {
  @ApiModelProperty() content: string
  @ApiModelPropertyOptional({ enum: TodoLevel, example: TodoLevel.Normal })
  level?: TodoLevel
}
