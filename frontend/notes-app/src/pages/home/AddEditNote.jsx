import { useState } from "react";
import { CloseIcon } from "../../assets/icons";
import TagInput from "../../components/input/TagInput";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNote = ({ data, getAllNotes, type, onClose }) => {
  const [title, setTitle] = useState(data?.title || "");
  const [content, setContent] = useState(data?.content || "");
  const [tags, setTags] = useState(data?.tags || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // add notes
  const addNewNote = async () => {
    setIsLoading(true);
    try {
      //
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //edit notes
  const editNote = async (data) => {
    if (!data || !data._id) {
      setError("Invalid note data");
      console.log("Invalid note data");
      return;
    }
    const noteId = data._id;
    setIsLoading(true);
    try {
      //
      const response = await axiosInstance.put(`/edit-note/${noteId}`, {
        title,
        content,
        tags,
      });
      if (response.data && response.data.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError(null);

    if (type === "edit") {
      editNote(data);
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="flex w-10 h-10 rounded-full outline-none items-center justify-center -right-3 -top-3 absolute hover:bg-slate-50"
      >
        <CloseIcon className="text-xl text-slate-800" />
      </button>
      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          className="text-2xl text-slate-950 outline-none"
          type="text"
          placeholder="Add title"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          className="text-sm text-slate-950 outline-none p-2 rounded bg-slate-50"
          type="text"
          placeholder="Add content"
          rows={10}
          value={content}
          onChange={({ target }) => {
            setContent(target.value);
          }}
        />
      </div>
      <div>
        <label className="input-label">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={() => {
          handleAddNote();
        }}
        disabled={isLoading}
      >
        {type === "edit"
          ? isLoading
            ? "Updating..."
            : "Update"
          : isLoading
          ? "Adding..."
          : "Add"}
      </button>
    </div>
  );
};

export default AddEditNote;
