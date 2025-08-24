import { z } from 'zod';

export const numberInputSchema = z.number()
  .int()
  .min(1, "1以上の数値を入力してください")
  .max(999, "999以下の数値を入力してください");

export const groupNumberInputSchema = z.number()
  .int()
  .min(20, "団体料金は20名以上です")
  .max(9999, "9999以下の数値を入力してください");

export type NumberInputValue = z.infer<typeof numberInputSchema>;
export type GroupNumberInputValue = z.infer<typeof groupNumberInputSchema>;

export function validateNumberInput(value: unknown, isGroup = false): { success: boolean; data?: number; error?: string } {
  const schema = isGroup ? groupNumberInputSchema : numberInputSchema;
  const result = schema.safeParse(value);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, error: result.error.issues[0]?.message };
}