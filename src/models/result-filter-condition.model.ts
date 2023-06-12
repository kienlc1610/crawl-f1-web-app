import { prop, getModelForClass, modelOptions, mongoose } from '@typegoose/typegoose';
import { Transform } from 'class-transformer';

@modelOptions({ schemaOptions: { collection: 'result_filter_condition', timestamps: true } })
export class ResultFilterCondition {
    @Transform(({ value }) => value ? value?.map(item => Number(item)) : [])
    @prop({ type: Number, required: false, default: [] })
    public years: mongoose.Types.Array<number>;

    @prop({ type: String, required: false, default: [] })
    public types: mongoose.Types.Array<string>;

    @prop({ type: String, required: false, default: [] })
    public meetings: mongoose.Types.Array<string>;
}

export const ResultFilterConditionModel = getModelForClass(ResultFilterCondition);
