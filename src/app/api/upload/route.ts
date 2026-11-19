import { auth } from "@/lib/auth";
import { validateImageFile } from "@/lib/image-rules";

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

const reply = (message: string, status: number) => Response.json({ message }, { status });

// Receives an image from the browser and forwards it to ImgBB. This runs on the server so
// IMGBB_API_KEY never reaches the browser. Only signed-in users may upload.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return reply("Please sign in to upload images.", 401);

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return reply("Image uploads are not configured on the server.", 500);

  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File)) return reply("Choose an image to upload.", 400);

  const problem = validateImageFile(file);
  if (problem) return reply(problem, 400);

  const upstream = new FormData();
  upstream.append("image", file);

  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    body: upstream,
  });
  const result = (await response.json().catch(() => null)) as { success?: boolean; data?: { url?: string } } | null;

  if (!response.ok || !result?.success || !result.data?.url) {
    return reply("Could not upload the image. Please try again.", 502);
  }
  return Response.json({ url: result.data.url });
}
