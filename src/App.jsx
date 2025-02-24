import { useState, useRef } from "react";

export default function App() {
  const [yesClicked, setYesClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const containerRef = useRef(null);

  // Initially both buttons are aligned
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });

  // Handle the loading state when Yes is clicked
  const handleYesClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setYesClicked(true);
    }, 3000); // 3 second delay
  };

  const moveNoButton = (e) => {
    if (!containerRef.current) return;

    // Get container dimensions
    const container = containerRef.current.getBoundingClientRect();

    // Get current mouse position
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Move button to the opposite side of the container from mouse
    let newX, newY;

    // If mouse is on left half, move to right half and vice versa
    if (mouseX < container.left + container.width / 2) {
      newX = Math.floor(Math.random() * 40 + 60); // 60-100%
    } else {
      newX = Math.floor(Math.random() * 40); // 0-40%
    }

    // If mouse is on top half, move to bottom half and vice versa
    if (mouseY < container.top + container.height / 2) {
      newY = Math.floor(Math.random() * 40 + 60); // 60-100%
    } else {
      newY = Math.floor(Math.random() * 40); // 0-40%
    }

    setNoPosition({ top: newY, left: newX });
    setNoAttempts(noAttempts + 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100 p-4">
      {loading ? (
        // Simple loading GIF without card
        <div className="w-32 h-32 flex items-center justify-center">
          <img
            src="https://i.ibb.co.com/4ZGSjbR8/love-linz.gif"
            alt="Loading Hearts"
            className="w-full h-auto"
          />
        </div>
      ) : !yesClicked ? (
        <div
          ref={containerRef}
          className="text-center py-6 px-6 md:px-12 bg-white rounded-xl shadow-lg max-w-md w-full relative">
          <img
            src="https://i.ibb.co.com/WvS8F7hV/cute-cartoon.gif"
            alt="Cute Love"
            className="mx-auto mb-4 w-32 md:w-48 h-auto"
          />
          <h2 className="text-xl font-bold mb-6">Do you love me? 💖</h2>

          <div className="flex justify-center items-center gap-4 h-20 relative">
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border-2 border-white"
              onClick={handleYesClick}>
              ❤ Yes ❤
            </button>

            <button
              className="bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-2xl absolute transform transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-red-300"
              style={{
                // Initially aligned with "Yes" button
                top: noAttempts === 0 ? "0" : `${noPosition.top}%`,
                left: noAttempts === 0 ? "0" : `${noPosition.left}%`,
                transform: noAttempts === 0 ? "none" : "translate(-50%, -50%)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={moveNoButton}>
              No ❌
            </button>
          </div>

          {noAttempts > 3 && (
            <p className="text-sm text-pink-500 mt-4 italic">
              Stop trying to say no! Destiny has other plans. 😏
            </p>
          )}
        </div>
      ) : (
        <div className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md w-full">
          <img
            src="https://i.ibb.co.com/Z6rFd34m/cute-cat.gif"
            alt="Happy Love"
            className="mx-auto mb-4 w-32 md:w-48 h-auto"
          />
          <h2 className="text-xl font-bold text-rose-600">
            Yes! I knew it! 😍
          </h2>
          <p className="mt-4 text-gray-600">
            Thank you for making my day special!
          </p>
        </div>
      )}
    </div>
  );
}
