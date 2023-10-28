import { Context } from "telegraf";
import { SessionData } from "./Session";

export interface MyContext extends Context {
  session: SessionData;
  t: (key: string) => string;
}
