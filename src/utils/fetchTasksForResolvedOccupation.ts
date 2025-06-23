export async function fetchTasksForResolvedOccupation(
  originalLabel: string
): Promise<{
  found: boolean;
  tasks?: string[];
  reason?: string;
}> {
  const res = await fetch(import.meta.env.VITE_API_URL + "IOTaskFinderInDB", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": import.meta.env.VITE_FUNCTIONS_KEY_QA,
    },
    body: JSON.stringify({
      job: originalLabel,
      isOccupationTypedOrSelected: "selected",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return await res.json();
}
