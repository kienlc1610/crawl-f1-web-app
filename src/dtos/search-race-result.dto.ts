import { Transform } from "class-transformer";
import { IsDateString, IsOptional } from "class-validator";
import moment from "moment";

export default class SearchRaceResultDto {
    year: number;
    winner: string;
    car: string;
    laps: number;

    @IsDateString()
    @IsOptional()
    @Transform(({ value }) => moment(value, 'YYYY-MM-DD').toDate())
    date: Date;
}
