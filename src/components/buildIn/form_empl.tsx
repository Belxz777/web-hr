import React, { useEffect, useRef, useState } from "react";
import "@/app/test.css";

const FormEmpl = () => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [labelText, setLabelText] = useState("Никто не выбран");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const newValues = selectedOptions.map((option) => option.value);
    setSelectedValues(newValues);
    setLabelText(newValues.length === 0 ? "Никто не выбран" : "");
  };

  const handleButtonClick = (value: string) => {
    if (selectRef.current) {
      const options = Array.from(selectRef.current.options);
      const optionToDeselect = options.find((opt) => opt.value === value);
      if (optionToDeselect) {
        optionToDeselect.selected = false;
        const newValues = selectedValues.filter((val) => val !== value);
        setSelectedValues(newValues);
        setLabelText(newValues.length === 0 ? "Никто не выбран" : "");
      }
    }
  };

  return (
    <div>
      <div className="form_label">
        <div className="multiselect_block">
          <label htmlFor="select-1" id="label" className="field_multiselect">
            {labelText}
            {selectedValues.map((value) => (
              <button
                key={value}
                type="button"
                className="btn_multiselect"
                onClick={() => handleButtonClick(value)}
              >
                {value}
              </button>
            ))}
          </label>

          <input
            id="checkbox-1"
            className="multiselect_checkbox"
            type="checkbox"
          />
          <label htmlFor="checkbox-1" className="multiselect_label"></label>

          <select
            ref={selectRef}
            id="select-1"
            className="field_select"
            name="Сотрудники"
            multiple
            onChange={handleChange}
          >
            <option value="сотрудник 1">сотрудник 1</option>
            <option value="сотрудник 2">сотрудник 2</option>
            <option value="сотрудник 3">сотрудник 3</option>
            <option value="сотрудник 4">сотрудник 4</option>
          </select>
        </div>
        <span className="error_text"></span>
      </div>
    </div>
  );
};

export default FormEmpl;
