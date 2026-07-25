import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class SeedReviewsDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(2000)
    count?: number = 50;
}
