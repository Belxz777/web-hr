import React, { useEffect, useRef, useState } from 'react';
import "@/app/test.css";
const FormEmpl = () => {
  const selectRef = useRef(null);

  const [labelText, setLabelText] = useState('Никто не выбран');

  const handleChange = (e) => {
    const selectedOptions = e.target.selectedOptions;
    setLabelText('');
    
    for (let option of selectedOptions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn_multiselect';
      button.textContent = option.value;
      
      button.onclick = (_) => {
        option.selected = false;
        button.remove();
        
        if (!selectRef.current.selectedOptions.length) {
          setLabelText('Никто не выбран');
        }

      };

      
      document.getElementById('label').appendChild(button);
    }
  };

  // Эффект для добавления обработчика события change к select
  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.addEventListener('change', handleChange);
    }

    return () => {
      if (selectRef.current) {
        selectRef.current.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return (
    <div>
    <div className="form_label">
      <div className="multiselect_block">
        <label htmlFor="select-1" id="label" className="field_multiselect">{labelText}</label>

        <input id="checkbox-1" className="multiselect_checkbox" type="checkbox"/>
        <label htmlFor="checkbox-1" className="multiselect_label"></label>

        <select ref={selectRef} id="select-1" className="field_select" name="Сотрудники" multiple style={{}}>
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
