import { Type } from "class-transformer";
import {
    IsArray,
    IsNumber,
    IsPositive,
    IsString,
    ValidateNested,
} from "class-validator";
import { CreateContentCreditDto } from "src/content/dto/create-content-credit.dto";

export class CreatePersonDto {

    @IsNumber()
    @IsPositive()
    tmdbId: number;

    @IsString()
    name: string;

    @IsString()
    knownForDepartment: string;

    @IsString()
    profilePath?: string;

}