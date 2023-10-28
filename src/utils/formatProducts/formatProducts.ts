import { MyContext } from "../../models/types/MyContext";
import { Product } from "../../models/types/Product";

export const formatProduct = (t:MyContext['t'], product: Product): string => {
  return [
    `*${product.name}*`,
    `${product.description}`,
    `*${t('price')} ${product.price}₾*`,
  ].join("\n");
};