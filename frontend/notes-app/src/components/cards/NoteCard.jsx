import { PushPin, TrashBin } from "../../assets/icons";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onDelete,
  onPinNote,
  onEdit,
}) => {
  return (
    <div className="border rounded-md p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex justify-between gap-2">
        <div className="basis-full cursor-pointer" onClick={onEdit}>
          <h6 className="text-base font-medium">{title}</h6>
          <p className="text-[11px] text-slate-400">{date}</p>

          <p className="text-sm text-slate-700 mt-2 line-clamp-3">{content}</p>

          <div className="flex text-xs gap-1 text-slate-500">
            {tags.map((item) => (
              <p key={item}>#{item}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <PushPin
            size={24}
            className={`icon-btn ${
              isPinned ? "text-primary" : "text-slate-300"
            }`}
            onClick={onPinNote}
          />
          <TrashBin
            className="icon-btn  hover:text-gray-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
