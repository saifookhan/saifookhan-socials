"use client";

import React from "react";
import { ConfigProvider } from "antd";
import theme from "../../themeConfig";
import V2ScrapingForm from "../../../src/components/Form/V2ScrapingForm";

const HomePage = () => {
  return (
    <ConfigProvider theme={theme}>
      <div>
        <V2ScrapingForm />
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
