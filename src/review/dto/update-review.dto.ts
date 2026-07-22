import { IsString, IsNotEmpty, Length, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateReviewDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    @IsOptional()
    title?: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 5000)
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    rating?: number;


}
