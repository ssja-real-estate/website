import City from './City';

interface Province {
  id: string;
  name: string;
  cites: City[];
}

export default Province;
