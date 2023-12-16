const LawDashboard=() => {
   const submitForm=(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget);
      

      
   }
    return (
        <>
           <h1>اضافه کردن قوانین املاک</h1>
           <hr className="mt-4 p-4" />
           <form className="flex flex-col" onSubmit={submitForm}>

             <label htmlFor="titileid">عنوان فایل</label>
             <input className="text-xl px-2 border " name="title" type="text" id="titleid" />
             <br/>
             <label htmlFor="fileid">انتخاب فایل</label>
             <input className="p-2" type="file"  name="document"/>
             <br />
             <button className="border px-6 py-2 w-32 rounded bg-blue-400" type="submit"> <span>ذخیره</span></button>
           </form>

        </>
    )
}
export default LawDashboard