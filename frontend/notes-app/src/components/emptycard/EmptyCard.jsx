const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="Add a note" className="w-[150px]" />
      <p className="w-1/2 text-md font-medium text-slate-700 text-center leading-7 mt-10">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
