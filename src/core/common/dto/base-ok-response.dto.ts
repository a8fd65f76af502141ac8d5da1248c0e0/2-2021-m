import {ApiProperty} from "@nestjs/swagger";

/** DTO - маркер успешной операции. Применяется в случае отсутсвтвия необходимости возврата данных клиенту. */
export class BaseOkResponseDto {
    @ApiProperty({
        type: "boolean",
        description: "Флаг успешного запроса. Всегда равен true",
    })
    public ok = true;
}
