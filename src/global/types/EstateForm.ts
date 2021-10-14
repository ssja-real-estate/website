import Section from './Section';

interface EstateForm {
  id?: string;
  sections: Section[];
}

const defaultForm: EstateForm = {
  id: '',
  sections: [],
};

export type { EstateForm };
export { defaultForm };
