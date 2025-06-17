import { ChatMessage, GptFormData, TaskFormData } from "../types";
import { fetchTaskFinder } from "./fetchTasks";

const TASK_FIELDS: (keyof TaskFormData)[] = [
  "frequency",
  "duration",
  "difficulty",
  "addedValue",
  "implicitPriority",
];

export const FIELD_OPTIONS: Partial<Record<keyof TaskFormData, string[]>> = {
  frequency: [
    "Menos de una vez por semana", // 0
    "Al menos una vez por semana", // 1
    "De dos a tres veces por semana", // 2
    "Al menos una vez todos los días", // 3
    "Todos los días, múltiples veces", // 4
  ],
  duration: [
    "Menos de 15 minutos", // 0
    "Entre 15 y 30 minutos", // 1
    "Entre 30 minutos y una hora", // 2
    "Entre una y dos horas", // 3
    "Más de dos horas", // 4
  ],
  difficulty: [
    "Baja", // 0
    "Media", // 1
    "Alta", // 2
  ],
  implicitPriority: [
    "Baja", // 0
    "Media", // 1
    "Alta", // 2
  ],
};

export const handleSendMessage = async (
  newMessage: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFormData: React.Dispatch<React.SetStateAction<GptFormData>>,
  indexChatProgress: number,
  setIndexChatProgress: React.Dispatch<React.SetStateAction<number>>,
  taskInProgress: string | null,
  setTaskInProgress: (taskKey: string | null) => void,
  fieldIndex: number,
  setFieldIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  console.log("[handleSendMessage] Called with message:", newMessage);

  const userMsg: ChatMessage = {
    type: "text",
    role: "user",
    content: newMessage,
  };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  const keepIfValid = <T>(incoming: T | undefined | null, existing: T): T =>
    typeof incoming === "string" && incoming.trim() !== ""
      ? incoming
      : existing;

  try {
    // Step 1: Name
    if (indexChatProgress === 1) {
      setFormData((prev) => ({
        ...prev,
        name: keepIfValid(newMessage, prev.name),
      }));
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          role: "system",
          content: "Y ahora, ¿podrías decirme tu cargo en la empresa?",
        },
      ]);
      setIndexChatProgress(2);
      return;
    }

    // Step 2: Position
    if (indexChatProgress === 2) {
      setFormData((prev) => ({
        ...prev,
        position: keepIfValid(newMessage, prev.position),
      }));
      try {
        const result = await fetchTaskFinder(newMessage);
        if (result.found) {
          setMessages((prev) => [
            ...prev,
            {
              type: "text",
              role: "system",
              content: `He seleccionado 5 de las tareas más comunes de un ${newMessage}; escoge la tarea que deseas optimizar o escribe una diferente si no se encuentra entre las opciones`,
            },
            {
              role: "assistant",
              type: "options",
              content: {
                options: result.tasks,
              },
            },
          ]);
        }
      } catch (err) {
        console.error("Request failed:", err);
      }
      setIndexChatProgress(3);
      return;
    }

    // Step 3+: Task field input flow
    if (taskInProgress) {
      const currentField = TASK_FIELDS[fieldIndex];

      // Save the response to formData
      setFormData((prev) => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskInProgress]: {
            ...prev.tasks[taskInProgress],
            [currentField]: newMessage,
          },
        },
      }));

      // Advance to next field or task
      if (fieldIndex < TASK_FIELDS.length - 1) {
        const nextField = TASK_FIELDS[fieldIndex + 1];
        const options = FIELD_OPTIONS[nextField];

        console.log("Inserting next field question and options:", {
          nextField,
          options,
        });

        setMessages((prev) => [
          ...prev,
          {
            type: "text",
            role: "system",
            content: `¿Cuál es la ${nextField} de esta tarea?`,
          },
          ...(options
            ? [
                {
                  type: "options",
                  role: "assistant",
                  content: { options },
                } as const,
              ]
            : []),
        ]);

        setFieldIndex(fieldIndex + 1);
      } else {
        // Done with this task
        setFieldIndex(0);

        // Check for other remaining tasks
        setFormData((prev) => {
          const remainingTasks = Object.entries(prev.tasks)
            .filter(([, task]) =>
              TASK_FIELDS.some(
                (field) => task[field] === null || task[field] === undefined
              )
            )
            .map(([k]) => k);

          if (remainingTasks.length > 0) {
            const nextTask = remainingTasks[0];
            setTaskInProgress(nextTask);
            const options = FIELD_OPTIONS[TASK_FIELDS[0]];

            console.log("Moving to next task:", nextTask);
            console.log("Inserting first field question + options:", {
              field: TASK_FIELDS[0],
              options,
            });

            setMessages((prevMsgs) => [
              ...prevMsgs,
              {
                type: "text",
                role: "system",
                content: `Vamos a continuar con la siguiente tarea: ${nextTask}. ¿Cuál es su ${TASK_FIELDS[0]}?`,
              },
              ...(options
                ? [
                    {
                      type: "options",
                      role: "assistant",
                      content: { options },
                    } as const,
                  ]
                : []),
            ]);
          } else {
            setTaskInProgress(null);
            setMessages((prevMsgs) => [
              ...prevMsgs,
              {
                type: "text",
                role: "system",
                content: "Gracias. Has completado todas las tareas.",
              },
            ]);
          }

          return prev;
        });
      }

      return;
    }
  } catch (error) {
    console.error("error in handleSendMessage:", error);
    const errorMsg: ChatMessage = {
      type: "text",
      role: "assistant",
      content: "Lo siento, ocurrió un error al responder.",
    };
    setMessages((prev) => [...prev, errorMsg]);
  } finally {
    setLoading(false);
  }
};
