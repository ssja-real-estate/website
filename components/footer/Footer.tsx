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
              سایت املاک یک پلتفرم آنلاین است که به مشتریان اجازه می دهد تا در
              بین فروشندگان و خریداران املاک مختلف جستجو کنند و املاک را به
              راحتی پیدا کنند. این سایت املاک می تواند به عنوان یک منبع اطلاعاتی
              برای کاربران در جستجوی خرید یا اجاره ملک خدمت کند. با استفاده از
              این سایت، کاربران می توانند به راحتی به مشخصات ملک دلخواه خود
              دسترسی پیدا کنند. این اطلاعات شامل جزئیات مختلف مانند نوع ملک،
              متراژ، قیمت، موقعیت جغرافیایی و اطلاعات دیگری است که به خریداران و
              فروشندگان کمک می کند تا به آسانی و سریع به دنبال گزینه های مناسب
              برای خود بگردند.
            </p>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-[#0ba] mb-4">تماس با ما</h3>
            <div className="flex flex-col gap-3 w-">
              <span className="font-bold">آدرس:</span>
              <p className="pr-2">
                آذربایجان غربی - مهاباد- کوی زیبا
              </p>
              {/* <span className="font-bold">شماره موبایل:</span> */}
              {/* <p dir="ltr" className="pr-2 text-right">
                {Strings.mobileNumber}
              </p> */}
              <div className="flex flex-row justify-start items-center text-[#0ba] gap-3">
                <FaIcon.FaTelegram className="w-6 h-6" />
                <FaIcon.FaInstagram className="w-6 h-6" />
                <FaIcon.FaWhatsapp className="w-6 h-6" />
              </div>
            </div>
          </div>
          {/* <div className="">
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
              </a> dfd
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Footer;
