//transaction-limit.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionLimitDocument = TransactionLimit & Document;

@Schema()
export class TransactionLimit {
  @Prop({ type: Types.ObjectId, ref: 'Account' })
  accountId: Types.ObjectId;

  @Prop({ required: true })
  monthlyLimit: number;

  @Prop({ default: false })
  isApprovedByPrimary: boolean;

  @Prop({ default: false })
  isApprovedBySecondary: boolean;

  @Prop({ required: true, default: 0 })
  currentMonthSpent: number;

  @Prop()
  proposedMonthlyLimit?: number;
}

export const TransactionLimitSchema =
  SchemaFactory.createForClass(TransactionLimit);
