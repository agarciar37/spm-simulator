import Counter from "@/models/Counter";

export async function getNextSequence(key) {
  const counter = await Counter.findOneAndUpdate(
    { key },
    {
      $inc: { value: 1 },
      $setOnInsert: { key },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );

  if (!counter) {
    throw new Error("No se pudo generar el contador");
  }

  return counter.value;
}

export function formatCode(prefix, number) {
  return `${prefix}${String(number).padStart(5, "0")}`;
}