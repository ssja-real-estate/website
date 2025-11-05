import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

import SidebarMap from "../../components/map-component/SidebarMap";
import SsjaMapIr from "../../components/map-component/SajaMapir";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { Estate } from "../../global/types/Estate";
import NewViewHouses from "../../components/home/view-houses/NewViewHouses";

const SearchEstate: NextPage = () => {
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const [fetchEstate, setEstate] = useState<Estate[]>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const safeCoord = cordinate || { longitude: 51.389, latitude: 35.6892, zoom: 12 };

  // motion bottom sheet (mobile)
  const y = useMotionValue(0);
  const sheetOpacity = useTransform(y, [-200, 0, 200], [1, 1, 0.9]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    if (offset > 120 || velocity > 600) setIsFilterOpen(false);
    else if (offset < -120 || velocity < -600) setIsFilterOpen(true);
  };

  return (
    <main dir="rtl" className="bg-white text-slate-800">
      {/* ==== DESKTOP ==== */}
      <div className="hidden md:grid h-screen grid-cols-[24rem_1fr]">
        {/* Sidebar چپ تمام‌قد */}
        <aside className="col-start-1 h-screen overflow-y-auto border-l border-slate-200 bg-slate-800/90 text-white shadow-md">
          <div className="p-4">
            <SidebarMap setCore={setCordinate} onSetEstate={setEstate} width="full" />
          </div>
        </aside>

        {/* راست: نقشه بالا، لیست پایین */}
        <section className="col-start-2 flex flex-col min-h-0">
          {/* نقشه (نصف بالا) */}
          <div className="relative h-[50vh] border-b border-slate-200">
            <SsjaMapIr coordinate={safeCoord} isDragable={true} />
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
            </div>
          </div>

          {/* لیست املاک (نصف پایین) */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50">
            <div className="mx-auto max-w-[1400px] px-6 py-6">
              {fetchEstate === undefined ? (
                <div className="text-center text-gray-500">جستجویی انجام نشده است</div>
              ) : fetchEstate.length === 0 ? (
                <div className="text-center text-gray-500">
                  موردی با این مشخصات یافت نشد
                </div>
              ) : (
                <div
                  className="grid gap-6 
                             grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                >
                  <NewViewHouses allestates={fetchEstate} />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ==== MOBILE ==== */}
      <div className="md:hidden relative h-[100dvh] overflow-hidden">
        {/* نقشه تمام‌صفحه */}
        <div className="absolute inset-0">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
          </div>
        </div>

        {/* دکمه باز کردن فیلترها */}
        {!isFilterOpen && (
          <button
            onClick={() => setIsFilterOpen(true)}
            className="fixed z-40 right-4 rounded-full shadow-xl bg-slate-900 text-white p-4 active:scale-95 transition-all"
            style={{ bottom: "calc(100px + env(safe-area-inset-bottom, 0px))" }}
            aria-label="باز کردن فیلترها"
          >
            🔍
          </button>
        )}

        {/* Overlay تار هنگام باز بودن bottom sheet */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsFilterOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Bottom Sheet موبایل */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/95 rounded-t-3xl shadow-2xl border-t border-slate-200"
          style={{ y, opacity: sheetOpacity }}
          drag="y"
          dragConstraints={{ top: -600, bottom: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ y: 500 }}
          animate={{ y: isFilterOpen ? 0 : 500 }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        >
          {/* دسته‌ی کشیدن */}
          <div
            className="w-full flex justify-center py-2 cursor-grab active:cursor-grabbing"
            onClick={() => setIsFilterOpen((v) => !v)}
          >
            <div className="h-1.5 w-10 bg-slate-300 rounded-full" />
          </div>

          {/* محتوای bottom sheet */}
          {isFilterOpen && (
            <div className="h-[calc(85dvh-40px)] overflow-y-auto p-4">
              <SidebarMap setCore={setCordinate} onSetEstate={setEstate} width="full" />
              <div className="mt-4">
                {fetchEstate === undefined ? (
                  <div className="text-center text-gray-500">جستجویی انجام نشده است</div>
                ) : fetchEstate.length === 0 ? (
                  <div className="text-center text-gray-500">
                    ملکی با مشخصات وارد شده موجود نیست.
                  </div>
                ) : (
                  <NewViewHouses allestates={fetchEstate} />
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ✅ استایل درست‌شده بدون ارور jsx/global */}
      <style global jsx>{`
        .cards-grid > * {
          width: 100%;
        }
      `}</style>
    </main>
  );
};

export default SearchEstate;
