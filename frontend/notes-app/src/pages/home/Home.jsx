import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { AddButton } from "../../assets/icons";
import NoteCard from "../../components/cards/NoteCard";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import AddEditNote from "./AddEditNote";
import dayjs from "dayjs";

const Home = () => {
  const [OpenModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const [allNotes, setAllNotes] = useState([]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
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

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/show-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
        console.log(response.data);
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
                onEdit={() => {}}
                onDelete={() => {}}
                onPinNote={() => {}}
              />
            );
          })}
        </div>
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
