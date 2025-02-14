import dayjs from "dayjs";
import { useCallback, useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { AddButton } from "../../assets/icons";
import EmptyNote from "../../assets/images/EmptyNote.png";
import Skeleton from "../../assets/images/loadingSkeleton.gif";
import AnimationComponent from "../../components/animations/AnimationComponent";
import NoteCard from "../../components/cards/NoteCard";
import EmptyCard from "../../components/emptycard/EmptyCard";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import AddEditNote from "./AddEditNote";
import SlingshotGame from "../../components/animations/SlingshotGame";

const Home = () => {
  const [OpenEditModal, setOpenEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = useCallback((noteDetails) => {
    setOpenEditModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  //get user info

  const getUserInfo = useCallback(async () => {
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
    } finally {
      setLoading(false);
    }
  }, []);

  // delete note

  const deleteNote = useCallback(async (data) => {
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
  }, []);

  // get all notes

  const getAllNotes = useCallback(async (query = null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/get-all-notes`, {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIsPinned = useCallback(async (data) => {
    if (!data || !data._id) return;
    const noteId = data._id;
    try {
      const response = await axiosInstance.put(`/edit-note-pinned/${noteId}`, {
        isPinned: !data.isPinned,
      });
      if (response.data && response.data.note) {
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  const handleCloseModal = () => {
    setOpenEditModal({ isShown: false, type: "add", data: null });
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNotes={getAllNotes}
        className="relative"
      />
      <div className="container md:px-4 mx-auto my-6">
        {loading ? (
          <div className="flex justify-center my-40">
            <img src={Skeleton} alt="Skeleton" className="" />
          </div>
        ) : allNotes.length > 0 ? (
          <>
            <h4 className="text-2xl font-medium text-gray-700 mt-6 mb-2">
              Pinned Notes
            </h4>
            <hr />
            <div className="grid grid-cols-3 gap-4 mt-8">
              {allNotes
                .filter((note) => note.isPinned)
                .map((item) => (
                  <NoteCard
                    key={item._id}
                    title={item.title}
                    date={dayjs(item.createdAt).format("MMMM D, YYYY h:mm A")}
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => deleteNote(item)}
                    onPinNote={() => updateIsPinned(item)}
                  />
                ))}
            </div>
            <h4 className="text-2xl font-medium text-gray-700 mt-6 mb-2">
              Notes
            </h4>
            <hr />
            <div className="grid grid-cols-3 gap-4 mt-8">
              {allNotes
                .filter((note) => note.isPinned === false)
                .map((item) => (
                  <NoteCard
                    key={item._id}
                    title={item.title}
                    date={dayjs(item.createdAt).format(`MMMM D, YYYY h:mm A`)}
                    content={item.content}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => deleteNote(item)}
                    onPinNote={() => updateIsPinned(item)}
                  />
                ))}
            </div>
          </>
        ) : (
          <>
            <EmptyCard
              imgSrc={EmptyNote}
              message={`Start creating your first note! Click the 'Add' button to note down your thoughts, ideas, and reminders. Let's get started!`}
            />
            {/* <AnimationComponent /> */}
          </>
        )}
      </div>

      <button
        className="flex w-14 h-14 rounded-2xl text-white bg-primary hover:bg-blue-400 items-center justify-center right-10 bottom-10 fixed hover:shadow-lg z-10"
        onClick={() => {
          setOpenEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <AddButton />
      </button>

      <Modal
        isOpen={OpenEditModal.isShown}
        onRequestClose={handleCloseModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.3)" },
        }}
        className="w-[70%] max-h-[80dvh] bg-white rounded-md mx-auto mt-20 p-5 overflow-auto outline-none relative"
        appElement={document.getElementById("root")}
      >
        <div ref={modalRef}>
          <AddEditNote
            getAllNotes={getAllNotes}
            type={OpenEditModal.type}
            data={OpenEditModal.data}
            onClose={handleCloseModal}
          />
        </div>
      </Modal>
    </>
  );
};

export default Home;
