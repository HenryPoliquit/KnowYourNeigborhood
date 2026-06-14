// Geocoding via OpenStreetMap Nominatim (no API key required).
// Respect usage policy: low volume, identify the app via a referer/User-Agent
// (browsers set these automatically).
import axios from 'axios';

export function useGeocode() {
  async function geocode(query) {
    if (!query || !query.trim()) return null;
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: query, format: 'json', limit: 1 },
    });
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      label: data[0].display_name,
    };
  }

  async function reverse(lat, lng) {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { lat, lon: lng, format: 'json' },
    });
    return data?.display_name ?? null;
  }

  return { geocode, reverse };
}
