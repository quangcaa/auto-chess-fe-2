import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";

import { IoArrowBackOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const CreateTopic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category_name = location.state.category_name;
  const { category_id } = useParams();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createTopic = async (category_id, subject, message) => {
    setLoading(true);
    setSuccess(false);

    const toast_id = toast.loading("Creating topic...");

    try {
      const response = await api.post(`/forum/${category_id}/create`, {
        subject,
        message,
      });
      const data = await response.data;
      if (data.success) {
        toast.success("Topic created successfully", { id: toast_id });
      } else {
        toast.error(new Error(response.data.message), { id: toast_id });
      }
      setSuccess(true);
      return data;
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createTopic(category_id, subject, message);
  };
  useEffect(() => {
    if (success) {
      navigate(`/forum/${category_id}`, { state: category_name });
    }
  }, [success, navigate, category_id, category_name]);

  return (
    <div className="flex items-center justify-center">
      <Card className="border border-gray-300 rounded-lg bg-white w-full max-w-screen-xl lg:w-[70%] h-full m-2 mb-4 shadow-lg">
        {/*</div> HEADER */}
        <CardHeader className="flex flex-row items-center gap-4 m-7 ml-10 py-4 px-0">
          <IoArrowBackOutline
            className="size-20 text-gray-800 cursor-pointer hover:text-emerald-600"
            onClick={() => navigate(-1)}
          />
          <CardTitle className="text-5xl text-gray-800">
            {category_name}
          </CardTitle>
        </CardHeader>

        <CardContent className="w-full mb-4">
          <form className="m-5 space-y-4" onSubmit={handleSubmit}>
            <p className="font-bold text-sm">Subject</p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border bg-gray-100 border-gray-300 w-full rounded-md px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-emerald-600 focus-visible:border-2 focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
            />
            <p className="font-bold text-sm">Message</p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-[200px] bg-gray-100 border-gray-300"
            />
            <div className="flex justify-end">
              <Button
                variant="default"
                size="lg"
                className="bg-emerald-600 text-white text-[15px] hover:bg-emerald-800 shadow-lg"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "CREATING..." : "CREATE THE TOPIC"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
