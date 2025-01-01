"use client";

import React, { useState } from "react";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Home (old)", "/home", <PieChartOutlined />),
  getItem("Websites Table", "/home/list", <PieChartOutlined />),
  getItem("Submit New", "/home/submitNew", <DesktopOutlined />),
  getItem("Submit Bulk", "/home/submitBulk", <DesktopOutlined />),
  getItem("List of APIs (WIP)", "#", <DesktopOutlined />),
];
const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["/home"]}
          mode="inline"
          items={items}
          onClick={(e) => {
            console.log("redirecting to: ", e);
            window.location.href = e.key;
          }}
          //TODO:: fix the key of selected menu item
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Created by Saif & Aashir for EasyMenu Team
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
