function ContextMenu({ x, y, options, onClose, id, txt }) {
  const handleMenuClick = (action) => {
    action(id, txt);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
      className="w-32 rounded border border-gray-400 bg-white shadow-lg z-[100000]"
    >
      <ul className="list-none p-1 m-0 divide-y divide-gray-100">
        {options.map((option, index) => (
          <li
            key={index}
            className="flex gap-4 p-1 hover:bg-gray-200 cursor-pointer"
            onClick={() => handleMenuClick(option.action)}
          >
            {option.icon && (
              <span className="flex items-center justify-center w-6 h-6">
                {option.icon}
              </span>
            )}
            <span className="flex-1 text-sm text-black">{option.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
