import { IsNumber, IsOptional, IsPositive, Max } from "class-validator";

export class PaginationDto {


    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Max(process.env.MOVIES_MAX_PAGE_SIZE ? parseInt(process.env.MOVIES_MAX_PAGE_SIZE) : 20, { message: 'Limit cannot exceed 20' })
    limit?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    page?: number;




}