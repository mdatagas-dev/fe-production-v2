const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const JAKARTA_TIMESTAMP = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,3})?$/;

const parseJakartaDateTime = (value) => {
  const text = String(value).trim();

  // API timestamps are Jakarta wall-clock values without an offset. Add the
  // offset only while parsing, so every browser renders the same instant.
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,3})?$/.test(text)) {
    return new Date(`${text.replace(" ", "T")}+07:00`);
  }

  return new Date(value);
};

// Semua waktu operasional ditampilkan dalam zona waktu pabrik (WIB),
// terlepas dari timezone komputer client.
export const formatJakartaDateTime = (value) => {
  if (!value) return "-";

  const text = String(value).trim();
  if (JAKARTA_TIMESTAMP.test(text)) return text;

  const date = parseJakartaDateTime(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", { timeZone: JAKARTA_TIME_ZONE });
};
