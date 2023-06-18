import SearchRaceResultDto from "@/dtos/search-race-result.dto";
import { RaceResultModel } from "@/models/race-result.model";
import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";

class RaceResultController {
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const searchDto = plainToInstance(SearchRaceResultDto, req.query);

            const data = await RaceResultModel.find(searchDto);

            res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new RaceResultController();