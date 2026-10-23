// Genera o recupera un ID único para el navegador del móvil + obtiene su IP pública
export async function getVoterIdentity() {
  let deviceId = "";

  if (typeof window !== "undefined") {
    deviceId = localStorage.getItem("zorros_device_id");
    if (!deviceId) {
      deviceId =
        "dev_" +
        Math.random().toString(36).substring(2, 15) +
        "_" +
        Date.now().toString(36);
      localStorage.setItem("zorros_device_id", deviceId);
    }
  }

  let ip = "ip_desconocida";
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (response.ok) {
      const data = await response.json();
      ip = data.ip;
    }
  } catch (error) {
    console.warn("No se pudo obtener la IP pública, usando DeviceId como respaldo.");
  }

  return {
    deviceId,
    ip,
    signature: `${ip}_${deviceId}`, // Huella combinada IP + Dispositivo
  };
}
