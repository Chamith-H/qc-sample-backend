import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StageHeadDocument = StageHead & Document;

@Schema()
export class StageHead {
  @Prop()
  stageName: string;

  @Prop()
  itemCode: string;

  @Prop()
  method: string;

  @Prop()
  samplingMethod: string;

  @Prop()
  samplingLogics: any[];
}

export const StageHeadSchema = SchemaFactory.createForClass(StageHead);
