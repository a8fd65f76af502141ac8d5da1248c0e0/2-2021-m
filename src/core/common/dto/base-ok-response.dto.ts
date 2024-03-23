import {ApiProperty} from "@nestjs/swagger";

export class BaseOkResponseDto {
    @ApiProperty({required: true, nullable: false, type: Boolean, default: true, description: "Ok response, always returns 'true'"})
    ok: true;
}
