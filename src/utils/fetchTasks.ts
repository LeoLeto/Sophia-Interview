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
  const res = await fetch(import.meta.env.VITE_API_URL
    // + "IOTaskFinder"
    + "IOTaskFinderInDB"
    , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": import.meta.env.VITE_FUNCTIONS_KEY_QA,
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
