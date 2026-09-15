import {
  experienceDefaults,
  experienceSchema,
} from "../shared/experience-settings.js";
export async function getExperience(db) {
  const [row] = await db.query(
    "SELECT published FROM documents WHERE public_key=$1 AND published IS NOT NULL",
    ["settings:global"],
  );
  const stored = row ? JSON.parse(row.published).experience : null;
  return experienceSchema.parse({ ...experienceDefaults, ...stored });
}
