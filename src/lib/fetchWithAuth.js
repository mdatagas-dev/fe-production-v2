const apiBaseUrl = require("./urlEndPoint");

const fetchWithAuth = async (url, option = {}) => {
  // Backend memakai session Redis via HttpOnly cookie (session_id),
  // jadi cukup kirim cookie, tanpa header Authorization.
  let res = await fetch(url, {
    ...option,
    credentials: "include",
    headers: {
      ...option.headers,
      "Content-Type": "application/json",
    },
  });

  // Session invalid/expired -> bersihkan state lokal, paksa login ulang
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return res.json();
  }

  return res.json();
};

module.exports = fetchWithAuth;
