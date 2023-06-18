import { prop, getModelForClass, modelOptions, mongoose } from '@typegoose/typegoose';
import { Transform, Expose } from 'class-transformer';
import moment from 'moment';

@Expose()
@modelOptions({ schemaOptions: { collection: 'race_result', timestamps: true } })
export class RaceResult {
    @Expose({
        name: 'Grand Prix'
    })
    @prop()
    public grandPrix: string;

    @Expose({
        name: 'Date'
    })
    @Transform(({ value }) => value ? moment(value, 'DD MMM YYYY').toDate() : null)
    @prop()
    public date: Date;

    @Expose({
        name: 'Winner'
    })
    @prop()
    public winner: string;

    @Expose({
        name: 'Car'
    })
    @prop()
    public car: string;

    @Expose({
        name: 'Laps'
    })
    @Transform(({ value }) => value ? Number(value) : null)
    @prop()
    public laps: number;

    @Expose({
        name: 'Time'
    })
    @prop()
    public time: string;
    @prop()
    public year: number;
}

export const RaceResultModel = getModelForClass(RaceResult);
