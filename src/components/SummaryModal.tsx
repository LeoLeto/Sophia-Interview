import React from "react";
import { GptFormData } from "../types";

interface SummaryModalProps {
  formData: GptFormData;
  taskInProgress: string;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ formData, onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          ✖
        </button>
        <h2>Resumen de la entrevista</h2>

        <h3>Identidad del usuario</h3>
        <ul>
          <li>
            <strong>Nombre:</strong> {formData.name || "Pendiente"}
          </li>
          <li>
            <strong>Cargo:</strong> {formData.position || "Pendiente"}
          </li>
        </ul>

        <h3>Tareas</h3>
        {Object.entries(formData.tasks)
          .filter(([, task]) => task && typeof task === "object")
          .map(([taskName, task]) => (
            <div key={taskName} className="taskSummary">
              <h4>{taskName}</h4>
              <ul>
                <li>
                  <strong>Frecuencia y tiempo:</strong>{" "}
                  {task.frequencyAndTime || "Pendiente"}
                </li>
                <li>
                  <strong>Dificultad:</strong> {task.difficulty || "Pendiente"}
                </li>
                <li>
                  <strong>Valor agregado:</strong>{" "}
                  {task.addedValue || "Pendiente"}
                </li>
                <li>
                  <strong>Priorización implícita:</strong>{" "}
                  {task.implicitPriority || "Pendiente"}
                </li>
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SummaryModal;
