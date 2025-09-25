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
  // استیت‌ها (منطق قبلی حفظ شده)
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
      {/* === DESKTOP === */}
      <div className="hidden md:grid md:grid-cols-[22rem_1fr] lg:grid-cols-[24rem_1fr] w-full">
        {/* سایدبار: دقیقاً هم‌قد و هم‌تراز با نقشه */}
        <aside className="relative border-r border-slate-200">
          <div className="sticky top-0 h-screen">
            {/* برای هم‌قد بودن با نقشه از h-screen استفاده می‌کنیم */}
            <div className="h-full w-full p-4 overflow-y-auto">
              {/* اگر دوست داری بدون اسکرول داخلی باشه و محتوایت کوتاهه، overflow-y-auto رو بردار */}
              <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
            </div>
          </div>
        </aside>

        {/* نقشه: تمام صفحه و sticky */}
        <section className="relative">
          <div className="sticky top-0 h-screen">
            <div className="relative w-full h-full">
              <SsjaMapIr coordinate={safeCoord} isDragable={true} />
            </div>
          </div>
        </section>
      </div>

      {/* === MOBILE === */}
      <div className="md:hidden relative min-h-[100dvh]">
        {/* نقشه تمام‌صفحه */}
        <div className="fixed inset-0">
          <SsjaMapIr coordinate={safeCoord} isDragable={true} />
        </div>

        {/* لایه رویی برای نمایش دکمه روی نقشه */}
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          {/* دکمه ثبت ملک: بالاتر از منوی پایین (فرضاً ~64-80px) + safe-area */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="pointer-events-auto fixed right-4 z-[9999] rounded-full px-5 py-3 bg-slate-900 text-white shadow-xl active:scale-95"
            aria-label="افزودن/تنظیمات ملک"
            style={{
              bottom: "calc(88px + env(safe-area-inset-bottom, 0px))", // 88px ≈ بالاتر از منوی پایین
            }}
          >
            ثبت ملک
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

            {/* پنل مودال از پایین */}
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white shadow-2xl max-h-[85dvh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* هندل بالای مودال */}
              <div className="flex justify-center py-2">
                <span className="h-1.5 w-12 rounded-full bg-slate-200" />
              </div>

              {/* محتوای سایدبار */}
              <div className="px-4 pb-4 overflow-y-auto max-h-[78dvh]">
                <AddEstateSidebar setCore={setCordinate} onSetEstate={setEstate} />
              </div>

              {/* اکشن‌های پایین مودال */}
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
