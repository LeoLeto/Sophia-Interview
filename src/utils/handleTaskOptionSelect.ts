import { ChatMessage, GptFormData } from "../types";
import { TaskFormData } from "./handleSendMessage/taskTypes";
import { askNextField } from "./handleTaskFieldFlow/askNextField";
import { saveCurrentTaskField } from "./handleTaskFieldFlow/saveCurrentTaskField";
import { sendTaskCompleteOrNext } from "./handleTaskFieldFlow/sendTaskCompleteOrNext";
import { fetchTasksForResolvedOccupation } from "./fetchTasksForResolvedOccupation";

interface OptionMeta {
  field: string;
  taskKey?: string;
  originals?: string[];
}

type OptionsContent = {
  options: string[];
  selected?: number;
};

export async function handleTaskOptionSelect({
  msgIndex,
  optionIndex,
  messages,
  setMessages,
  setFormData,
  taskInProgress,
  setTaskInProgress,
  setindexCurrentTaskField,
  formData,
  fetchedTasks,
  // isLoading,
  setIsLoading,
}: {
  msgIndex: number;
  optionIndex: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>;
  taskInProgress: string | null;
  setTaskInProgress: (taskKey: string | null) => void;
  indexCurrentTaskField: number;
  setindexCurrentTaskField: React.Dispatch<React.SetStateAction<number>>;
  formData: GptFormData;
  fetchedTasks: string[];
  // isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const optionMessage = messages[msgIndex];

  if (optionMessage.type !== "options") {
    console.error("Message at index is not an options message");
    return;
  }

  const meta = optionMessage.meta as OptionMeta;

  if (!meta || !meta.field) {
    console.error("No meta.field found on options message");
    return;
  }

  const field = meta.field;
  const selectedOption = (optionMessage.content as OptionsContent).options[
    optionIndex
  ];

  // ✅ Mark selected option in chat history
  setMessages((prev) => {
    const updated = [...prev];
    if (updated[msgIndex].type === "options") {
      (updated[msgIndex].content as OptionsContent).selected = optionIndex;
    }
    return updated;
  });

  if (field === "occupationMatch") {
    const originalOptions = meta.originals;
    if (!originalOptions || !originalOptions[optionIndex]) {
      console.error("No original label found for selected occupation");
      return;
    }

    const originalLabel = originalOptions[optionIndex];
    setIsLoading(true);

    try {
      const result = await fetchTasksForResolvedOccupation(originalLabel);
      console.log(" result: ", result);

      if (result.found) {
        setIsLoading(false);
        const safeTasks = result.tasks ?? [];

        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            role: "system",
            content: `He seleccionado 5 de las tareas más comunes de un ${selectedOption}; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones`,
          },
          {
            type: "options",
            role: "assistant",
            content: { options: safeTasks },
            meta: { field: "task" },
          },
        ]);
      } else {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            role: "system",
            content:
              result.reason || "No se encontraron tareas para esa ocupación.",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching tasks for resolved occupation:", err);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: "Ocurrió un error al buscar tareas para esa ocupación.",
        },
      ]);
    }

    return;
  }

  if (field === "task") {
    const selectedTask = selectedOption;

    // ✅ Initialize formData entry if needed
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

    // ✅ Start task flow
    setTaskInProgress(selectedTask);
    setindexCurrentTaskField(0);

    // Ask first field (frequency)
    askNextField({
      taskKey: selectedTask,
      fieldKey: "frequency",
      setMessages,
    });

    return;
  }

  const currentTask = taskInProgress ?? meta.taskKey ?? null;

  if (!currentTask) {
    console.error("No task in progress and no taskKey in meta");
    return;
  }

  // ✅ Save selected value for current field
  saveCurrentTaskField({
    taskKey: currentTask,
    fieldKey: field as keyof TaskFormData,
    selectedValue: optionIndex,
    setFormData,
  });

  // ✅ Decide whether to continue or finish task
  sendTaskCompleteOrNext({
    taskKey: currentTask,
    fieldKey: field as keyof TaskFormData,
    setindexCurrentTaskField,
    setTaskInProgress,
    setMessages,
    formData,
    fetchedTasks,
  });
}
