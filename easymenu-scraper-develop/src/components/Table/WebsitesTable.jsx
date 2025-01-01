import React, { useEffect, useState } from "react";
import { Table, Button, Collapse, Popconfirm, message, Tag } from "antd";
import supabase from "../../db/supabase";
import {
  getMenuStats,
  generateProductImagesByResturantId,
} from "./_tableHelpers";

const { Panel } = Collapse;

const WebsitesTable = () => {
  const [fetchedData, setFetchedData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const getData = async () => {
    console.log("Fetching data from Supabase...");
    const { data, error } = await supabase.from("restaurants").select("*");
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      const formattedData = data.map((item) => {
        if (!item) {
          console.error("Item is undefined:", item);
          return null;
        }

        const menuStats = getMenuStats(item.external_menuJson);

        return {
          id: item.id,
          name:
            item.google_resturantName ||
            item.external_resturantName ||
            "not found",
          website: item.google_website || "not found",
          phone: item.google_phone || "not found",
          address: item.google_address || "not found",
          logoUrl: item.external_logoUrl,
          coverUrl: item.google_coverPhotoUrl,
          apw: `${item.google_address && "A"} ${item.google_website && "W"} 
          ${item.google_phone && "P"}`,
          menuFrom: item._menuFetchedFrom || "not found",
          menuStatus: `Categories: ${menuStats.totalCategories}, Products: ${menuStats.totalItems}`,
          menuInJson: item.external_menuJson || {
            message: "No JSON data available",
            data: [],
          },
          description: item.google_address,
        };
      });

      const sortedData = formattedData.sort((a, b) => b.id - a.id);
      setFetchedData(sortedData);
      console.log("Fetched data:", sortedData);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRowExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.id]); // Only allow one expanded row at a time
    } else {
      setExpandedRowKeys((prev) => prev.filter((key) => key !== record.id));
    }
  };

  const renderJson = (json) => (
    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
      {JSON.stringify(json, null, 2)}
    </pre>
  );

  const deleteRestaurant = async (id) => {
    const { error } = await supabase.from("restaurants").delete().eq("id", id);
    if (error) {
      console.error("Error deleting restaurant:", error.message);
      message.error("Failed to delete restaurant.");
    } else {
      message.success("Restaurant deleted successfully.");
      getData();
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Address, Phone, Web",
      dataIndex: "apw",
      key: "apw",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Menu From",
      dataIndex: "menuFrom",
      key: "menuFrom",
      width: 100,
      ellipsis: true,
      render: (text) => (
        <Tag
          color={
            text === "justeat"
              ? "volcano"
              : text === "deliveroo"
              ? "cyan"
              : text === "cocaiexpress"
              ? "purple"
              : "yellow"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Menu Stats",
      dataIndex: "menuStatus",
      key: "menuStatus",
      width: 100,
    },
    {
      title: "JSON in New Tab",
      dataIndex: "menuInJson",
      key: "menuInJson",
      render: (text, record) => (
        <Button
          onClick={() =>
            window.open(`/api/resturant?id=${record.id}`, "_blank")
          }
        >
          Open
        </Button>
      ),
      width: 100,
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this restaurant?"
          onConfirm={() => deleteRestaurant(record.id)} // Use record.id
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
      width: 100,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={fetchedData}
      rowKey="id" // Use id as the unique row identifier
      pagination={false}
      scroll={{ x: 800 }}
      expandedRowKeys={expandedRowKeys} // Control which rows are expanded
      expandedRowRender={(record) => (
        <div style={{ padding: 10 }}>
          <p>
            <strong>Name:</strong> {record.name}
          </p>
          <p>
            <strong>Website:</strong> {record.website}
          </p>
          <p>
            <strong>Phone:</strong> {record.phone}
          </p>
          <p>
            <strong>Address:</strong> {record.address}
          </p>
          <p>
            <strong>Logo:</strong>{" "}
            {(record.logoUrl && (
              <a target="_blank" href={record.logoUrl}>
                {record.logoUrl}
              </a>
            )) ||
              "not found"}
          </p>
          <p>
            <strong>Cover Photo:</strong>{" "}
            {(record.coverUrl && (
              <a target="_blank" href={record.coverUrl}>
                {record.coverUrl}
              </a>
            )) ||
              "not found"}
          </p>
          <div className="py-2">
            {/* only show this for justEat */}
            <Button
              onClick={() => generateProductImagesByResturantId(record.id)}
            >
              Create Images using AI
            </Button>
          </div>
          <Collapse>
            <Panel header="JSON Data" key="1">
              {renderJson(record.menuInJson)}
            </Panel>
          </Collapse>
        </div>
      )}
      onExpand={handleRowExpand}
    />
  );
};

export default WebsitesTable;
