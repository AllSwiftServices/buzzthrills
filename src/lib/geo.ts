export interface GeoLocation {
  city: string;
  country: string;
  countryCode: string;
  region: string;
  lat: number;
  lon: number;
  ip: string;
}

export async function getLocationFromIP(ip: string): Promise<GeoLocation | null> {
  try {
    // Fallback for localhost testing
    const targetIP = (ip === "127.0.0.1" || ip === "::1" || !ip) ? "8.8.8.8" : ip;
    
    // We'll use ip-api.com for this implementation
    const res = await fetch(`http://ip-api.com/json/${targetIP}`);
    if (!res.ok) return null;
    
    const data = await res.json();

    if (data.status === "fail") {
      console.error("GeoLookup Failed:", data.message);
      return null;
    }

    return {
      city: data.city,
      country: data.country,
      countryCode: data.countryCode,
      region: data.regionName,
      lat: data.lat,
      lon: data.lon,
      ip: data.query
    };
  } catch (error) {
    console.error("GeoLookup Error:", error);
    return null;
  }
}
