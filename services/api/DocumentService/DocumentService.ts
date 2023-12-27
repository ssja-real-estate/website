import { Document } from "../../../global/types/document";
import BaseService from "../BaseService";

class DocumentService extends BaseService {
  documentUrl="/document"
  
  
  createForm = async (form: FormData) => {
  
    try {
  
     let response= await this.Api.post(this.documentUrl,form,this.config);
  
     if (response.status==200) {
    
      return true;
     } 

    } catch (error: any) {
     
      this.handleError(error);
    }
  };

deleteDocument=async (id:string) => {
  try {
  let response= await this.Api.delete(this.documentUrl+`/${id}`,this.config)
   if (response.status==200) {
    return true
   }  else return false;
}
catch (error:any) {
  this.handleError(error)
}
  
}
getDocument=async ():Promise<Document[]> => {
  let documents:Document[]=[]
  try {
      let response=await this.Api.get(this.documentUrl,this.config)
       if (response.status===200) {
        documents=response.data
        return documents
       }
      
  }catch(error:any) {
    this.handleError(error)
  }
  return documents
}
}
export default DocumentService