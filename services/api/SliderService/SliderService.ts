import { Slider } from "../../../global/types/slider";
import BaseService from "../BaseService";

class SliderService extends BaseService {
  sliderUrl="/slider"
  
  
  createForm = async (form: FormData) => {
  
    try {
   
     let response= await this.Api.postForm(this.sliderUrl,form,this.config);
  
     if (response.status==200) {
    
      return true;
     } 

    } catch (error: any) {
        console.log(error);
   
      this.handleError(error);
    }
  };

deleteSlider=async (id:string) => {
  try {
  let response= await this.Api.delete(this.sliderUrl+`/${id}`,this.config)
   if (response.status==200) {
    return true
   }  else return false;
}
catch (error:any) {
  this.handleError(error)
}
  
}
getSlider=async ():Promise<Slider[]> => {
  let sliders:Slider[]=[]
  try {
      let response=await this.Api.get(this.sliderUrl)
       if (response.status===200) {
        sliders=response.data
        return sliders
       }
      
  }catch(error:any) {
    this.handleError(error)
  }
  return sliders
}
}
export default SliderService