import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

  // برای drag پایین
  const y = useMotionValue(0);
  const sheetOpacity = useTransform(y, [-200, 0, 200], [1, 1, 0.9]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    if (offset > 120 || velocity > 600) {
      setIsFormOpen(false);
    } else if (offset < -120 || velocity < -600) {
      setIsFormOpen(true);
    }
  };

  return (
    <main dir="rtl" className="bg-white text-slate-800">
      {/* === DESKTOP === */}
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

      {/* === MOBILE === */}
      <div className="md:hidden relative h-[100dvh] overflow-hidden">
        {/* نقشه تمام صفحه */}
        <div className="absolute inset-0">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-4 h-4 rounded-full bg-slate-900/90 shadow ring-2 ring-white" />
          </div>
        </div>

        {/* دکمه ثابت پایین برای باز کردن فرم */}
        {!isFormOpen && (
          <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 rounded-full bg-slate-900 text-white font-medium shadow-xl active:scale-95 transition-all"
            >
              افزودن ملک
            </button>
          </div>
        )}

        {/* Bottom Sheet انیمیشنی */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200"
          style={{ y, opacity: sheetOpacity }}
          drag="y"
          dragConstraints={{ top: -600, bottom: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ y: 500 }}
          animate={{ y: isFormOpen ? 0 : 500 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* دسته کشیدن */}
          <div
            className="w-full flex justify-center py-2 cursor-grab active:cursor-grabbing"
            onClick={() => setIsFormOpen((v) => !v)}
          >
            <div className="h-1.5 w-10 bg-slate-300 rounded-full" />
          </div>

          {/* محتوای فرم */}
          {isFormOpen && (
            <div className="h-[calc(85dvh-40px)] overflow-y-auto p-3">
              <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default AddEstate;
