const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[300px] bg-white">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-2 border-blue-500 border-dashed rounded-full animate-spin-slow"></div>
        <span className="absolute text-blue-500">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
