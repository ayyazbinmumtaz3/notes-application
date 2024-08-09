const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-17">
      <img src={imgSrc} alt="Add a note" className="w-[130px]" />
      <p className="w-1/2 text-md font-medium text-slate-700 text-center leading-7 mt-7 select-none">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
