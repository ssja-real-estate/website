

interface Document {
   id:string,
   title:string,
   path:string,
   type:number,
}
const defaultDocument:Document= {
    id:"",
    title:"",
    path:"",
    type:1,
}
export type {Document}
export {defaultDocument}