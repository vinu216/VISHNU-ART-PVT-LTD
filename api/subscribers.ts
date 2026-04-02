import { getSubscribers } from "./_subscriberStore";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const requiredKey = String(process.env.ADMIN_SUBSCRIBERS_KEY || "").trim();
  const providedKey = String(req.headers["x-admin-key"] || "").trim();

  if (requiredKey && providedKey !== requiredKey) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const subscribers = await getSubscribers();
    const sorted = [...subscribers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    console.error("Failed to load subscribers", error);
    return res.status(500).json({ success: false, message: "Something went wrong, please try again" });
  }
}