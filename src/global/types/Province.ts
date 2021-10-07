import City from './City';

interface Province {
  id: string;
  name: string;
  cities: City[];
}

export default Province;
