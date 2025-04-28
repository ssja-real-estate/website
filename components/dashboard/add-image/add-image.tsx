import { useRecoilValue } from "recoil";
import { globalState } from "../../../global/states/globalStates";
import { useEffect, useRef, useState } from "react";
import SliderService from "../../../services/api/SliderService/SliderService";
import { Slider } from "../../../global/types/slider";
import * as MdIcon from "react-icons/md";
import Image  from "next/image";
import { baseApiUrl } from "mapbox-gl";
import BaseService from "../../../services/api/BaseService";


const SliderDashboard=() => {

   const state = useRecoilValue(globalState);
  
   const[sliders,setSliders]=useState<Slider[]>([])
   const sliderService=useRef( new SliderService())

 
   const submitForm=async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"][name="slider"]') as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("لطفاً یک فایل انتخاب کنید");
      return;
    }
  
    const file = fileInput.files[0];
  
    const formData = new FormData();
    formData.append('slider', file); 
    
     
      let response=await sliderService.current.createForm(formData)
  
      if (response) {
       getSliders();
      } else {
        alert("error");
        alert(response);
      } 
      
   }
   const getSliders=async() => {
      sliderService.current.getSlider().then((value:Slider[]) => {
        setSliders(value);
       
    })
   }

   const deleteSlider=(id:string) => {
  
      sliderService.current.deleteSlider(id).then(()=>{
         getSliders();
      })
   }
   useEffect(()=>{

      sliderService.current.setToken(state.token)
      getSliders();
   },[])
    return (
        <>
         
          
           <hr className="mt-4 p-4" />
           <form className="flex flex-row items-center gap-3" onSubmit={submitForm}>

           
             <label htmlFor="fileid">انتخاب عکس</label>
             <input className="p-2" type="file" accept=".jpg"  name="slider" />
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
                  عکس
                </th>
                <th scope="col" className="px-6 py-3">
                    حذف
                </th>
              
            </tr>
        </thead>
        <tbody>

            {
               sliders.map((item:Slider,index:number)=>
               <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
               <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index+1}
               </th>
              
               <td className="px-6 py-4">
               <div style={{ width: '200px', height: '100px', position: 'relative' }}>
      <Image
        src={`https://ssja.ir/api/slider/${item.path}`}
        alt="عکس مشاور املاک"
        fill
        style={{ objectFit: 'cover' }}
        priority={false}
      />
    </div>
               </td>
               
               <td className="px-6 py-4">
                   
  
                   <MdIcon.MdOutlineRemove onClick={()=>deleteSlider(item.id)} className="text-white hover:cursor-pointer bg-slate-400 rounded-full hover:text-red-600" />
                  
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
export default SliderDashboard