export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);

  const response = await fetch("/api/upload", { method: "POST", body: form });
  const body = (await response.json().catch(() => null)) as { url?: string; message?: string } | null;

  if (!response.ok || !body?.url) {
    throw new Error(body?.message ?? "Image upload failed. Please try again.");
  }
  return body.url;
}
