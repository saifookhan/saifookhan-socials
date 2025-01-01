"use client";
import "./App.css";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
`;

function Home() {
  return (
    <AppContainer>
      {" "}
      <p style={{ color: "black" }}>
        Work
        <a style={{ color: "blue" }} href="/home">
          {" "}
          smart
        </a>
        , not hard. 😉
      </p>
    </AppContainer>
  );
}

export default Home;
