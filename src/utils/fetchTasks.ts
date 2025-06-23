export interface TaskFinderSuccess {
  found: true;
  tasks: string[];
}

export interface TaskFinderFailure {
  found: false;
  reason: string;
  multiple?: false;
}

export interface TaskFinderDisambiguation {
  found: false;
  multiple: true;
  message: string;
  options: string[]; // translated names for display
  originalOptions: string[]; // original DB names for querying
}

export type TaskFinderResponse =
  | TaskFinderSuccess
  | TaskFinderFailure
  | TaskFinderDisambiguation;

export async function fetchTaskFinder(
  job: string
): Promise<TaskFinderResponse> {
  const res = await fetch(import.meta.env.VITE_API_URL + "IOTaskFinderInDB", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": import.meta.env.VITE_FUNCTIONS_KEY_QA,
    },
    body: JSON.stringify({
      job: job,
      isOccupationTypedOrSelected: "typed",
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Failed to fetch tasks.");
  }

  const data = await res.json();
  return data;
}
