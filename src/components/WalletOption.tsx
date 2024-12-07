import React from "react";

type WalletOptionProps = {
  img: string;
  name: string;
  onClick: () => void;
  disabled?: boolean;
  soon?: boolean;
  loading?: boolean;
};

const WalletOption: React.FC<WalletOptionProps> = ({
  img,
  name,
  onClick,
  disabled = false,
  soon = false,
  loading = false,
}) => (
  <li className="p-2">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full space-x-2 flex items-center py-2 px-5 rounded-lg transition
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-base-300"}`}
    >
      <img className="w-10" src={img} alt={name} />
      <div className="flex flex-col w-full">
        <span className="text-xl flex items-center justify-between w-full">
          {name}
          {loading ? (
            <div className="flex items-center justify-end w-full">
              <span className="loading loading-bars loading-sm"></span>
            </div>
          ) : ("")}
        </span>
        {soon && !loading && <span className="text-sm text-gray-500">Soon</span>}
      </div>
    </button>
  </li>
);

export default WalletOption;
