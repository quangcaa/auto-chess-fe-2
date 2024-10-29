import React from "react";
import { Route, Routes } from "react-router-dom";
import { TopicList } from "../components/forum/TopicList";
import { CreateTopic } from "../components/forum/CreateTopic";
import { CategoryList } from "../components/forum/CategoryList";

export const Forum = () => {
  return (
  <Routes>
    <Route path="/" element={<CategoryList />} />
    <Route path="/category" element={<TopicList />} />
    <Route path="/category/create-topic" element={<CreateTopic />} />
  </Routes>
  );
};