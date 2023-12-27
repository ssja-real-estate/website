

interface Document {
   id:string,
   title:string,
   path:string
}
const defaultDocument:Document= {
    id:"",
    title:"",
    path:""
}
export type {Document}
export {defaultDocument}