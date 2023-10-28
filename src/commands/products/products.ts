import { Telegraf } from "telegraf";
import { MyContext } from "../../models/types/MyContext";
import {
  handleProductsCommand
} from "./command/handleProductsCommand";

export function productsCommand(bot: Telegraf<MyContext>) {
  // Команды
  bot.command("products", handleProductsCommand);
}
