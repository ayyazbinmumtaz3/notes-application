import "quill/dist/quill.snow.css";
import React from "react";
import { useQuill } from "react-quilljs";

const TextEditor = ({ value }) => {
  const theme = "snow";

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const placeholder = "Type your note here...";

  const { quillRef } = useQuill({ theme, modules, placeholder });

  return (
    <div style={{ width: 500, height: 300, border: "1px solid lightgray" }}>
      <div ref={quillRef} />
    </div>
  );
};

export default TextEditor;
