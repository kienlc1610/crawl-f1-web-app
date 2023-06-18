import raceResultController from "@/controllers/race-result.controller";
import { Routes } from "@/interfaces/routes.interface";
import { Router } from "express";

class APIRaceResultRoute implements Routes {
    public path = '/race-results';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use('/api', this.router.get(`${this.path}`, raceResultController.search));
    }
}

export default APIRaceResultRoute;
