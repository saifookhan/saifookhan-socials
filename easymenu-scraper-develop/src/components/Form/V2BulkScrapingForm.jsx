import { Form, Checkbox, Button } from "antd";
import { imageMode } from "./scraperFormConfig";
import { fetchBulkDataAndProcess } from "./_V2BulkHelpers";
import { cleanUrl } from "../../utils/scraper/_scraperHelpers";
import TextArea from "antd/es/input/TextArea";
import BulkStatusTable from "../bulkStatusTable";
import { useState } from "react";

export default function V2BulkScrapingForm() {
  const [form] = Form.useForm();
  const [successArray, setSuccessArray] = useState([]);

  const handleFinish = async (values) => {
    console.log("Form values:", values);

    try {
      console.log("Array Data:", values.arrayData);

      const result = await fetchBulkDataAndProcess(cleanUrl(values.arrayData));
      setSuccessArray(result);
      console.log("Updated successArray:", result);
    } catch (error) {
      console.error("Error fetching or processing external data:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "auto" }}
    >
      {/* External Menu Link */}
      <Form.Item
        label="Enter Comma Separated Delivery URLs"
        name="arrayData"
        style={{ width: "100%" }}
        rules={[{ required: false }]}
      >
        <TextArea
          rows={7}
          placeholder="glovoapp.com/asdasd,
          deliveroo.it/asdasd"
        />
      </Form.Item>

      {/* Images */}
      <Form.Item label="Images mode" name="images" rules={[{ required: true }]}>
        <Checkbox.Group>
          {imageMode.map((mode, index) => {
            if (index === 1) {
              return (
                <Checkbox value={mode.value} key={mode.value}>
                  {mode.label}
                </Checkbox>
              );
            }
          })}
        </Checkbox.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      {/* Table */}
      <BulkStatusTable data={successArray} />
    </Form>
  );
}

