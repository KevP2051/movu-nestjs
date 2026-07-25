import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class SeedDatabaseDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(500)
    usersCount?: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(2000)
    reviewsCount?: number = 50;
}
