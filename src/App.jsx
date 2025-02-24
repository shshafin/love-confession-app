import { useState, useRef, useEffect } from "react";

export default function App() {
  const [yesClicked, setYesClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef(null);
  const noButtonRef = useRef(null);

  // Initially both buttons are aligned
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Handle the loading state when Yes is clicked
  const handleYesClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setYesClicked(true);
    }, 3000); // 3 second delay
  };

  // For touch devices, move button on any touch near it
  useEffect(() => {
    if (!isTouchDevice || !containerRef.current || !noButtonRef.current) return;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const noButton = noButtonRef.current.getBoundingClientRect();
      // const container = containerRef.current.getBoundingClientRect();

      // Calculate distance from touch to button
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      const buttonCenterX = noButton.left + noButton.width / 2;
      const buttonCenterY = noButton.top + noButton.height / 2;

      // Calculate distance (squared)
      const distanceSquared =
        Math.pow(touchX - buttonCenterX, 2) +
        Math.pow(touchY - buttonCenterY, 2);

      // Move button if touch is within 150px
      if (distanceSquared < 22500) {
        // 150²
        moveButtonToOpposite(touchX, touchY);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
    return () => document.removeEventListener("touchmove", handleTouchMove);
  }, [isTouchDevice]);

  const moveButtonToOpposite = (x, y) => {
    if (!containerRef.current) return;

    // Get container dimensions
    const container = containerRef.current.getBoundingClientRect();

    // Move button to the opposite side of the container
    let newX, newY;

    // If touch is on left half, move to right half and vice versa
    if (x < container.left + container.width / 2) {
      newX = Math.floor(Math.random() * 40 + 60); // 60-100%
    } else {
      newX = Math.floor(Math.random() * 40); // 0-40%
    }

    // If touch is on top half, move to bottom half and vice versa
    if (y < container.top + container.height / 2) {
      newY = Math.floor(Math.random() * 40 + 60); // 60-100%
    } else {
      newY = Math.floor(Math.random() * 40); // 0-40%
    }

    setNoPosition({ top: newY, left: newX });
    setNoAttempts(noAttempts + 1);
  };

  const moveNoButton = (e) => {
    if (!containerRef.current) return;
    moveButtonToOpposite(e.clientX, e.clientY);
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
          <h2 className="text-xl text-black font-bold mb-6">
            Do you love me? 💖
          </h2>

          <div className="flex justify-center items-center gap-4 h-20 relative">
            <button
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border-2 border-white"
              onClick={handleYesClick}>
              ❤ Yes ❤
            </button>

            <button
              ref={noButtonRef}
              className="bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-2xl absolute transform transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-red-300"
              style={{
                // Initially aligned with "Yes" button
                top: noAttempts === 0 ? "0" : `${noPosition.top}%`,
                left: noAttempts === 0 ? "0" : `${noPosition.left}%`,
                transform: noAttempts === 0 ? "none" : "translate(-50%, -50%)",
                transition: "all 0.3s ease",
                zIndex: 10,
              }}
              onMouseEnter={moveNoButton}
              onTouchStart={(e) => {
                e.preventDefault();
                moveButtonToOpposite(
                  e.touches[0].clientX,
                  e.touches[0].clientY
                );
              }}>
              No ❌
            </button>
          </div>

          {noAttempts > 3 && (
            <p className="text-sm text-pink-500 mt-4 italic">
              {isTouchDevice
                ? "You can't catch the No button! Just say Yes already! 😏"
                : "Stop trying to say no! Destiny has other plans. 😏"}
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
