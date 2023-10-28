import { Invoice } from "../../commands/cart/types";

export type Languages = "ru" | "en" | "ka";

interface Address {
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
}

export interface CartItem {
  name: string; // Название товара
  id: number;
  quantity: number; // Количество
  price: number; // Цена за одну единицу
}

type AddressStage = "city" | "street" | "house" | "apartment" | undefined;

export interface SessionData {
  language: Languages;
  cart: CartItem[]; // Ключ - ID продукта, значение - количество
  lastCartMessageId: number | null;
  totalPrice: number;
  invoice?: Invoice;
  address: Address;
  addressStage: AddressStage;
}
