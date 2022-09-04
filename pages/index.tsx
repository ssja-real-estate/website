import type { NextPage } from "next";
import Head from "next/head";
import CarsoulSlider from "../components/home/CarsoulSlider/CarsoulSlider";

import MortgageRentSale from "../components/home/mortgage-rent-sale/MortgageRentSale";
import Ourmoto from "../components/our-moto/Ourmoto";
import Strings from "../data/strings";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>{Strings.sajaSystem}</title>
        <meta
          name="description"
          content={Strings.sajaHomePageDescriptionMetaTag}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CarsoulSlider />
      <Ourmoto />
      <MortgageRentSale />

      {/* <Header />
      <main className="bg-red-400"></main> */}
      <div id="portal"></div>
    </div>
  );
};

export default Home;
