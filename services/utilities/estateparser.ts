/* lib/estateParser.ts */


import { Estate, EstateLocation } from "../../global/types/Estate";
import { EstateCardProps } from "../../global/types/estatecard";
import { Field, FieldType } from "../../global/types/Field";

/* ---------- انواع کمکی ---------- */
export interface PriceEntry {
  label: string;   // عنوان فیلد (مثلاً «مبلغ رهن» یا «کرایه ماهانه»)
  amount: number;  // مقدار عددی (تومان)
}

/* ---------- توابع کمکی ---------- */
const composeAddress = (
  province?: EstateLocation,
  city?: EstateLocation,
  neighborhood?: EstateLocation,
): string =>
  [province?.name, city?.name, neighborhood?.name].filter(Boolean).join('، ') ||
  '—';

/** کلمات کلیدیِ مرتبط با قیمت */
const priceKeywords = ['قیمت', 'مبلغ', 'رهن', 'ودیعه', 'کرایه', 'اجاره'];

/** آیا فیلد، فیلد قیمتی است؟ */
const isPriceField = (f: Field): boolean =>
  f.type === FieldType.Price ||
  priceKeywords.some(k => f.title.includes(k));

/** استخراج تمام فیلدهای قیمتی به‌صورت فهرست {label, amount} */
const extractPrices = (fields: Field[]): PriceEntry[] =>
  fields
    .filter(isPriceField)
    .map(f => {
      const raw = f.value;
      const amount =
        typeof raw === 'number'
          ? raw
          : typeof raw === 'string'
          ? Number(raw.replace(/[٬,\s]/g, ''))
          : NaN;

      return isNaN(amount) ? null : { label: f.title, amount };
    })
    .filter(Boolean) as PriceEntry[];

/** استخراج عکس‌ها (اولین فیلد type === Image یا حاوی URL‌ها) */
const extractImages = (fields: Field[]): string[] => {
  const imgField = fields.find(f => f.type === FieldType.Image);
  if (!imgField) return [];
  const { value } = imgField;
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') return [value];
  return [];
};

/* ---------- خروجی برای کارت ---------- */
export interface EstateCardData extends Omit<EstateCardProps, 'price'> {
  prices: PriceEntry[];
}

export const parseEstateToCard = (estate: Estate): EstateCardData => {
  const {
    id,
    province,
    city,
    neighborhood,
    dataForm: { title: formTitle, fields },
  } = estate;

  // عنوان نهایی (عنوان فرم + تعداد خواب در صورت وجود)
  const bedroom = fields.find(f => f.title.includes('خواب'))?.value;
  const title =
    bedroom && typeof bedroom === 'string'
      ? `${formTitle} ${bedroom}`
      : formTitle || '—';

  return {
    id,
    title,
    address: composeAddress(province, city, neighborhood),
    prices: extractPrices(fields),
    images: extractImages(fields),
  };
};
