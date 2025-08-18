import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemTestDocument = ItemTest & Document;

@Schema()
export class ItemTest {
  @Prop()
  ItemName: string;

  @Prop()
  ItemCode: string;

  @Prop()
  Configured: boolean;
}

export const ItemTestSchema = SchemaFactory.createForClass(ItemTest);
