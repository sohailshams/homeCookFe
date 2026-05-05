import { SearchIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const PostcodeSearchBox: React.FC = () => {
  const [postcode, setPostcode] = useState("");
  const navigate = useNavigate();

  const handlePostcodeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value);
  };

  const handlePostcodeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    console.log("PostcodeSearchBox", postcode);
    localStorage.setItem("userPostcode", postcode);
    navigate(`/food-list?query=${encodeURIComponent(postcode)}`);
    setPostcode(" ");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-9/12 md:w-6/12 bg-white rounded-lg shadow-lg">
        <h1 className="font-bold md:font-semibold text-lg md:text-3xl lg:text-5xl px-4 pt-4 mb-4">
          Hungry for something homemade?
        </h1>
        <form
          onSubmit={handlePostcodeSubmit}
          className="flex items-center space-x-2 bg-white p-4 border-[1px] border-gray-300 shadow-md rounded-full mx-4"
        >
          <button type="submit">
            <SearchIcon className="h-4 text-gray-600" />
          </button>
          <input
            className="bg-transparent flex-1 outline-none"
            type="text"
            placeholder="Enter your postcode..."
            value={postcode}
            onChange={handlePostcodeInputChange}
          />
        </form>
        <p className="p-4 text-xl mb-2">
          Enter your postcode to see what's cooking nearby.
        </p>
      </div>
    </div>
  );
};

export default PostcodeSearchBox;
