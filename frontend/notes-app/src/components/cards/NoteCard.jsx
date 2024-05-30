import { SquarePen } from "lucide-react";
import { PushPin, TrashBin } from "../../assets/icons";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded-md p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-base font-medium">{title}</h6>
          <span className="text-[11px] text-slate-400">{date}</span>
        </div>
        <PushPin
          size={24}
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>
      <div className="max-w-[300px]">
        <p className="text-sm text-slate-700 mt-2 line-clamp-3">{content}</p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex text-xs gap-1 text-slate-500">
          {tags.map((item) => (
            <p key={item}>#{item}</p>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SquarePen
            className="icon-btn hover:text-gray-500"
            onClick={onEdit}
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
