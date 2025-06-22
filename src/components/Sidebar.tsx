import { useEffect, useState } from "react";
// import { formatData } from "../utils/format";
import { type Step } from "../types";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { URL } from "../utils/constant";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const {prompt} = location.state as {prompt:string};
  const [files, setFiles] = useState<Step[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [formatData,setFormatData] = useState<string>("")
  // const [userInput, setUserInput] = useState<string>("");

  const parseXml = async (response: string) => {
    const xmlMatch =  response.match(
      /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/
    );
    if (!xmlMatch) return;

    const xmlContent = xmlMatch[1];
    const steps: Step[] = [];
    let stepId = 1;

    const actionRegex =
      /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
      const [, type, filePath, content] = match;

      if (type === "file") {
        steps.push({
          id: stepId++,
          title: `Create ${filePath || "file"}`,
          description: "",
          status: "pending",
          code: content.trim(),
          path: filePath,
        });
      } else if (type === "shell") {
        steps.push({
          id: stepId++,
          title: "Run command",
          description: "",
          status: "pending",
          code: content.trim(),
        });
      }
    }

    setFiles(steps);
    setSelectedIndex(0); // Default to first file
  };

 useEffect(() => {
  if (formatData) {
    parseXml(formatData);
  }
}, [formatData]);

  const handlePost = async () => {
    try {
      const response = await axios.post(`${URL}/chat`, {
        messages: prompt,
      });
      console.log("Server response:", response.data.response);
      setFormatData(response.data.response);
    } catch (error) {
      console.error("Error posting to server:", error);
    }
  };

  useEffect(()=>{handlePost()},[])
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Files</h2>
        {files.map((value, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer rounded mb-1 ${
              selectedIndex === index ? "bg-blue-200" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {value.title}
          </div>
        ))}

        {/* Input and button for axios POST */}
        {/* <div className="border-2 mt-4 p-2 rounded">
          <input
            className="w-full p-1 border mb-2"
            type="text"
            placeholder="Enter your message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div
            className="border-2 w-[50%] ml-[25%] text-center text-white font-semibold py-1 bg-blue-500 hover:bg-blue-700 cursor-pointer"
            onClick={handlePost}
          >
            Send
          </div>
        </div> */}
      </div>

      {/* Code Editor */}
      <div className="w-3/4 p-4">
        {selectedIndex !== null && files[selectedIndex] ? (
          <Editor
            height="90vh"
            defaultLanguage="javascript"
            value={files[selectedIndex].code || "// No code"}
            theme="vs-dark"
            options={{
              readOnly: false,
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        ) : (
          <div className="text-gray-500 text-center mt-20">
            Select a file to view code
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
