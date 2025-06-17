export type ChatMessage =
  | {
      role: "user" | "assistant" | "system";
      type: "text";
      content: string;
    }
  | {
      role: "assistant";
      type: "options";
      content: {
        options: string[];
        selected?: number;
      };
      meta?: {
        field: string; // e.g. "task", "frequency", "duration", etc.
      };
    };

export interface GptFormData {
  name: string | null;
  position: string | null;
  tasks: Record<string, TaskFormData>;
}

export type TaskFormData = {
  // Frecuencia:
  // 0: Menos de una vez por semana
  // 1: Al menos una vez por semana
  // 2: De dos a tres veces por semana
  // 3: Al menos una vez todos los días
  // 4: Todos los días, múltiples veces
  frequency?: null | 0 | 1 | 2 | 3 | 4;
  // Duración:
  // 0: Menos de 15 minutos
  // 1: Entre 15 y 30 minutos
  // 2: Entre 30 minutos y una hora
  // 3: Entre una y dos horas
  // 4: Más de dos horas
  duration: null | 0 | 1 | 2 | 3 | 4;
  // Dificultad:
  // 0: Baja
  // 1: Media
  // 2: Alta
  difficulty?: null | 0 | 1 | 2;
  addedValue?: null | string;
  // Prioridad:
  // 0: Baja
  // 1: Media
  // 2: Alta
  implicitPriority?: null | 0 | 1 | 2;
};
