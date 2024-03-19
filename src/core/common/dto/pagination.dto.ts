class PaginationSettingsDto {
    public limit: number;
    public skip: number;
}

class PaginationResponseSettingsDto extends PaginationSettingsDto {
    public total: number;
}

export class PaginationDto<Q extends object> {
    public query: Q;
    public settings: PaginationSettingsDto;
}

export class PaginationResponseDto<T> {
    public items: T[];
    public settings: PaginationResponseSettingsDto;
}
