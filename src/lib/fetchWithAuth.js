const apiBaseUrl = require("./urlEndPoint");

let isRefreshing = false;

const fetchWithAuth = async (url, option = {}) => {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  let res = await fetch(url, {
    ...option,
    headers: {
      ...option.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // sukses
  if (res.ok) {
    return res.json();
  }

  // hanya handle 401
  if (res.status !== 401 || !refreshToken) {
    if (res.status === 401) {
      sessionStorage.clear();
      window.location.href = "/auth/login";
    }
    throw new Error(`HTTP Error ${res.status}`);
  }

  // stop infinite loop
  if (isRefreshing) {
    return;
  }

  isRefreshing = true;

  // 🔥 FIX TYPO
  const refreshRes = await fetch(`${apiBaseUrl}/login/refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!refreshRes.ok) {
    isRefreshing = false;
    sessionStorage.clear();
    window.location.href = "/auth/login";
    return;
  }

  const { accessToken: newAccessToken } = await refreshRes.json();
  sessionStorage.setItem("accessToken", newAccessToken);

  isRefreshing = false;

  // retry original request
  res = await fetch(url, {
    ...option,
    headers: {
      ...option.headers,
      Authorization: `Bearer ${newAccessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Retry failed ${res.status}`);
  }

  return res.json();
};

module.exports = fetchWithAuth;
