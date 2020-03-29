import mongoose from "mongoose";
export type IServices = {
  name: String;
  months: any;
  startTime: String;
  finishTime: string;
  active: Boolean;
  extendTimes: Number;
};
export type INotes = {
  date: string;
  body: string;
};
export type IClient = {
  fullname: string;
  email: string;
  typeOfService: Array<IServices>;
  notes: Array<INotes>;
};

export interface IUser extends mongoose.Document {
  password: string;
  email: string;
}
