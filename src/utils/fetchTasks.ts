export interface TaskFinderSuccess {
  found: true;
  tasks: string[];
}

export interface TaskFinderFailure {
  found: false;
  reason: string;
}

export type TaskFinderResponse = TaskFinderSuccess | TaskFinderFailure;

export async function fetchTaskFinder(
  job: string
): Promise<TaskFinderResponse> {
  const res = await fetch(import.meta.env.VITE_API_URL + "IOTaskFinder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": import.meta.env.AZURE_FUNCTION_KEY,
    },
    body: JSON.stringify({ job }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Failed to fetch tasks.");
  }

  const data = await res.json();

  return data;
}
