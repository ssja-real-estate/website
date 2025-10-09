import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react";
import DocumentService from "../../../services/api/DocumentService/DocumentService";
import { Document } from "../../../global/types/document";
import * as MdIcon from "react-icons/md";
import Select from "../../formcomponent/Select";
import GlobalState from "../../../global/states/GlobalState";

const LawDashboard=() => {

   const state = useRecoilValue<GlobalState>(globalState);
   const [doctype,setDoctype]=useState(1)
   const[documents,setDocuments]=useState<Document[]>([])
   const documentService=useRef( new DocumentService())

  const onchange=(e:ChangeEvent<HTMLSelectElement> ) => {

    setDoctype(Number(e.target.value))
  
  }
   const submitForm=async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget);
     

      formData.append("document",JSON.stringify({
         "title":formData.get("title"),
         "type":doctype
      }))

     let response=await documentService.current.createForm(formData);
      
      if (response) {
       getDocs();
      } 
      
   }
   const getDocs=async() => {
      documentService.current.getDocument().then((value:Document[]) => {
        setDocuments(value.filter((item)=>item.type==doctype));
       
    })
   }

   const deletedoc=(id:string) => {
  
      documentService.current.deleteDocument(id).then(()=>{
         getDocs();
      })
   }
   useEffect(()=>{

      documentService.current.setToken(state.token)
      getDocs();
   },[doctype])
    return (
        <>
         
            <select onChange={onchange} className="w-1/2" >
                <option value={1}>
                    قوانین املاک
                </option>
                <option value={2}>
                   نمونه قراردادها
                </option>
            </select>
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