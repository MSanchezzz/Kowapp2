// StudentFormModal.js
import React, { useState } from 'react';
import '../../../client/src/app/style/styles.css';

const StudentFormModal = ({ student, onChange, onSave, onCancel }) => {
  // Estado para manejar los mensajes de error
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    // Validación de nombre y apellido
    if (!student.student_nombre) {
      tempErrors.student_nombre = 'El nombre es requerido.';
    }
    if (!student.student_surname) {
      tempErrors.student_surname = 'El apellido es requerido.';
    }

    // Validación del RUT
    if (!validateRut(student.rut)) {
      tempErrors.rut = 'El RUT no es válido.';
    }

    setErrors(tempErrors);
    // Retorna true si no hay errores
    return Object.keys(tempErrors).length === 0;
  };

  // Función para validar el RUT
  const validateRut = (rut) => {
    // Expresión regular para validar el formato
    const regex = /^[0-9]+-[0-9kK]{1}$/;
    if (!regex.test(rut)) return false;

    // Separar número del dígito verificador
    let [numero, dv] = rut.split('-');
    let m = 0, s = 1;
    for (; numero; numero = Math.floor(numero / 10)) {
      s = (s + numero % 10 * (9 - m++ % 6)) % 11;
    }
    // Verificar dígito verificador
    return dv.toUpperCase() === (s ? s - 1 : 'K').toString();
  };

  // Modificar onSave para incluir validación
  const handleSave = () => {
    if (validate()) {
      onSave();
    }
  };

  return (
    <div className="students-form-modal-background">
      <div className="students-form-modal-container">
        <form>
          <input
            type="text"
            name="student_nombre"
            value={student.student_nombre}
            onChange={onChange}
            placeholder="Nombres"
            autoComplete='off'
          />
          {errors.student_nombre && <p className="error-form-add-student">{errors.student_nombre}</p>}
          <input
            type="text"
            name="student_surname"
            value={student.student_surname}
            onChange={onChange}
            placeholder="Apellidos"
            autoComplete='off'
          />
          {errors.student_surname && <p className="error-form-add-student">{errors.student_surname}</p>}
          <input
            type="text"
            name="rut"
            value={student.rut}
            onChange={onChange}
            placeholder="RUT (con guión y sin puntos)"
            autoComplete='off'
          />
          {errors.rut && <p className="error-form-add-student">{errors.rut}</p>}
          <div className='buttons-form-add-student'>
            <button type="button" onClick={handleSave}>Guardar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;

