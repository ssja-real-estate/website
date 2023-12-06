const ImageDashboard=() => {

    return (
        <>
           <h1>اضافه کردن عکس </h1>
           <hr className="mt-4 p-4" />
           <form className="flex flex-col" action="">

             <label htmlFor="titileid"></label>
             <input className="text-xl px-2 border "  type="text" id="titleid" />
             <br/>
             <label htmlFor="fileid">انتخاب فایل</label>
             <input className="p-2" type="file" />
             <br />
             <button className="border px-6 py-2 w-32 rounded bg-blue-400" type="submit"> <span>ذخیره</span></button>
           </form>

        </>
    )
}
export default ImageDashboard