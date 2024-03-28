require("dotenv").config();

const botToken = process.env.BOT_TOKEN || "";
const adminChatId = process.env.ADMIN_CHAT_ID || "";
const databaseURL = process.env.DATABASE_URL || "";
const databaseName = process.env.DATABASE_NAME || "";
const databasePassword = process.env.DATABASE_PASSWORD || "";
const databaseUser = process.env.DATABASE_USER || "";
const cryptoPayApiKey = process.env.CRYPTO_PAY_API_KEY || "";
const yooKassaApiKey = process.env.YOO_KASSA_API_KEY || "";
const smartGlocalApiKey = process.env.SMART_GLOCAL_API_KEY || "";
const adminId = process.env.ADMIN_ID || "";

const btcPayApiKey = process.env.BTC_PAY_API_KEY || "";
const btcPayBaseUrl = process.env.BTC_PAY_BASE_URL || "";
const btcPayStoreId = process.env.BTC_PAY_STORE_ID || "";

// Экспортируйте переменные
export {
  botToken,
  adminChatId,
  databaseURL,
  databaseName,
  databasePassword,
  databaseUser,
  cryptoPayApiKey,
  yooKassaApiKey,
  smartGlocalApiKey,
  adminId,
  btcPayApiKey,
  btcPayBaseUrl,
  btcPayStoreId
};
