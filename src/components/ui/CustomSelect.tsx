import React, { useState, useEffect, useRef } from "react";

interface CustomSelectProps {
  type: string;
  formData: any;
  setFormData: Function;
  responsibilities: {
    length: any;
    nonCompulsory: {
      deputyId: number;
      deputyName: string;
    }[];
    functions: {
      funcId: number;
      funcName: string;
    }[];
  };
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  type,
  formData,
  setFormData,
  responsibilities,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFunctions = responsibilities?.functions?.filter((func) =>
    func.funcName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNonCompulsory = responsibilities?.nonCompulsory?.filter(
    (duty) => duty.deputyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabel =
    type === "main"
      ? responsibilities?.functions?.find(
          (func) => func.funcId === formData.func_id
        )?.funcName || "Выберите обязанность"
      : responsibilities?.nonCompulsory?.find(
          (duty) => duty.deputyId === formData.deputy_id
        )?.deputyName || "Выберите обязанность";

  const handleSelect = (id: number) => {
    if (type === "main") {
      setFormData({ ...formData, func_id: id });
    } else {
      setFormData((prev: any) => ({ ...prev, deputy_id: id }));
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-4 py-2.5 border border-gray-700 text-gray-100 text-left 
          focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 transition-colors duration-200
          flex justify-between items-center rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 shadow-lg 
            max-h-80 overflow-y-auto rounded-xl"
          role="list -xl"
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-500 text-gray-100 
                focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 rounded-xl"
              aria-label="Search options"
            />
          </div>
          <div
            className={`p-2 ${
              type === "main" ? "bg-red-600/20" : "bg-green-900/20"
            } rounded-b-xl`}
          >
            <div className="text-gray-300 text-sm font-medium px-3 py-1">
              {type === "main"
                ? "Основные обязанности"
                : "Дополнительные обязанности"}
            </div>
            {type === "main"
              ? filteredFunctions?.map((func) => (
                  <button
                    key={func.funcId}
                    type="button"
                    className="w-full px-3 py-2 text-left text-gray-100 hover:bg-red-200/20 
                      focus:outline-none focus:bg-red-500/30 transition-colors duration-150 rounded-xl"
                    onClick={() => handleSelect(func.funcId)}
                    role="option"
                    aria-selected={formData.func_id === func.funcId}
                  >
                    {func.funcName}
                  </button>
                )) || (
                  <div className="px-3 py-2 text-gray-400 rounded-xl">
                    Обязанностей не найдено
                  </div>
                )
              : filteredNonCompulsory?.map((duty) => (
                  <button
                    key={duty.deputyId}
                    type="button"
                    className="w-full px-3 py-2 text-left text-gray-100 hover:bg-green-500/20 
                      focus:outline-none focus:bg-green-500/30 transition-colors duration-150 rounded-xl"
                    onClick={() => handleSelect(duty.deputyId)}
                    role="option"
                    aria-selected={formData.deputy_id === duty.deputyId}
                  >
                    {duty.deputyName}
                  </button>
                )) || (
                  <div className="px-3 py-2 text-gray-400 rounded-xl">
                    Обязанностей не найдено
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
};
