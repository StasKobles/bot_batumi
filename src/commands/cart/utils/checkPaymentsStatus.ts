import { getExchangeRates, getInvoices } from "../callback/createTransaction";

export const checkPaymentsStatus = async (id: number) => {
  const res = await getInvoices(id);
  return res?.items[0].status === "paid";
};

export async function findRate() {
  const data = await getExchangeRates();
  if (data === null) {
    console.error("Failed to get exchange rates");
    return null;
  }

  const targetRate = data.find(
    (item) => item.source === "TON" && item.target === "GEL"
  );
  return targetRate?.rate;
}
