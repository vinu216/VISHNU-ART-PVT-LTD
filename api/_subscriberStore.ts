import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export type SubscriberRecord = {
  email: string;
  createdAt: string;
  source: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storagePath = path.join(__dirname, "../data/subscribers.json");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidSubscriberEmail(email: string) {
  return emailPattern.test(normalizeEmail(email));
}

async function ensureStorageFile() {
  await fs.mkdir(path.dirname(storagePath), { recursive: true });

  try {
    await fs.access(storagePath);
  } catch {
    await fs.writeFile(storagePath, "[]", "utf-8");
  }
}

export async function getSubscribers(): Promise<SubscriberRecord[]> {
  await ensureStorageFile();
  const raw = await fs.readFile(storagePath, "utf-8");

  try {
    const parsed = JSON.parse(raw) as SubscriberRecord[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item?.email === "string" && typeof item?.createdAt === "string" && typeof item?.source === "string")
      : [];
  } catch {
    return [];
  }
}

async function saveSubscribers(records: SubscriberRecord[]) {
  await ensureStorageFile();
  await fs.writeFile(storagePath, JSON.stringify(records, null, 2), "utf-8");
}

export async function addSubscriber(email: string, source: string) {
  const normalizedEmail = normalizeEmail(email);
  const records = await getSubscribers();
  const exists = records.some((item) => normalizeEmail(item.email) === normalizedEmail);

  if (exists) {
    return { status: "duplicate" as const };
  }

  const entry: SubscriberRecord = {
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    source,
  };

  records.push(entry);
  await saveSubscribers(records);
  return { status: "created" as const, entry };
}