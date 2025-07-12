import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react"; // or use any SVG icons

const NewApplicationButton = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50">
      {visible ? (
        // Visible Button with Arrow Inside
        <button
          onClick={() => setVisible(false)}
          className="flex items-center bg-gradient-to-r from-[#3360ab] to-[#84a4da] text-white hover:text-black font-medium px-5 py-3 rounded-full shadow-lg transition-transform duration-300"
        >
          <Link to="/new-application" className="mr-2">
            New Application
          </Link>
          <ChevronRight size={20} />
        </button>
      ) : (
        // Small Restore Tab
        <button
          onClick={() => setVisible(true)}
          className="flex items-center bg-white border border-gray-300 text-black p-2 rounded-full shadow hover:bg-gray-100 transition-transform duration-300"
        >
          <ChevronLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default NewApplicationButton;
