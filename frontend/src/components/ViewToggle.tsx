import { Check, LayoutGrid, Rows4 } from 'lucide-react';
import React, { useEffect } from 'react';

interface ViewToggleProps {
  showGallery: boolean;
  setShowGallery: (value: boolean) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ showGallery, setShowGallery }) => {
  // On mount, retrieve view state from localStorage
  useEffect(() => {
    const storedView = localStorage.getItem('viewState');
    if (storedView !== null) {
      setShowGallery(storedView === 'true');
    }
  }, []);

  // When showGallery updates, persist change in localStorage
  useEffect(() => {
    localStorage.setItem('viewState', String(showGallery));
  }, [showGallery]);

  return (
    <div className="flex border rounded-lg overflow-hidden m-2">
      <button
        onClick={() => setShowGallery(true)}
        className={`flex-1 py-2 px-4 flex items-center justify-center transition-colors duration-300 ease-in-out ${showGallery ? 'bg-primary text-black' : 'bg-secondary text-white'}`}
      >
        <span className="mr-2"><LayoutGrid/> </span>
        {showGallery && <span><Check/></span>}
      </button>
      <button
        onClick={() => setShowGallery(false)}
        className={`flex-1 py-2 px-4 flex items-center justify-center transition-colors duration-300 ease-in-out ${!showGallery ? 'bg-primary text-black' : 'bg-secondary text-white'}`}
      >
        <span className="mr-2"><Rows4/></span>
        {!showGallery && <span><Check/></span>}
      </button>
    </div>
  );
};

export default ViewToggle;
