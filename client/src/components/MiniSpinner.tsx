const MiniSpinner = ({ size = "w-4 h-4", color = "border-blue-500" }) => {
  return (
    <div
      className={`${size} ${color} border-2 border-t-transparent rounded-full animate-spin`}
    ></div>
  );
};

export default MiniSpinner;
