"use client";

import React from "react";
import { ConfigProvider } from "antd";
import theme from "../../themeConfig";
import WebsitesTable from "../../../src/components/Table/WebsitesTable";

const HomePage = () => {
  return (
    <ConfigProvider theme={theme}>
      <WebsitesTable />
    </ConfigProvider>
  );
};

export default HomePage;
