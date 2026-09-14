const JAKARTA_TIME_ZONE = "Asia/Jakarta";

// Semua waktu operasional ditampilkan dalam zona waktu pabrik (WIB),
// terlepas dari timezone komputer client.
export const formatJakartaDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", { timeZone: JAKARTA_TIME_ZONE });
};
