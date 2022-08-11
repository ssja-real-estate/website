import Image from "next/image";
import Link from "next/link";
import * as FaIcon from "react-icons/fa";
import Strings from "../../data/strings";
function Footer() {
  return (
    <div className="w-full bg-[#222] text-[#bebebe]">
      <div className="container py-20">
        <div className="flex flex-col md:flex-row gap-10 items-start justify-start">
          <div className="">
            <h3 className="text-[#0ba] mb-4">منوی اصلی</h3>
            <ul className="flex flex-col space-y-2 text-sm pr-3">
              <li>
                <Link href="/">{Strings.addEstates}</Link>
              </li>
              <li>
                <Link href="/">{Strings.searchEstates}</Link>
              </li>
              <li>
                <Link href="/">{Strings.inquiries}</Link>
              </li>
              <li>
                <Link href="/">{Strings.contractSamples}</Link>
              </li>
              <li>
                <Link href="/">{Strings.laws}</Link>
              </li>
              <li>
                <Link href="/">{Strings.commissionCalculation}</Link>
              </li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="text-[#0ba] mb-4">درباره ما</h3>
            <p className="text-justify pl-5">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله
              در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد
              نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
            </p>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-[#0ba] mb-4">تماس با ما</h3>
            <div className="flex flex-col gap-3 w-">
              <span className="font-bold">آدرس:</span>
              <p className="pr-2">
                آذربایجان غربی - مهاباد- تپه قاضی - ایستگاه 3
              </p>
              <span className="font-bold">شماره موبایل:</span>
              <p dir="ltr" className="pr-2 text-right">
                {"0914 444 4444"}
              </p>
              <div className="flex flex-row justify-start items-center text-[#0ba] gap-3">
                <FaIcon.FaTelegram className="w-6 h-6" />
                <FaIcon.FaInstagram className="w-6 h-6" />
                <FaIcon.FaWhatsapp className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="">
            <h3 className="text-[#0ba] mb-4">نماد اعتماد</h3>
            <div className="bg-white/100 rounded-md border-2 border-[#0ba] shadow-2xl shadow-[#0ba] border-spacing-8">
              <a
                href="https://trustseal.enamad.ir/?id=272685&Code=mpSx0xjRfdtYxeZVHICW"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/image/enamad2.png"
                  width={94}
                  height={150}
                  alt="enamad"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
