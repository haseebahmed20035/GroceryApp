import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://192.168.1.5:5000/api";
// replace 192.168.1.5 with your laptop IP address

export const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL.replace("/api", "")}/uploads/${image}`;
};

export const request = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};