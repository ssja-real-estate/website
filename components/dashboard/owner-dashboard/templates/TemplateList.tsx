import React, { FC, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Strings from "../../../../data/strings";
import CityList from "./CityList/CityList";
import DelegationTypesList from "./DelegationTypesList/DelegationTypesList";
import EstateTypesList from "./EstateTypes/EstateTypesList";
import NeighborhoodList from "./NeighborhoodList/NeighborhoodList";
import ProvinceList from "./ProvinceList/ProvinceList";
import UnitList from "./UnitList/UnitList";

const TemplateList: FC = () => {
  const [indexTab, setIndexTab] = useState<number>(0);
  const selectTabIndex = (i: number) => {
    setIndexTab(i);
  };
  return (
    <Tabs
      className="flex flex-row w-full"
      onSelect={(index) => selectTabIndex(index)}
    >
      <TabList className="flex flex-col gap-[2px] overflow-hidden rounded-lg w-32 text-center ">
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 0
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.delegationTypes}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 1
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.estateTypes}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 2
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.provinces}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 3
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.cities}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 4
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.neighborhoods}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 5
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.units}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 6
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.payments}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 7
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.forms}
        </Tab>
      </TabList>
      {indexTab === -1 ? (
        <div className=""></div>
      ) : (
        <div className="flex-1 p-2 h-full">
          <TabPanel>
            <DelegationTypesList />
          </TabPanel>
          <TabPanel>
            <EstateTypesList />
          </TabPanel>
          <TabPanel>
            <ProvinceList />
          </TabPanel>
          <TabPanel>
            <CityList />
          </TabPanel>
          <TabPanel>
            <NeighborhoodList />
          </TabPanel>
          <TabPanel>
            <UnitList />
          </TabPanel>
          <TabPanel>اشتراک ها</TabPanel>
          <TabPanel>فرمها</TabPanel>
        </div>
      )}
    </Tabs>
  );
};

export default TemplateList;
