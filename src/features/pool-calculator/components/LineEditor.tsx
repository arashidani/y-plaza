import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type {
  Line,
  Category,
  MembershipCategory,
  MembershipLine,
  Tariff,
  MembershipDuration,
} from "../models/types";
import { useCategoryLabel, useTariffLabel, useDurationLabel } from "../models/labels";
import { LOCKER_PER_USE } from "../models/pricing";
import {
  calcLineTotal,
  poolEntryUnitPrice,
  isTariffAvailableForCategory,
} from "../utils/calculations";
import { YenMono } from "./YenMono";
import { NumberInput } from "./NumberInput";
import { Select } from "./Select";
import { useTranslations } from "next-intl";



// 金額列の共通クラス（幅固定＋右寄せ＋等幅数字）
const AMOUNT_COL = "w-28 sm:w-32 justify-self-end text-right tabular-nums";

interface LineEditorProps {
  line: Line;
  onChange: (ln: Line) => void;
  onDelete: () => void;
  hasPoolUserOrMember?: boolean;
}

export function LineEditor({
  line,
  onChange,
  onDelete,
  hasPoolUserOrMember = false,
}: LineEditorProps) {
const TARIFF_LABEL = useTariffLabel();
const CATEGORY_LABEL = useCategoryLabel();
const DURATION_LABEL = useDurationLabel();

const t = useTranslations("poolCalculator.type");
const tCommon = useTranslations("poolCalculator");


const LINE_TYPE_LABELS = {
    pool: t("pool"),
    gym: t("gym"),
    locker: t("locker"),
    membership: t("membership"),
    coupon: t("coupon"),
} as const;

  const total = calcLineTotal(line);

  return (
    <Card>
      {/* ヘッダーにXボタンを配置して重なり問題を解消 */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">
          {LINE_TYPE_LABELS[line.type]}
        </CardTitle>
        <Button
          onClick={onDelete}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="行を削除"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      {/* 金額列固定の2カラムグリッド：左=入力、右=金額 */}
      <CardContent className="grid gap-3 md:grid-cols-[1fr_8rem]">
        {/* 左：入力UI */}
        <div className="space-y-2">
          {line.type === "pool" && (
            <>
              <div className="max-w-sm">
                <Select<Tariff>
                  value={line.tariff}
                  onChange={(v) =>
                    onChange({
                      ...line,
                      tariff: v,
                      entries: line.entries.filter((e) =>
                        isTariffAvailableForCategory(v, e.category),
                      ),
                    })
                  }
                  options={Object.entries(TARIFF_LABEL).map(([v, label]) => ({
                    value: v as Tariff,
                    label,
                  }))}
                />
              </div>

              <div className="space-y-2">
                {line.entries.map((entry, idx) => {
                  const unit = poolEntryUnitPrice(
                    line.tariff,
                    entry.category,
                    entry.disabledDiscount,
                  );
                  const entrySubtotal = Number.isFinite(unit)
                    ? unit * entry.count
                    : 0;

                  return (
                    <div
                      key={idx}
                      className="grid items-center gap-2 rounded bg-gray-50 p-2 dark:bg-gray-800 md:grid-cols-[auto_1fr_auto]"
                    >
                      <Select<Category>
                        value={entry.category}
                        onChange={(v) => {
                          const newEntries = [...line.entries];
                          newEntries[idx] = { ...entry, category: v };
                          onChange({ ...line, entries: newEntries });
                        }}
                        options={(Object.keys(CATEGORY_LABEL) as Category[])
                          .filter((c) =>
                            isTariffAvailableForCategory(line.tariff, c),
                          )
                          .map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))}
                        className="min-w-[150px]"
                      />

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{tCommon("people")}</span>
                          <NumberInput
                            value={entry.count}
                            min={line.tariff === "group" ? 20 : 1}
                            max={line.tariff === "group" ? undefined : 19}
                            isGroup={line.tariff === "group"}
                            onChange={(n) => {
                              const newEntries = [...line.entries];
                              newEntries[idx] = { ...entry, count: n };
                              onChange({ ...line, entries: newEntries });
                            }}
                          />
                        </div>

                        <label className="inline-flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            className="h-3 w-3"
                            checked={entry.disabledDiscount}
                            onChange={(e) => {
                              const newEntries = [...line.entries];
                              newEntries[idx] = {
                                ...entry,
                                disabledDiscount: e.target.checked,
                              };
                              onChange({ ...line, entries: newEntries });
                            }}
                          />
                          <span className="text-xs">{useTranslations("poolCalculator")("disabledDiscount")}</span>
                        </label>
                      </div>

                      <div className="justify-self-end text-right">
                        <YenMono
                          value={entrySubtotal}
                          className="text-sm font-medium tabular-nums"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {tCommon("entryFeeOnly")}
                        </div>
                      </div>

                      {line.entries.length > 1 && (
                        <div className="col-span-full flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              const newEntries = line.entries.filter(
                                (_, i) => i !== idx,
                              );
                              onChange({ ...line, entries: newEntries });
                            }}
                          >
                            {tCommon("deleteRow", { defaultValue: "行を削除" })}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const available = (
                      Object.keys(CATEGORY_LABEL) as Category[]
                    ).filter((c) =>
                      isTariffAvailableForCategory(line.tariff, c),
                    );
                    const newEntry = {
                      category: available[0] || ("adult" as Category),
                      count: 1,
                      disabledDiscount: false,
                    };
                    onChange({ ...line, entries: [...line.entries, newEntry] });
                  }}
                >
                  {tCommon("addCategory", { defaultValue: "カテゴリ追加" })}
                </Button>

                {line.tariff === "group" &&
                  line.entries.reduce((s, e) => s + e.count, 0) < 20 && (
                    <div className="text-xs text-red-600">
                      {tCommon("groupTariffWarning", {
                        count: line.entries.reduce((s, e) => s + e.count, 0),
                        defaultValue: "団体料金は合計20名以上で適用されます（現在:{count}名）"
                      })}
                    </div>
                  )}

                {line.tariff !== "group" &&
                  line.entries.reduce((s, e) => s + e.count, 0) >= 20 && (
                    <div className="text-xs text-amber-600">
                      {tCommon("groupTariffSuggest", { defaultValue: "20名以上は団体料金(20名以上)を選択してください" })}
                    </div>
                  )}
              </div>
            </>
          )}

          {line.type === "gym" && (
            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <div className="sm:col-span-2 max-w-sm">
                <Select<"adult" | "student" | "member_or_pool_user">
                  value={line.who}
                  onChange={(v) => onChange({ ...line, who: v })}
                  options={
                    hasPoolUserOrMember
                      ? [
                          {
                            value: "member_or_pool_user",
                            label: tCommon("memberOrPoolUser"),
                          },
                          { value: "adult", label: tCommon("adult") },
                          { value: "student", label: tCommon("student") },
                        ]
                      : [
                          { value: "adult", label: tCommon("adult") },
                          { value: "student", label: tCommon("student") },
                          {
                            value: "member_or_pool_user",
                            label: tCommon("memberOrPoolUser"),
                          },
                        ]
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{tCommon("people")}</span>
                <NumberInput
                  value={line.count}
                  min={1}
                  onChange={(n) => onChange({ ...line, count: n })}
                />
              </div>
              <div className="sm:col-span-3 text-sm text-gray-600 dark:text-gray-300">
                {tCommon("gymNote")}
                {hasPoolUserOrMember && line.who !== "member_or_pool_user" && (
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    • {tCommon("gymFreeNote")}
                  </div>
                )}
              </div>
            </div>
          )}

          {line.type === "locker" && (
            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm">{tCommon("lockerCount")}</span>
                <NumberInput
                  value={line.count}
                  min={1}
                  onChange={(n) => onChange({ ...line, count: n })}
                />
              </div>
              <div className="sm:col-span-2 text-sm text-gray-600 dark:text-gray-300">
                {tCommon("lockerUnit")} <YenMono value={LOCKER_PER_USE} />
              </div>
            </div>
          )}

          {line.type === "membership" && (
            <div className="grid gap-2 sm:grid-cols-4 sm:items-center">
              <div className="sm:col-span-1 max-w-[160px]">
                <Select<MembershipDuration>
                  value={line.duration}
                  onChange={(v) => onChange({ ...line, duration: v })}
                  options={Object.entries(DURATION_LABEL).map(
                    ([v, label]) => ({
                      value: v as MembershipDuration,
                      label,
                    }),
                  )}
                />
              </div>
              <div className="sm:col-span-2 max-w-sm">
                <Select<MembershipCategory>
                  value={line.category}
                  onChange={(v) => onChange({ ...line, category: v })}
                  options={[
                    {
                      value: "adult" as MembershipCategory,
                      label: CATEGORY_LABEL.adult,
                    },
                    {
                      value: "senior" as MembershipCategory,
                      label: CATEGORY_LABEL.senior,
                    },
                    {
                      value: "student" as MembershipCategory,
                      label: CATEGORY_LABEL.student,
                    },
                  ]}
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={(line as MembershipLine).disabledDiscount}
                  onChange={(e) =>
                    onChange({ ...line, disabledDiscount: e.target.checked })
                  }
                />
                <span>{useTranslations("poolCalculator")("disabledDiscount")}</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm">{tCommon("units")}</span>
                <NumberInput
                  value={line.count}
                  min={1}
                  onChange={(n) => onChange({ ...line, count: n })}
                />
              </div>
            </div>
          )}

          {line.type === "coupon" && (
            <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
              <div className="sm:col-span-2 max-w-sm">
                <Select<"adult" | "senior" | "student" | "preschool3plus">
                  value={line.category}
                  onChange={(v) => onChange({ ...line, category: v })}
                  options={[
                    { value: "adult", label: CATEGORY_LABEL.adult },
                    { value: "senior", label: CATEGORY_LABEL.senior },
                    { value: "student", label: CATEGORY_LABEL.student },
                    {
                      value: "preschool3plus",
                      label: CATEGORY_LABEL.preschool3plus,
                    },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{tCommon("books")}</span>
                <NumberInput
                  value={line.books}
                  min={1}
                  onChange={(n) => onChange({ ...line, books: n })}
                />
              </div>
              <div className="sm:col-span-3 text-sm text-gray-600 dark:text-gray-300">
                {tCommon("couponBookNote")}
              </div>
            </div>
          )}
        </div>

        {/* 右：金額（固定幅・右端揃え） */}
        <div className={AMOUNT_COL}>
          <YenMono value={total} className="text-lg font-bold" />
          {line.type === "pool" && (
            <div className="mt-1 text-xs text-muted-foreground leading-snug">
              {tCommon("total")}{line.entries.reduce((s, e) => s + e.count, 0)}{tCommon("peopleUnit")}
              <br />
              （{tCommon("entryFeeOnly")}）
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

