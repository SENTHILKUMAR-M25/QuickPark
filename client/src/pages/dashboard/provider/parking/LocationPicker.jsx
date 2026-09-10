/* global google */
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin, Search, Crosshair } from "lucide-react";

const KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

let loader = null;
let loaderPromise = null;

function getMaps() {
  if (!KEY) return Promise.resolve(null);
  if (!loader) loader = new Loader({ apiKey: KEY, version: "weekly", libraries: ["places"] });
  if (!loaderPromise) loaderPromise = loader.load();
  return loaderPromise;
}

function parseComponents(place) {
  const find = (type) => place.address_components?.find((c) => c.types.includes(type))?.long_name;
  const streetNumber = find("street_number") || "";
  const route = find("route") || "";
  return {
    address: [streetNumber, route].filter(Boolean).join(" ") || place.formatted_address || "",
    area: find("sublocality_level_1") || find("sublocality") || find("neighborhood") || "",
    city: find("locality") || find("administrative_area_level_2") || "",
    state: find("administrative_area_level_1") || "",
    country: find("country") || "",
    pincode: find("postal_code") || "",
  };
}

const inputCls =
  "w-full rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-500/15 disabled:opacity-50";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400";

export default function LocationPicker({ value = {}, onPick, onAddress, disabled }) {
  const [mapsReady, setMapsReady] = useState(() => (KEY ? null : false));
  const [search, setSearch] = useState("");
  const mapEl = useRef(null);
  const inputEl = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (!KEY) return;
    let cancelled = false;
    getMaps()
      .then(() => {
        if (!cancelled) setMapsReady(true);
      })
      .catch(() => {
        if (!cancelled) setMapsReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applyLocation = useCallback(
    async (latLng, formatted, reverse = false) => {
      const lat = typeof latLng.lat === "function" ? latLng.lat() : latLng.lat;
      const lng = typeof latLng.lng === "function" ? latLng.lng() : latLng.lng;
      onPick?.({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });

      if (reverse || !formatted) {
        try {
          const geo = new google.maps.Geocoder();
          const res = await geo.geocode({ location: { lat, lng } });
          if (res.results?.[0]) {
            formatted = res.results[0].formatted_address;
            onAddress?.(parseComponents(res.results[0]));
          }
        } catch {
          /* geocoding failed — ignore */
        }
      }
      setSearch(formatted || "");
    },
    [onPick, onAddress]
  );

  useEffect(() => {
    if (mapsReady !== true || !mapEl.current) return;
    const center = value?.latitude != null && value?.longitude != null
      ? { lat: value.latitude, lng: value.longitude }
      : DEFAULT_CENTER;

    const instance = new google.maps.Map(mapEl.current, {
      center,
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });
    map.current = instance;

    const pin = new google.maps.Marker({
      map: instance,
      position: center,
      draggable: !disabled,
      title: "Parking location",
    });
    marker.current = pin;

    if (inputEl.current) {
      const ac = new google.maps.places.Autocomplete(inputEl.current, {
        fields: ["geometry", "formatted_address", "address_components"],
        types: ["address"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place.geometry?.location) return;
        applyLocation(place.geometry.location, place.formatted_address);
        onAddress?.(parseComponents(place));
        instance.panTo(place.geometry.location);
        pin.setPosition(place.geometry.location);
      });
    }

    pin.addListener("dragend", () => applyLocation(pin.getPosition(), null, true));
    instance.addListener("click", (e) => {
      pin.setPosition(e.latLng);
      applyLocation(e.latLng, null, true);
    });

    return () => {
      pin.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapsReady, disabled]);

  useEffect(() => {
    if (!map.current || !marker.current) return;
    if (value?.latitude != null && value?.longitude != null) {
      const pos = { lat: value.latitude, lng: value.longitude };
      marker.current.setPosition(pos);
      map.current.panTo(pos);
    }
  }, [value?.latitude, value?.longitude]);

  const useMyLocation = () => {
    if (!navigator.geolocation || !map.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        marker.current?.setPosition(latLng);
        map.current.panTo(latLng);
        applyLocation(latLng, null, true);
      },
      () => {}
    );
  };

  if (mapsReady === false) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Latitude</label>
          <input
            className={inputCls}
            type="number"
            step="any"
            value={value.latitude ?? ""}
            onChange={(e) => onPick?.({ latitude: e.target.value === "" ? null : Number(e.target.value), longitude: value.longitude })}
            placeholder="e.g. 12.9716"
            disabled={disabled}
          />
        </div>
        <div>
          <label className={labelCls}>Longitude</label>
          <input
            className={inputCls}
            type="number"
            step="any"
            value={value.longitude ?? ""}
            onChange={(e) => onPick?.({ latitude: value.latitude, longitude: e.target.value === "" ? null : Number(e.target.value) })}
            placeholder="e.g. 77.5946"
            disabled={disabled}
          />
        </div>
        {!KEY && (
          <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 sm:col-span-2">
            <MapPin size={14} className="shrink-0 text-slate-400" />
            Google Maps key not configured — set <code className="font-semibold">VITE_GOOGLE_MAPS_KEY</code> to enable search &amp; pin on map.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputEl}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location or address…"
            className={`${inputCls} pl-10`}
            disabled={disabled || mapsReady !== true}
          />
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Crosshair size={15} /> Use my location
        </button>
      </div>

      <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-100">
        {mapsReady !== true ? (
          <div className="grid h-full place-items-center bg-slate-50 text-sm text-slate-400">Loading map…</div>
        ) : (
          <div ref={mapEl} className="h-full w-full" />
        )}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur">
          <MapPin size={13} className="text-brand-600" />
          Drag the pin or tap the map to set location
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-50 px-2.5 py-1 font-semibold text-slate-600">
          {value?.latitude != null ? `Lat ${Number(value.latitude).toFixed(6)}` : "Lat —"}
        </span>
        <span className="rounded-full bg-slate-50 px-2.5 py-1 font-semibold text-slate-600">
          {value?.longitude != null ? `Lng ${Number(value.longitude).toFixed(6)}` : "Lng —"}
        </span>
        {search && <span className="min-w-0 flex-1 truncate">{search}</span>}
      </div>
    </div>
  );
}
