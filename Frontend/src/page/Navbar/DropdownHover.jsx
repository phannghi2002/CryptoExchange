import React, { useState, useRef } from "react";

const DropdownHover = ({ content, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutId = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutId.current);
    setIsOpen(true);
  };

  const handleMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget &&
      (dropdownRef.current === relatedTarget ||
        dropdownRef.current.contains(relatedTarget) ||
        event.currentTarget.contains(relatedTarget))
    ) {
      // Con trỏ chuột di chuyển đến phần tử dropdown hoặc phần tử cha, không đóng.
      return;
    }

    timeoutId.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Đặt thời gian trễ là 200ms (có thể điều chỉnh)
  };

  return (
    <div
      className="relative"
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer">{props.children}</div>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-0 w-40 bg-gray-800 text-white rounded-md shadow-lg"
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// ... trong mã của bạn ...
