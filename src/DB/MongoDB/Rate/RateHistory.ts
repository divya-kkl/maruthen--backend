import mongoose, { Schema, Document } from "mongoose";

export interface IRateHistory extends Document {
  date: Date;
  name: string;
  gram: number;
  amount: number;
  type?: string;
  isCurrent: boolean;
  mc?: number;
  mcType?: string;
  hmc?: number;
  hmcType?: string;
  gst?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RateHistorySchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gram: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String, 
      required: false,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    mc: {
      type: Number,
      required: false,
    },
    mcType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
      required: false,
    },
    hmc: {
      type: Number,
      required: false,
    },
    hmcType:{
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage',
      required: false,
    },
    gst: {
      type: Number,
      required: false,
    }
  },
  {
    timestamps: true, // This automatically manages createdAt and updatedAt
  }
);

const RateHistory: mongoose.Model<IRateHistory> = mongoose.models.RateHistory || mongoose.model<IRateHistory>("RateHistory", RateHistorySchema);
export default RateHistory;
