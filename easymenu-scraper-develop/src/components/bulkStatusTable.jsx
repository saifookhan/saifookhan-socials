import { Table, Tag } from "antd";

export default function BulkStatusTable({ data }) {
  const columns = [
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status ? "green" : "red"; // Set green for success, red for failed
        return <Tag color={color}>{status ? "Success" : "Failed"}</Tag>;
      },
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="url" />;
}
