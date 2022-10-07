import { EstateForm } from "./EstateForm";

export interface SearchFilterHeader {
  assignmentTypeId?: string;
  estateTypeId?: string;
  provinceId?: string;
  cityId?: string;
  neighbordhoodId?: string;
}

interface SearchFilter {
  header?: SearchFilterHeader;
  form?: EstateForm;
}

export default SearchFilter;
