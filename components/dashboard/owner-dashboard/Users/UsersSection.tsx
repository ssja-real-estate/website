import React, { FC, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Strings from "../../../../data/strings";
import AdminList from "./AdminList/AdminList";
import AgentList from "./AgentList/AgentList";
import OwnerList from "./OwnerList/OwnerList";
import UsersList from "./UsersLists/UsersList";

const UsersSection: FC = () => {
  const [indexTab, setIndexTab] = useState<number>(0);
  const selectTabIndex = (i: number) => {
    setIndexTab(i);
  };
  return (
    <Tabs
      className="flex flex-row w-full"
      onSelect={(index) => selectTabIndex(index)}
    >
      <TabList className="flex flex-col gap-[2px] overflow-hidden  w-32 text-center">
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 0
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.owners}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 1
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.admins}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 2
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.agents}
        </Tab>
        <Tab
          className={`cursor-pointer p-2 text-sm transition-all duration-150 focus-visible:outline-none ${
            indexTab === 3
              ? "bg-[#0ba] text-white"
              : "text-gray-500 bg-[#f6f6f6] hover:bg-[#0ba]/10"
          }`}
        >
          {Strings.users}
        </Tab>
      </TabList>
      <div className="flex-1 p-2 h-full">
        <TabPanel>
          <OwnerList />
        </TabPanel>
        <TabPanel>
          <AdminList />
        </TabPanel>
        <TabPanel>
          <AgentList />
        </TabPanel>
        <TabPanel>
          <UsersList />
        </TabPanel>
      </div>
    </Tabs>
  );
};

export default UsersSection;
