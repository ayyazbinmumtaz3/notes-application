import { Pin, PinOff, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    <div className="border rounded-md p-4 bg-[#f8f9fa] hover:border-slate-300 hover:shadow-xl transition-all ease-in-out">
      <div className="flex justify-between gap-2">
        <div className="basis-full cursor-pointer" onClick={onEdit}>
          <h6 className="text-base font-medium line-clamp-1 max-w-xs">
            {title}
          </h6>
          <p className="text-[11px] text-slate-400">Created {date}</p>
          <div className="text-sm text-slate-700 mt-2 overflow-hidden">
            <ReactMarkdown className="line-clamp-5 max-w-xs">
              {content}
            </ReactMarkdown>
          </div>
          <div className="flex text-xs gap-1 mt-2 text-slate-500 flex-wrap">
            {tags.map((item) => (
              <span key={item} className="tag">
                #{item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          {isPinned ? (
            <Pin
              size={24}
              className={`icon-btn ${
                isPinned ? "text-primary" : "text-slate-300"
              }`}
              onClick={onPinNote}
              aria-label={isPinned ? "Unpin note" : "Pin note"}
            />
          ) : (
            <PinOff
              size={24}
              className={`icon-btn ${
                isPinned ? "text-primary" : "text-slate-300"
              }`}
              onClick={onPinNote}
              aria-label={isPinned ? "Unpin note" : "Pin note"}
            />
          )}

          <Trash2
            className="icon-btn hover:text-gray-500"
            onClick={onDelete}
            aria-label="Delete note"
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
