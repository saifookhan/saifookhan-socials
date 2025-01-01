import React, { useState } from "react";
import styled from "styled-components";
import Table from "./table"; // Assuming you have a Table component to display the scraped data
import supabase from "../db/supabase";

const Cover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  color: black;
  padding: 10px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const FormInput = () => {
  const [url, setUrl] = useState("");
  const [scrapedData, setScrapedData] = useState(null); // State to hold the scraped data
  const [error, setError] = useState(null); // State to hold any errors

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    // console.log('URL to scrape:', url);
    console.log("clicked");

    try {
      // const response = await main(url); // Call the scraping API
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      // const data = await response.json(); // Parse the JSON response
      const data = [
        {
          name: "Quetta Hotel",
          address: "g6 Islamabad",
          phone: "xxxxxxx",
          website: "www.quettahotel.com.pk",
          opening: "7am-10pm",
        },
        {
          name: "Quetta Hotel",
          address: "g6 Islamabad",
          phone: "xxxxxxx",
          website: "www.quettahotel.com.pk",
          opening: "7am-10pm",
        },
      ];

      await supabase
        .from("restaurants")
        .upsert(data)
        .then((res) => {
          console.log(res.data);
        });
      // console.log('Scraped Data:', data);
      console.log("frontend data");
      console.log(data);
      setScrapedData(data); // Store the scraped data in state
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error scraping data:", error);
      setError("Failed to scrape data. Please try again."); // Set error message
    }
  };

  return (
    <Cover>
      <Form onSubmit={handleClick}>
        <Input
          type="text"
          placeholder="Enter URL to scrape"
          value={url}
          onChange={handleChange}
        />
        <Button type="submit">Scrape</Button>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message if any */}
      {scrapedData && (
        <Table data={scrapedData} /> // Assuming you have a Table component to display the scraped data
      )}
    </Cover>
  );
};

export default FormInput;
