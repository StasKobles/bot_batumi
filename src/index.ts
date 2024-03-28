import { Telegraf, session } from "telegraf";
import { textHandler } from "./commands/cart/callback/addressInputHandler";
import { handlerShippingQuery } from "./commands/cart/callback/paymentsMethods/handlerShippingQuery";
import { cartCommand } from "./commands/cart/cart";
import { productsCommand } from "./commands/products/products";
import { startCommand } from "./commands/start/startCommand";
import { botToken } from "./config";
import { setupSession } from "./config/setupSession";
import { MyContext } from "./models/types/MyContext";
import { createCallbackQuery } from "./utils/callbackQuery/callbackQuery";
import { handlerSuccessfulPayment } from "./commands/cart/callback/paymentsMethods/handlerSuccessfulPayment";
import { channelMessagesController } from "./utils/channelMessages/channelMessagesController";
import { menuCommand } from "./commands/menu/command/menuCommand";

const bot = new Telegraf<MyContext>(botToken);

bot.use(session());
bot.use(setupSession);
createCallbackQuery(bot);

startCommand(bot);
productsCommand(bot);
cartCommand(bot);
menuCommand(bot);

handlerShippingQuery(bot);
handlerSuccessfulPayment(bot);

channelMessagesController(bot);

textHandler(bot);
bot.launch();
