"use client";

import React from "react";
import { ConfigProvider, Typography } from "antd";
import theme from "../themeConfig";

const { Title, Text } = Typography;

const HomePage = () => {
  return (
    <ConfigProvider theme={theme}>
      <div>
        <Title>Welcome to Easymenu Spia 🕵️</Title>
        <Text italic>
          Spia is an automation tool for the sales team to create menus
          automatically.
        </Text>
        <Title level={5}>What can we do?</Title>
        <Text>
          Fetch data from the following providers:
          <ul>
            <li>JustEat: </li>
            <ul>
              <li>Easiest. Takes the least time.</li>
              <li>Gets the logo, cover image, items and resturant info</li>
              <li>Doesnt have product photos</li>
            </ul>
            <li>Glovo: </li>
            <ul>
              <li>Gets the logo, cover image, items and resturant info</li>
              <li>Has product photos</li>
              <li>Might fail sometimes</li>
            </ul>
            <li>Deliveroo: </li>
            <ul>
              <li>Gets the cover image, items and resturant info</li>
              <li>Doesnt have resturant logo and item images</li>
              <li>Can only run on local machine.</li>
            </ul>
            <li>Cocai Express: </li>
            <ul>
              <li>
                Gets the logo, cover image, items, items images and resturant
                info
              </li>
            </ul>
          </ul>
        </Text>
        <Title level={5}>Whats next?</Title>
        <Text>
          <ul>
            <li>Generate missing images with chatgpt</li>
          </ul>
        </Text>
        <Title level={5}>For developers:</Title>
        <Text>Use this endpoint to get the data: </Text>{" "}
        <Text code>/api/resturant?id=175</Text>
        <div> </div>
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
