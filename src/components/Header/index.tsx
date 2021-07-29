import React from "react";
import { Header } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import "./index.scss";

export const HeaderApp = () => {
  return (
    <>
      <Header>
        <Title className="title-header">Memory Game</Title>
      </Header>
    </>
  );
};
