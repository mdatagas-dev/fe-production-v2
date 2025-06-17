const apiBaseUrl = require("./urlEndPoint");

const fetchWithAuth = async (url, option = {}) => {
  let accessToken = sessionStorage.getItem("accessToken");
  let refreshToken = sessionStorage.getItem("refreshToken");

  let res;
  const authOptions = {
    ...option,
    headers: {
      ...option.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  res = await fetch(url, authOptions);

  // Jika token kadaluarsa (401 Unauthorized)
  if (Number(res.status) === 401 && refreshToken) {
    // mengambil refreshToken saat status unauthorized
    const refreshRes = await fetch(`${apiBaseUrl}/users/refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json(); //sudah dapat token baru
      const newAccessToken = refreshData.accessToken; //disimpan di variable

      // Ulangi request dengan token baru
      const retryOptions = {
        ...option,
        headers: {
          ...option.headers,
          Authorization: `Bearer ${newAccessToken}`,
          "x-token-type": "refresh",
        },
      };

      res = await fetch(url, retryOptions);
      // Simpan kembali token baru di accessToken sessionStorage
      sessionStorage.setItem("accessToken", newAccessToken);
    } else {
      console.warn("Refresh token invalid. Redirecting to login...");
      window.location.href = "/auth/login";
      return;
    }
  }
  return res.json();
};

module.exports = fetchWithAuth;
