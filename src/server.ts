import App from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import APIRaceResultRoute from './routes/race-result.route';

ValidateEnv();

const app = new App([new APIRaceResultRoute()]);

app.listen();
