import Image from "next/image";
import Link from "next/link";
import * as FaIcon from "react-icons/fa";
import Strings from "../../data/strings";
function Footer() {
  return (
    <div className="flex  w-full bg-[#222] text-[#bebebe]">
      <div className="flex py-20">
        <div className="flex flex-col md:flex-row gap-10 items-start justify-start">
          <div className="">
            <h3 className="text-[#0ba] px-3 mb-4 ">منوی اصلی</h3>
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
            استارت ساخت پلتفرم ثجا در مورخه 2 شهریور 1399 با هدف تسریع در معاملات، جلوگیری از اخلال در بازار ملک توسط برخی دلالان و کلاهبرداری کسانی که ملک دیگران را برای فروش، رهن و اجاره قرار می دهند، زده شد طوری که عموم مردم، کانال های تلگرامی، پیج ها، سایت ها و اپلیکیشن های املاک در یک جا قادر به ثبت و جستجوی املاک با فیلدهای اختصاصی شوند و مشتریان به آسانی موارد ثبت شده را جستجو نمایند.
            </p>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-[#0ba] mb-4">تماس با ما</h3>
            
            <div className="flex flex-row gap-3 w-">
             
            
              <span>تلفن تماس:</span> <span dir="rtl">044-42341544</span>
               </div>
               <p className="">
                <span>ساعت پاسخگویی: ۸ الی ۱۷ (شنبه تا پنجشنبه)</span>
               </p>
               <div className="flex flex-row gap-1">
               <span className="font-bold">آدرس:</span>
               <p className="pr-2">
          آذربایجان غربی- مهاباد- کوی زیبا-خیابان گلستان-کوچه گلستان ۱۴-پلاک ۰.۰-طبقه اول
              </p>
              </div>
              <div className="pr-2">
              {/* <span className="font-bold">شماره موبایل:</span> */}
              {/* <p dir="ltr" className="pr-2 text-right">
                {Strings.mobileNumber}
              </p> */}
              <div className="flex flex-row justify-start items-center text-[#0ba] gap-3">
              <Link
              href={'t.me/samane_ssja'}
            >
              <Image src="/icon/telegram.png" width={24} height={24} alt="telegram"></Image>
       
            </Link> 
             <Link
              href={'instagram.com/ssja.ir?igshid=MzRlODBiNWFlZA=='}


            >
              <Image src="/icon/instagram.png" width={24} height={24} alt="instagram"></Image>
            </Link>
              
              </div>
            </div>
          </div>
          <div className="">
          
            <div className="bg-white/100 rounded-md border-2 border-[#0ba] m-2 shadow-2xl shadow-[#0ba] border-spacing-8">
            <Link 
            target="_blank"
            referrerPolicy='origin'
            href={'https://trustseal.enamad.ir/?id=272685&Code=mpSx0xjRfdtYxeZVHICW'}>
            
        
       
              <Image 
               width={75}
               height={75}
               loading="lazy"
                src={"/image/namad.png"}
               alt='enamad'>
             
                </Image> 
                  </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
