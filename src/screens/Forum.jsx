import { Route, Routes } from "react-router-dom";
import { CategoryList } from "@/components/forum/CategoryList";
import { TopicList } from "@/components/forum/TopicList";
import { CreateTopic } from "@/components/forum/CreateTopic";
import { PostList } from "@/components/forum/PostList";

export const Forum = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoryList />} />
      <Route path="/:category_id" element={<TopicList />} />
      <Route path="/:category_id/create-topic" element={<CreateTopic />} />
      <Route path="/:category_id/:topic_id" element={<PostList />} />
    </Routes>
  );
};
