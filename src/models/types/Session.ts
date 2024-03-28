import { Invoice } from "../../commands/cart/types";

export type Languages = "ru" | "en" | "ka";

export interface CartItem {
  name: string; // Название товара
  id: number;
  quantity: number; // Количество
  price: number; // Цена за одну единицу
}


export interface SessionData {
  language: Languages;
  cart: CartItem[]; // Ключ - ID продукта, значение - количество
  lastCartMessageId: number | null;
  totalPrice: number;
  invoice?: Invoice;
  address: string;
  currentProductIndex: number;
  helpStep: boolean;
}
