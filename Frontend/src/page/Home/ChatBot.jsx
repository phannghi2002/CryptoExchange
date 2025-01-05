import { MessageCircle } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

function ChatBot() {
  const [isBotRealease, setIsBotRealease] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const handleBotRealease = () => setIsBotRealease(!isBotRealease);

  const [messages, setMessages] = useState([]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      // Append user's message to the messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: inputValue },
      ]);
      // Call the API with the user's input
      handleFetchCoinDetails(inputValue);
      setInputValue(""); // Clear the input
    }
  };

  const handleFetchCoinDetails = async (prompt) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:8888/api/v1/ai/chat",
        {
          prompt,
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "api", text: data.message }, // Adjust `data.response` based on your API's response structure
      ]);
      console.log("success", data);
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  return (
    <section className="absolute bottom-20 right-5 z-40 flex flex-col justify-end items-end gap-2">
      {isBotRealease && (
        <div className="rounded-md w-[20rem] md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900">
          <div className="flex justify-between items-center border-b px-6 h-[12%]">
            <p>Chat Bot</p>
            <Button onClick={handleBotRealease} variant="ghost" size="icon">
              <Cross1Icon />
            </Button>
          </div>

          <div className="flex flex-col overflow-y-auto  gap-5 px-5 h-[76%] py-2 scroll-container">
            {messages.length === 0 && (
              <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                Chào mừng đến với AI chat bot, bạn có thể đặt câu hỏi liên quan
                đến sàn giao dịch{" "}
              </div>
            )}

            {loading && <div>Tu tu tra loi cc</div>}

            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex  ${
                  message.type === "user" ? "justify-end " : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-md w-auto ${
                    message.type === "user"
                      ? "bg-blue-500 text-white max-w-[80%] "
                      : "bg-gray-200 text-black max-w-full"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[12%] border-t">
            <Input
              className="h-full w-full order-none outline-none"
              placeholder="Write promt"
              onChange={handleChange}
              value={inputValue}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      )}

      <div className="relative w-[7rem] cursor-pointer group">
        <Button
          className="w-full gap-2 items-center"
          onClick={handleBotRealease}
        >
          <MessageCircle />
          <span className="text-base">Hỗ trợ</span>
        </Button>
      </div>
    </section>
  );
}

export default ChatBot;
