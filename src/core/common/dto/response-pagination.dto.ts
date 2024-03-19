import {ApiProperty} from "@nestjs/swagger";

export class ResponsePaginationSettingsDto {
    @ApiProperty({type: "integer", minimum: 0})
    public total: number;
    @ApiProperty({type: "integer", minimum: 0})
    public limit: number;
    @ApiProperty({type: "integer", minimum: 0})
    public skip: number;
}
export class ResponsePaginationDto<T> {
    public data: T[];
    @ApiProperty({type: ResponsePaginationSettingsDto})
    public pagination: ResponsePaginationSettingsDto;
}
