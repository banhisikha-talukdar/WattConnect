import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const NewApplicationButton = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleTextClick = () => {
    navigate('/new-application', { state: { from: '/customer/dashboard' } });
  };

  const handleChevronClick = (e) => {
    e.stopPropagation(); // Prevent parent button click
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`fixed top-1/2 right-0 transform -translate-y-1/2 flex items-center bg-gradient-to-r from-[#3360ab] to-[#84a4da] text-white hover:text-black shadow-lg rounded-l-full transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'px-4 py-2' : 'px-2 py-2'}
        ${isOpen ? 'w-auto' : 'w-[50px]'}`}
    >
      {isOpen && (
        <button
          onClick={handleTextClick}
          className="mr-2 whitespace-nowrap focus:outline-none"
        >
          New Application
        </button>
      )}
      <button onClick={handleChevronClick} className="focus:outline-none">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default NewApplicationButton;
