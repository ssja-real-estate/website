import type { NextPage } from "next";
import Head from "next/head";
import { useRecoilState, useRecoilValue } from "recoil";
import CarsoulSlider from "../components/home/CarsoulSlider/CarsoulSlider";

import MortgageRentSale from "../components/home/mortgage-rent-sale/MortgageRentSale";
import Ourmoto from "../components/our-moto/Ourmoto";
import Strings from "../data/strings";
import { globalState } from "../global/states/globalStates";

const Home: NextPage = () => {
  const state = useRecoilValue(globalState);
  return (
    <html lang="fa-IR">
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
      {state.loggedIn && <MortgageRentSale />}

      {/* <Header />
      <main className="bg-red-400"></main> */}
    </html>
  );
};

export default Home;
