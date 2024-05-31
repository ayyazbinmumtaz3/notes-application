import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { AddButton } from "../../assets/icons";
import EmptyNote from "../../assets/images/EmptyNote.png";
import NoteCard from "../../components/cards/NoteCard";
import EmptyCard from "../../components/emptycard/EmptyCard";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import AddEditNote from "./AddEditNote";

const Home = () => {
  console.log("Home component render");

  const [OpenModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);

  const handleEdit = (noteDetails) => {
    setOpenModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  };

  //get user info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`/get-user`);
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // delete note

  const deleteNote = async (data) => {
    if (!data || !data._id) {
      console.log("Invalid note data");
      return;
    }
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-note/${noteId}`);
      if (response.data && !response.data.error) {
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error);
      }
    }
  };

  // get all notes

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get(`/show-all-notes`);
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {allNotes.map((item) => {
              return (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={dayjs(item.createdAt).format("DD MMM YYYY")}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => {}}
                />
              );
            })}
          </div>
        ) : (
          <EmptyCard
            imgSrc={EmptyNote}
            message={`Start creating your first note! Click the 'Add' button to note down your thoughts, ideas, and reminders. Let's get started!`}
          />
        )}
      </div>
      <button
        className="flex w-14 h-14 rounded-2xl text-white bg-primary hover:bg-blue-400 items-center justify-center absolute right-10 bottom-10 hover:shadow-lg"
        onClick={() => {
          setOpenModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <AddButton />
      </button>
      <Modal
        isOpen={OpenModal.isShown}
        onRequestClose={() => {}}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-16 p-5 overflow-auto"
        appElement={document.getElementById("root")}
      >
        <AddEditNote
          getAllNotes={getAllNotes}
          type={OpenModal.type}
          data={OpenModal.data}
          onClose={() =>
            setOpenModal({ isShown: false, type: "add", data: null })
          }
        />
      </Modal>
    </>
  );
};

export default Home;
