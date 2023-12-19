import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import { useEffect, useRef } from "react";
import DocumentService from "../../../services/api/DocumentService/DocumentService";

const LawDashboard=() => {

   const state = useRecoilValue(globalState);
   const documentService=useRef( new DocumentService())
   const submitForm=async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget);
      console.log(formData)
      console.log(formData.get("title"))

      formData.append("document",JSON.stringify(formData.get("title")))
     let response=await documentService.current.createForm(formData);
      
      if (response) {
          console.log(response);
      }
      
   }
   useEffect(()=>{
      documentService.current.setToken(state.token)
   },[])
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