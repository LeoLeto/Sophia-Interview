import { ChatMessage, GptFormData } from "../types";
import { FIELD_OPTIONS } from "./handleSendMessage/taskTypes";

export function handleTaskOptionSelect({
  msgIndex,
  optionIndex,
  messages,
  setMessages,
  setFormData,
  taskInProgress,
  setTaskInProgress,
  indexCurrentTaskField,
  setindexCurrentTaskField,
}: {
  msgIndex: number;
  optionIndex: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
  taskInProgress: string | null;
  setTaskInProgress: (taskKey: string) => void;
  indexCurrentTaskField: number;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
}) {
  const optionMessage = messages[msgIndex];
  console.log("optionMessage at index", msgIndex, optionMessage);

  if (optionMessage.type !== "options") {
    console.error("Message at index is not an options message");
    return;
  }

  if (!optionMessage.meta || !optionMessage.meta.field) {
    console.error("No meta.field found on options message");
    return;
  }

  const field = optionMessage.meta.field;

  const selectedOption = (optionMessage.content as { options: string[] })
    .options[optionIndex];

  // Mark selected option in chat history
  setMessages((prev) => {
    const updated = [...prev];
    const msg = updated[msgIndex];
    if (msg.type === "options" && msg.content && "selected" in msg.content) {
      msg.content.selected = optionIndex;
    }
    return [...updated];
  });

  if (field === "task") {
    // User selected a task, start that task's form fields
    const selectedTask = selectedOption;

    // Ensure task exists in formData
    setFormData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [selectedTask]: prev.tasks[selectedTask] ?? {
          frequency: null,
          duration: null,
          difficulty: null,
          addedValue: null,
          implicitPriority: null,
        },
      },
    }));

    setTaskInProgress(selectedTask);
    setindexCurrentTaskField(0);

    // Ask for first field (frequency)
    const options = FIELD_OPTIONS["frequency"] ?? []; // fallback to empty array if undefined

    setMessages((prev) => [
      ...prev,
      {
        type: "text",
        role: "system",
        content: `Perfecto. Empecemos con la tarea "${selectedTask}". ¿Con qué frecuencia la realizas?`,
      },
      {
        type: "options",
        role: "assistant",
        content: { options }, // now guaranteed string[]
        meta: { field: "frequency" },
      },
    ]);
  } else {
    // field is frequency, duration, difficulty, or implicitPriority

    if (!taskInProgress) {
      console.error("No task in progress when selecting field option");
      return;
    }

    // Map field name to the property key in formData.tasks[task]
    const fieldKey = field as keyof GptFormData["tasks"][string];

    // Save the selected value (optionIndex corresponds to enum numeric value)
    setFormData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [taskInProgress]: {
          ...prev.tasks[taskInProgress],
          [fieldKey]: optionIndex,
        },
      },
    }));

    // Prepare next field
    const fieldsOrder: (keyof GptFormData["tasks"][string])[] = [
      "frequency",
      "duration",
      "difficulty",
      "addedValue",
      "implicitPriority",
    ];

    let nextindexCurrentTaskField = indexCurrentTaskField + 1;

    // Skip addedValue for now or handle text input differently
    if (fieldsOrder[nextindexCurrentTaskField] === "addedValue") {
      nextindexCurrentTaskField++;
    }

    if (nextindexCurrentTaskField >= fieldsOrder.length) {
      // Done all fields for this task
      setTaskInProgress("");
      setindexCurrentTaskField(0);

      // TODO: Ask user if they want to select another task or finish
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: `Has completado la información para la tarea "${taskInProgress}". ¿Quieres seleccionar otra tarea?`,
        },
      ]);
    } else {
      const nextField = fieldsOrder[nextindexCurrentTaskField];
      setindexCurrentTaskField(nextindexCurrentTaskField);

      const options = FIELD_OPTIONS[nextField];

      if (options) {
        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            role: "system",
            content: getPromptForField(nextField, taskInProgress),
          },
          {
            type: "options",
            role: "assistant",
            content: { options },
            meta: { field: nextField },
          },
        ]);
      } else {
        // For fields without options (like addedValue), handle differently (e.g. text input)
        // Add your text input prompt logic here if needed
      }
    }
  }
}

function getPromptForField(field: string, task: string): string {
  switch (field) {
    case "frequency":
      return `¿Con qué frecuencia realizas la tarea "${task}"?`;
    case "duration":
      return `¿Cuánto tiempo tarda la tarea "${task}"?`;
    case "difficulty":
      return `¿Qué dificultad tiene la tarea "${task}"?`;
    case "implicitPriority":
      return `¿Cuál es la prioridad de la tarea "${task}"?`;
    default:
      return `Por favor proporciona información para la tarea "${task}".`;
  }
}
