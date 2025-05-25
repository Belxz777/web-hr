import React, { useState, useEffect, useRef } from "react";

interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: number;
}

interface EmployeeSelectProps {
  employees: Employee[];
  onSelect: (employeeId: number) => void;
}

export const EmployeeSelectInput: React.FC<EmployeeSelectProps> = ({
  employees,
  onSelect,
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

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-4 py-2.5 border border-border text-foreground text-left 
          focus:outline-none focus:ring-2 focus:ring-primary bg-card transition-colors duration-200
          flex justify-between items-center rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">Выберите сотрудника</span>
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
          className="absolute z-10 w-full mt-1 bg-card border border-border shadow-lg 
            max-h-80 overflow-y-auto rounded-xl"
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border text-foreground 
                focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted-foreground rounded-xl"
            />
          </div>
          <div className="p-2">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <button
                  key={employee.employeeId}
                  type="button"
                  className="w-full px-3 py-2 text-left text-foreground hover:bg-gray-300 
                    focus:outline-none focus:bg-muted transition-colors duration-150 rounded-xl"
                  onClick={() => {
                    onSelect(employee.employeeId);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {employee.firstName} {employee.lastName}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-muted-foreground rounded-xl">
                Сотрудники не найдены
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
