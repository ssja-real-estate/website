import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import { useEffect, useRef, useState } from "react";
import DocumentService from "../../../services/api/DocumentService/DocumentService";
import { Document } from "../../../global/types/document";
import * as MdIcon from "react-icons/md";

const LawDashboard=() => {

   const state = useRecoilValue(globalState);
   const[documents,setDocuments]=useState<Document[]>([])
   const documentService=useRef( new DocumentService())
   const submitForm=async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget);
     

      formData.append("document",JSON.stringify({
         "title":formData.get("title")
      }))

     let response=await documentService.current.createForm(formData);
      
      if (response) {
       getDocs();
      } 
      
   }
   const getDocs=async() => {
      documentService.current.getDocument().then((value:Document[]) => {
         setDocuments(value);
       
    })
   }

   const deletedoc=(id:string) => {
      console.log(id)
      documentService.current.deleteDocument(id).then(()=>{
         getDocs();
      })
   }
   useEffect(()=>{

      documentService.current.setToken(state.token)
      getDocs();
   },[])
    return (
        <>
           <h1>اضافه کردن قوانین املاک</h1>
           <hr className="mt-4 p-4" />
           <form className="flex flex-row items-center gap-3" onSubmit={submitForm}>

             <label htmlFor="titileid">عنوان فایل</label>
             <input className="text-xl px-2 border " name="title" type="text" id="titleid" />
             <br/>
             <label htmlFor="fileid">انتخاب فایل</label>
             <input className="p-2" type="file" accept=".pdf"  name="document" />
             <br />
             <button className="border px-6 py-2 w-32 rounded bg-blue-400" type="submit"> <span>ذخیره</span></button>
           </form>
           

<div className="relative overflow-x-auto shadow-md mt-4 sm:rounded-lg">
    <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                   ردیف
                </th>
                <th scope="col" className="px-6 py-3">
                    عنوان
                </th>
                <th scope="col" className="px-6 py-3">
                    نام فایل
                </th>
                <th scope="col" className="px-6 py-3">
                    حذف
                </th>
              
            </tr>
        </thead>
        <tbody>

            {
               documents.map((item:Document,index:number)=>
               <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
               <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index+1}
               </th>
               <td className="px-6 py-4">
                   {item.title}
               </td>
               <td className="px-6 py-4">
                   {item.path}
               </td>
               
               <td className="px-6 py-4">
                   
  
                   <MdIcon.MdOutlineRemove onClick={()=>deletedoc(item.id)} className="text-white hover:cursor-pointer bg-slate-400 rounded-full hover:text-red-600" />
                  
               </td>
           </tr>
               )
            }
            
                   
        </tbody>
    </table>
</div>


        </>
    )
}
export default LawDashboard