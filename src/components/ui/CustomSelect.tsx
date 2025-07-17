import React, { useState, useEffect, useRef, useCallback } from "react";

interface Responsibility {
  deputyId: number;
  deputyName: string;
}

interface FunctionItem {
  funcId: number;
  funcName: string;
}

interface ResponsibilitiesData {
  nonCompulsory: Responsibility[];
  functions: FunctionItem[];
}

interface CustomSelectProps {
  type: string;
  formData: {
    func_id: number;
    deputy_id: number;
  };
  setFormData: (data: React.SetStateAction<{
    func_id: number;
    deputy_id: number;
    workingHours: string;
    comment: string;
  }>) => void;
  responsibilities: ResponsibilitiesData;
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

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Фильтрация элементов
  const filteredFunctions = responsibilities.functions.filter((func) =>
    func.funcName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNonCompulsory = responsibilities.nonCompulsory.filter((duty) =>
    duty.deputyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Получение выбранного значения
  const getSelectedLabel = useCallback(() => {
    if (type === "main") {
      const selected = responsibilities.functions.find(func => func.funcId === formData.func_id);
      return selected?.funcName || "Выберите обязанность";
    } else {
      const selected = responsibilities.nonCompulsory.find(duty => duty.deputyId === formData.deputy_id);
      return selected?.deputyName || "Выберите обязанность";
    }
  }, [type, formData, responsibilities]);

  // Обработчик выбора элемента
  const handleSelect = useCallback((id: number) => {
    if (type === "main") {
      setFormData(prev => ({ ...prev, func_id: id, deputy_id: 0 }));
    } else {
      setFormData(prev => ({ ...prev, deputy_id: id, func_id: 0 }));
    }
    setIsOpen(false);
    setSearchTerm("");
  }, [type, setFormData]);

  const selectedLabel = getSelectedLabel();
  const currentItems = type === "main" ? filteredFunctions : filteredNonCompulsory;
  const isEmpty = currentItems.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-4 py-2.5 border border-gray-700 text-left 
          focus:outline-none focus:ring-2 focus:ring-secondary bg-white transition-colors duration-200
          flex justify-between items-center rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-secondary border-gray-600 shadow-lg 
            max-h-80 overflow-y-auto rounded-xl"
          role="listbox"
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-500
                focus:outline-none focus:ring-2 focus:ring-secondary rounded-xl"
              aria-label="Search options"
            />
          </div>
          <div className={`p-2 ${type === "main" ? "bg-secondary" : "bg-green-900/20"} rounded-b-xl`}>
            <div className="text-gray-300 text-sm font-medium px-3 py-1">
              {type === "main" ? "Основные обязанности" : "Дополнительные обязанности"}
            </div>
            
            {isEmpty ? (
              <div className="px-3 py-2 text-gray-400 rounded-xl">Обязанностей не найдено</div>
            ) : (
              currentItems.map((item) => (
                <button
                  key={type === "main" ? (item as FunctionItem).funcId : (item as Responsibility).deputyId}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-gray-100 transition-colors duration-150 rounded-xl
                    ${type === "main" 
                      ? "hover:bg-red-200/20 focus:bg-secondary-50" 
                      : "hover:bg-green-500/20 focus:bg-green-500/30"}`}
                  onClick={() => handleSelect(
                    type === "main" 
                      ? (item as FunctionItem).funcId 
                      : (item as Responsibility).deputyId
                  )}
                  role="option"
                  aria-selected={
                    type === "main" 
                      ? formData.func_id === (item as FunctionItem).funcId 
                      : formData.deputy_id === (item as Responsibility).deputyId
                  }
                >
                  {type === "main" ? (item as FunctionItem).funcName : (item as Responsibility).deputyName}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};