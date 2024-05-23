import { useState } from "react";
import { AddButton } from "../../assets/icons";
import NoteCard from "../../components/cards/NoteCard";
import Navbar from "../../components/navbar/Navbar";
import AddEditNote from "./AddEditNote";
import Modal from "react-modal";
const Home = () => {
  const [OpenModal, setOpenModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <NoteCard
            title="Hello World!"
            date="27 April, 2024"
            content="Hello there my name is ayyaz."
            tags="#meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
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
