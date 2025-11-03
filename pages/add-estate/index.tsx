import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";


import { globalState } from "../../global/states/globalStates";
import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { Estate } from "../../global/types/Estate";
import AddEstateSidebar from "../../components/AddEstate/AddEstateSideBar";
import SsjaMapIr from "../../components/map-component/SajaMapir";

const AddEstate: NextPage = () => {
  const state = useRecoilValue(globalState);
  const router = useRouter();
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const [fetchEstate, setEstate] = useState<Estate[]>();
  const [loaded, setLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => setLoaded(true), []);

  const safeCoord = cordinate || { longitude: 51.389, latitude: 35.6892, zoom: 12 };

  // Motion
  const y = useMotionValue(0);
  const sheetOpacity = useTransform(y, [-200, 0, 200], [1, 1, 0.9]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    if (offset > 120 || velocity > 600) setIsFormOpen(false);
    else if (offset < -120 || velocity < -600) setIsFormOpen(true);
  };

  return (
    <main dir="rtl" className="bg-white text-slate-800">
      {/* ==== DESKTOP ==== */}
      <div className="hidden md:grid md:grid-cols-[22rem_1fr] lg:grid-cols-[24rem_1fr] h-screen">
        <aside className="border-r border-slate-200 overflow-hidden">
          <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
        </aside>
        <section className="relative h-full">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
          </div>
        </section>
      </div>

      {/* ==== MOBILE ==== */}
      <div className="md:hidden relative h-[100dvh] overflow-hidden">
        {/* نقشه */}
        <div className="absolute inset-0">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
          </div>
        </div>

        {/* دکمه شناور افزودن ملک */}
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="fixed z-40 right-4 rounded-full shadow-xl bg-slate-900 text-white p-4 active:scale-95 transition-all"
            style={{
              bottom: "calc(100px + env(safe-area-inset-bottom, 0px))",
            }}
            aria-label="افزودن ملک"
          >
          
          </button>
        )}

        {/* Overlay تار و محو هنگام باز بودن فرم */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsFormOpen(false)} // بستن با کلیک بیرون
            />
          )}
        </AnimatePresence>

        {/* Bottom Sheet */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/90 rounded-t-3xl shadow-2xl border-t border-slate-200"
          style={{ y, opacity: sheetOpacity }}
          drag="y"
          dragConstraints={{ top: -600, bottom: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ y: 500 }}
          animate={{ y: isFormOpen ? 0 : 500 }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        >
          {/* دسته کشیدن */}
          <div
            className="w-full flex justify-center py-2 cursor-grab active:cursor-grabbing"
            onClick={() => setIsFormOpen((v) => !v)}
          >
            <div className="h-1.5 w-10 bg-slate-300 rounded-full" />
          </div>

          {/* دکمه بستن */}
          {isFormOpen && (
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-3 right-3 z-50 bg-white/80 hover:bg-white text-slate-800 rounded-full p-2 shadow-md active:scale-95 backdrop-blur-sm"
              aria-label="بستن"
            >
            
            </button>
          )}

          {/* فرم */}
          {isFormOpen && (
            <div className="h-[calc(85dvh-40px)] overflow-y-auto p-4">
              <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default AddEstate;
