"use client";

import { Form, Input, Select, Checkbox, Button } from "antd";
import { scrapeSource, scrapeMode, imageMode } from "./scraperFormConfig";
import { useState } from "react";

import {
  fetchFromExternalUrlAndStoreInDb,
  cleanUrl,
} from "../../utils/scraper/_scraperHelpers";

export default function V2ScrapingForm() {
  const [form] = Form.useForm();
  const [onlyExternal, setOnlyExternal] = useState(false);

  const handleFinish = async (values) => {
    console.log("Form values:", values);

    if (values.options.includes("4-only-external")) {
      try {
        console.log("External Link:", values.externalMenuLink);

        const result = await fetchFromExternalUrlAndStoreInDb(
          cleanUrl(values.externalMenuLink)
        );
        var data;
        if(result){
         data = await fetch(
           `http://localhost:3000/api/objectBasedImage?q=${JSON.stringify(
             result.external_menuJson
           )}`
         );
        }

        console.log("images data", data);
        console.log("Fetched Result:", result);

        if (!result || !result.external_menuJson) {
          console.error("Error: Missing result or external_menuJson");
          return;
        }
      } catch (error) {
        console.error("Error fetching or processing external data:", error);
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "auto" }}
    >
      {/* Steps */}
      <Form.Item
        label="Which steps to do?"
        name="options"
        rules={[{ required: true }]}
      >
        <Checkbox.Group>
          {scrapeMode.map((mode) => (
            <Checkbox
              value={mode.value}
              key={mode.value}
              onClick={() => setOnlyExternal(!onlyExternal)}
            >
              {mode.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Form.Item>

      {onlyExternal !== true && (
        <Form.Item
          label="Google Maps Link"
          name="googleMapsLink"
          rules={[{ required: false }]}
        >
          <Input placeholder="E.g. maps.com/asdasd" />
        </Form.Item>
      )}

      {/* External Menu Link */}
      <Form.Item
        label="External Menu Link"
        name="externalMenuLink"
        rules={[{ required: false }]}
      >
        <Input placeholder="E.g. glovoapp.com/asdasd" />
      </Form.Item>

      {/* Mode */}
      {onlyExternal !== true && (
        <Form.Item
          label="Mode"
          name="mode"
          rules={[{ required: true, message: "Please select a mode!" }]}
        >
          <Select placeholder="Select a mode" options={scrapeSource} />
        </Form.Item>
      )}

      {/* Images */}
      <Form.Item label="Images mode" name="images" rules={[{ required: true }]}>
        <Checkbox.Group>
          {imageMode.map((mode) => (
            <>
              <Checkbox value={mode.value} key={mode.value}>
                {mode.label}
              </Checkbox>
              <br />
            </>
          ))}
        </Checkbox.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
