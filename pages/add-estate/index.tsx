import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { globalState } from "../../global/states/globalStates";
import { Estate } from "../../global/types/Estate";
import AddEstateSidebar from "../../components/AddEstate/AddEstateSideBar";
import SsjaMapIr from "../../components/map-component/SajaMapir";

/**
 * نکته‌ها:
 * - منطق قبلی حفظ شده (setCore, onSetEstate, ...).
 * - موبایل: یک bottom-sheet با دو اسنپ؛ اسلایدر افقی برای انتخاب استان/شهر.
 * - اگر لیست استان/شهر را از سرور دارید، این آرایه‌ها را با داده واقعی جایگزین کن.
 */
const PROVINCES = [
  "تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "گیلان", "مازندران", "خوزستان",
];
const CITIES_BY_PROVINCE: Record<string, string[]> = {
  تهران: ["تهران", "ری", "اسلام‌شهر", "شهریار", "قدس", "دماوند", "رباط‌کریم"],
  البرز: ["کرج", "فردیس", "نظرآباد", "اشتهارد"],
  اصفهان: ["اصفهان", "کاشان", "خمینی‌شهر", "نجف‌آباد"],
  فارس: ["شیراز", "کازرون", "مرودشت", "لار"],
  "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار"],
  "آذربایجان شرقی": ["تبریز", "مراغه", "مرند"],
  گیلان: ["رشت", "انزلی", "لاهیجان"],
  مازندران: ["ساری", "بابل", "آمل"],
  خوزستان: ["اهواز", "آبادان", "خرمشهر"],
};

const AddEstate: NextPage = () => {
  // === استیت و منطق موجود پروژه (حفظ شده) ===
  const [toggleShowMapAndList, setToggleShowMapAndList] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fetchEsteate, setEstate] = useState<Estate[]>();
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const state = useRecoilValue(globalState);
  const router = useRouter();

  // موبایل: مدیریت bottom-sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false); // false=collapsed, true=expanded

  // موبایل: انتخاب استان/شهر (اسلایدر افقی)
  const [province, setProvince] = useState<string>("تهران");
  const cities = useMemo(() => CITIES_BY_PROVINCE[province] || [], [province]);
  const [city, setCity] = useState<string>(cities[0] || "تهران");

  useEffect(() => {
    // اگر نقش محدودیت دارد...
    // if (state.role === "blocked_role") { router.push("/login"); } else { setLoaded(true); }
    setCity((prev) => (cities.includes(prev) ? prev : (cities[0] || "")));
  }, [state, router, cities]);

  const safeCoord = cordinate || { longitude: 51.389, latitude: 35.6892, zoom: 12 };

  // خلاصه آدرس برای نمایش کوتاه در نوار جمع‌شده
  const addressSummary = `${province}${city ? `، ${city}` : ""}`;

  return (
    <main dir="rtl" className="bg-white text-slate-800">

      {/* ==== DESKTOP: نقشه تمام‌قد + سایدبار هم‌تراز (sticky, h-screen) ==== */}
      <div className="hidden md:grid md:grid-cols-[22rem_1fr] lg:grid-cols-[24rem_1fr] w-full">
        {/* سایدبار هم‌قد نقشه */}
        <aside className="relative border-r border-slate-200">
          <div className="sticky top-0 h-screen">
            <div className="h-full w-full p-4 overflow-hidden">
              {/* اگر محتوای فرم بلند شد و خواستی کل صفحه اسکرول بخورد، اینجا overflow-y-hidden بماند */}
              <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
            </div>
          </div>
        </aside>

        {/* نقشه: تمام‌قد */}
        <section className="relative">
          <div className="sticky top-0 h-screen">
            <div className="relative w-full h-full">
              <SsjaMapIr coordinate={safeCoord} isDragable={true} />
              {/* نشانگر مرکز (برای دسکتاپ هم مفید است) */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==== MOBILE: نقشه تمام‌صفحه + Bottom Sheet با اسلایدر استان/شهر ==== */}
      <div className="md:hidden relative min-h-[100dvh]">
        {/* نقشه تمام‌صفحه */}
        <div className="fixed inset-0">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
        </div>

        {/* نشانگر مرکز (crosshair) */}
        <div className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]">
          <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
        </div>

        {/* Bottom Sheet: دو حالت (collapsed/expanded) */}
        <div
          className="fixed inset-x-0 z-[70]"
          style={{
            bottom: isSheetOpen
              ? "0px"
              : "calc(72px + env(safe-area-inset-bottom, 0px))", // نوار کوتاه بالای Bottom Nav
          }}
        >
          {/* پنل */}
          <div
            className={`mx-auto w-full max-w-none rounded-t-2xl bg-white shadow-2xl border-t border-slate-200 transition-all duration-300 ease-out ${
              isSheetOpen ? "max-h-[85dvh]" : "max-h-[56px]"
            }`}
          >
            {/* دسته‌ی کشیدن/کلیک برای باز و بسته کردن */}
            <button
              type="button"
              onClick={() => setIsSheetOpen((v) => !v)}
              className="w-full flex items-center justify-center py-2"
              aria-label={isSheetOpen ? "بستن پنل" : "باز کردن پنل"}
            >
              <span className="h-1.5 w-12 rounded-full bg-slate-300" />
            </button>

            {/* حالت جمع‌شده: نوار خلاصه + دکمه ثبت ملک */}
            {!isSheetOpen && (
              <div className="px-4 pb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-500 truncate">
                    {addressSummary || "انتخاب استان و شهرستان"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    نشانگر روی نقشه را روی آدرس دقیق بگذارید
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 text-white"
                  onClick={() => setIsSheetOpen(true)}
                >
                  ثبت ملک
                </button>
              </div>
            )}

            {/* حالت باز: انتخاب استان/شهر (اسلایدر افقی) + خلاصه موقعیت + تایید */}
            {isSheetOpen && (
              <div className="px-4 pb-3">
                {/* تیتر */}
                <h2 className="text-base font-semibold mb-3">ثبت آدرس</h2>

                {/* اسلایدر افقی استان */}
                <div className="mb-2">
                  <div className="text-xs text-slate-500 mb-1">استان</div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {PROVINCES.map((p) => {
                      const active = p === province;
                      return (
                        <button
                          key={p}
                          onClick={() => setProvince(p)}
                          className={`whitespace-nowrap px-3 py-1.5 rounded-full border ${
                            active
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* اسلایدر افقی شهر */}
                <div className="mb-3">
                  <div className="text-xs text-slate-500 mb-1">شهرستان</div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {cities.length ? (
                      cities.map((c) => {
                        const active = c === city;
                        return (
                          <button
                            key={c}
                            onClick={() => setCity(c)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full border ${
                              active
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-300"
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 text-sm">برای این استان، لیست شهرستان‌ها را تکمیل کنید.</span>
                    )}
                  </div>
                </div>

                {/* خلاصه و راهنما */}
                <div className="text-xs text-slate-500 mb-3">
                  <p className="mb-1">مختصات را با جابه‌جا کردن نقشه زیر نشانگر تنظیم کنید.</p>
                  <p>استان/شهرستان: <span className="font-medium text-slate-700">{addressSummary}</span></p>
                </div>

                {/* اکشن‌ها */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    بستن
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white"
                    onClick={() => {
                      // اینجا فقط UI را می‌بندیم. اگر لازم شد می‌تونی setCore رو با مختصات فعلی صدا بزنی.
                      // setCordinate({...safeCoord})  ← در صورت نیاز
                      setIsSheetOpen(false);
                    }}
                  >
                    تایید
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* دکمه شناور «ثبت ملک» برای دسترسی سریع (بالای Bottom Nav) */}
        {!isSheetOpen && (
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="fixed z-[80] right-4 rounded-full px-5 py-3 bg-slate-900 text-white shadow-xl active:scale-95"
            style={{
              bottom: "calc(88px + env(safe-area-inset-bottom, 0px))", // بالاتر از Bottom Nav
            }}
            aria-label="ثبت ملک"
          >
            ثبت ملک
          </button>
        )}
      </div>
    </main>
  );
};

export default AddEstate;
