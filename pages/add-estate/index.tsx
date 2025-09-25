import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import MapInfo, { defaultMapInfo } from "../../global/types/MapInfo";
import { globalState } from "../../global/states/globalStates";
import { Estate } from "../../global/types/Estate";
import AddEstateSidebar from "../../components/AddEstate/AddEstateSideBar";
import SsjaMapIr from "../../components/map-component/SajaMapir";

const AddEstate: NextPage = () => {
  // === استیت‌ها ===
  const [toggleShowMapAndList, setToggleShowMapAndList] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fetchEsteate, setEstate] = useState<Estate[]>();
  const [cordinate, setCordinate] = useState<MapInfo>(defaultMapInfo);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const state = useRecoilValue(globalState);
  const router = useRouter();

  useEffect(() => {
    // if (state.role === "blocked_role") {
    //   router.push("/login");
    // } else {
    //   setLoaded(true);
    // }
  }, [state, router]);

  const safeCoord = cordinate || { longitude: 51.3890, latitude: 35.6892, zoom: 11 };

  return (
    <main dir="rtl" className="bg-white text-slate-800">
      {/* === دسکتاپ === */}
      <div className="hidden md:grid md:grid-cols-[22rem_1fr] lg:grid-cols-[24rem_1fr] w-full min-h-screen">
        {/* سایدبار */}
        <aside className="border-r border-slate-200">
          <div className="p-4">
            <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
          </div>
        </aside>

        {/* نقشه */}
        <section className="relative">
          <div className="sticky top-0 h-screen">
            <div className="relative w-full h-full">
              <SsjaMapIr coordinate={safeCoord} isDragable={true} />
            </div>
          </div>
        </section>
      </div>

      {/* === موبایل === */}
      <div className="md:hidden relative min-h-[100dvh]">
        {/* نقشه تمام‌صفحه */}
        <div className="fixed inset-0">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
        </div>

        {/* دکمه شناور */}
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="pointer-events-auto fixed bottom-4 right-4 z-[9999] rounded-full px-5 py-3 bg-slate-900 text-white shadow-xl active:scale-95"
            aria-label="افزودن/تنظیمات ملک"
            style={{
              paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
            }}
          >
            + افزودن ملک
          </button>
        </div>

        {/* مودال سایدبار */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-[10000]"
            role="dialog"
            aria-modal="true"
            onClick={() => setMobileSidebarOpen(false)}
          >
            {/* بک‌دراپ */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* پنل */}
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-2xl max-h-[85dvh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center py-2">
                <span className="h-1.5 w-12 rounded-full bg-slate-200" />
              </div>

              <div className="px-4 pb-4 overflow-y-auto max-h-[78dvh]">
                <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  بستن
                </button>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white"
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AddEstate;
