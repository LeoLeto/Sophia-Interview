import { TaskFormData } from "../../types";

export const TASK_FIELDS: (keyof TaskFormData)[] = [
  "frequency",
  "duration",
  "difficulty",
  "addedValue",
  "implicitPriority",
];

export const FIELD_OPTIONS: Partial<Record<keyof TaskFormData, string[]>> = {
  frequency: [
    "Menos de una vez por semana",
    "Al menos una vez por semana",
    "De dos a tres veces por semana",
    "Al menos una vez todos los días",
    "Todos los días, múltiples veces",
  ],
  duration: [
    "Menos de 15 minutos",
    "Entre 15 y 30 minutos",
    "Entre 30 minutos y una hora",
    "Entre una y dos horas",
    "Más de dos horas",
  ],
  difficulty: ["Baja", "Media", "Alta"],
  implicitPriority: ["Baja", "Media", "Alta"],
};
