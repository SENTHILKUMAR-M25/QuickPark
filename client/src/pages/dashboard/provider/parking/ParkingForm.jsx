import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  X,
  Info,
  MapPin,
  Grid2x2,
  IndianRupee,
  Clock,
  Sparkles,
  ImagePlus,
  Save,
  Plus,
  Trash2,
  Check,
  FileText,
} from "lucide-react";
import providerService from "../../../../services/provider.service";
import { extractErrorMessage } from "../../../../services/api";
import { PARKING_TYPES, SURFACES, VEHICLE_TYPES, AMENITIES, DAYS } from "./meta";
import LocationPicker from "./LocationPicker";
import { Field, ChipGroup, Toggle, inputCls, selectCls, fileToUrl } from "./controls";

const SECTIONS = [
  { id: "basic", label: "Basics", icon: Info },
  { id: "location", label: "Location", icon: MapPin },
  { id: "capacity", label: "Capacity", icon: Grid2x2 },
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "amenities", label: "Amenities", icon: Sparkles },
  { id: "media", label: "Media & Docs", icon: ImagePlus },
];

function DocUpload({ label, existing, file, onChange }) {
  const ref = useRef(null);
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
      >
        <FileText size={15} />
        {file ? file.name : existing ? "Replace file" : "Upload file"}
      </button>
      <input
        ref={ref}
        type="file"
        hidden
        accept="image/*,.pdf"
        onChange={(e) => {
          onChange(e.target.files?.[0] || null);
          e.target.value = "";
        }}
      />
      {!file && existing && (
        <p className="mt-2 truncate text-xs text-slate-400">
          Current: <span className="font-semibold text-slate-500">{existing}</span>
        </p>
      )}
    </div>
  );
}

export default function ParkingForm({ space, onClose, onSaved }) {
  const isEdit = Boolean(space);
  const [section, setSection] = useState("basic");
  const [saving, setSaving] = useState(null);
  const [errors, setErrors] = useState({});
  const imageInputRef = useRef(null);

  const { register, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: {
      parkingName: space?.parkingName || "",
      parkingType: space?.parkingType || "",
      surfaceType: space?.surfaceType || "",
      description: space?.description || "",
      address: space?.address || "",
      area: space?.area || "",
      landmark: space?.landmark || "",
      city: space?.city || "",
      state: space?.state || "",
      country: space?.country || "India",
      pincode: space?.pincode || "",
      latitude: space?.latitude ?? null,
      longitude: space?.longitude ?? null,
      totalCapacity: space?.totalCapacity ?? "",
      availableSlots: space?.availableSlots ?? "",
      slotNumbering: space?.slotNumbering || "",
      pricePerHour: space?.pricePerHour ?? "",
      pricePerDay: space?.pricePerDay ?? "",
      pricePerMonth: space?.pricePerMonth ?? "",
      openTime: space?.openTime || "09:00",
      closeTime: space?.closeTime || "21:00",
      open24Hours: space?.open24Hours || false,
    },
  });

  const initialImages = (space?.images || []).map((url, i) => ({ key: `u${i}`, url, file: null }));
  const [vehicleTypes, setVehicleTypes] = useState(space?.vehicleTypes || []);
  const [amenities, setAmenities] = useState(space?.amenities || []);
  const [availableDays, setAvailableDays] = useState(space?.availableDays || []);
  const [images, setImages] = useState(initialImages);
  const [coverKey, setCoverKey] = useState(() => {
    const idx = (space?.images || []).indexOf(space?.coverImage);
    return idx >= 0 ? `u${idx}` : null;
  });
  const [weekend, setWeekend] = useState({
    saturdayPerHour: space?.weekendPricing?.saturdayPerHour ?? "",
    sundayPerHour: space?.weekendPricing?.sundayPerHour ?? "",
    weekendPerDay: space?.weekendPricing?.weekendPerDay ?? "",
  });
  const [festival, setFestival] = useState({
    name: space?.festivalPricing?.name || "",
    perHour: space?.festivalPricing?.perHour ?? "",
    perDay: space?.festivalPricing?.perDay ?? "",
  });
  const [rulesRows, setRulesRows] = useState(() => {
    const rows = Object.entries(space?.rules || {}).map(([rule, detail], i) => ({
      id: i,
      rule,
      detail: typeof detail === "string" ? detail : "",
    }));
    return rows.length ? rows : [{ id: 0, rule: "", detail: "" }];
  });
  const [proofFile, setProofFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);

  const open24 = watch("open24Hours");
  const coords = watch(["latitude", "longitude"]);

  const handlePick = useCallback(
    ({ latitude, longitude }) => {
      setValue("latitude", latitude, { shouldValidate: true });
      setValue("longitude", longitude, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAddress = useCallback(
    (d) => {
      const g = getValues();
      const patch = {};
      if (!g.address && d.address) patch.address = d.address;
      if (!g.area && d.area) patch.area = d.area;
      if (!g.landmark && d.landmark) patch.landmark = d.landmark;
      if (!g.city && d.city) patch.city = d.city;
      if (!g.state && d.state) patch.state = d.state;
      if (!g.country && d.country) patch.country = d.country;
      if (!g.pincode && d.pincode) patch.pincode = d.pincode;
      Object.entries(patch).forEach(([k, v]) => setValue(k, v, { shouldValidate: true }));
    },
    [getValues, setValue]
  );

  const addFiles = (fileList) => {
    const list = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    const stamp = Date.now();
    const next = [...images, ...list.map((f, i) => ({ key: `n${stamp}-${i}`, url: null, file: f }))];
    setImages(next);
    if (!coverKey) setCoverKey(next[0].key);
  };

  const removeImage = (key) => {
    const next = images.filter((img) => img.key !== key);
    setImages(next);
    if (coverKey === key) setCoverKey(next[0]?.key || null);
  };

  const validate = () => {
    const g = getValues();
    const errs = {};
    if (!g.parkingName?.trim()) errs.parkingName = "Parking name is required";
    if (!g.parkingType) errs.parkingType = "Select a parking type";
    if (!g.surfaceType) errs.surfaceType = "Select a surface type";
    if (!g.address?.trim()) errs.address = "Street address is required";
    if (!g.city?.trim()) errs.city = "City is required";
    if (!g.state?.trim()) errs.state = "State is required";
    if (!g.totalCapacity || Number(g.totalCapacity) < 1) errs.totalCapacity = "Capacity must be at least 1";
    if (g.pricePerHour === "" || g.pricePerHour == null || Number(g.pricePerHour) < 0) {
      errs.pricePerHour = "Price per hour is required";
    }
    if (!vehicleTypes.length) errs.vehicleTypes = "Select at least one vehicle type";
    if (!open24 && (!g.openTime || !g.closeTime)) errs.hours = "Set open & close time when not 24×7";
    if (!images.length) errs.images = "Add at least one photo";
    if (errs.images) setSection("media");
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error("Please fix the highlighted fields.");
      return false;
    }
    return true;
  };

  const buildFormData = (status) => {
    const g = getValues();
    const fd = new FormData();
    const append = (k, v) => {
      if (v !== undefined && v !== null && v !== "") fd.append(k, v);
    };

    append("parkingName", g.parkingName?.trim());
    fd.append("parkingType", g.parkingType);
    fd.append("surfaceType", g.surfaceType);
    append("description", g.description?.trim());
    append("address", g.address?.trim());
    append("area", g.area?.trim());
    append("landmark", g.landmark?.trim());
    fd.append("city", g.city?.trim());
    fd.append("state", g.state?.trim());
    append("country", g.country?.trim());
    append("pincode", g.pincode?.trim());
    if (g.latitude != null && g.latitude !== "") fd.append("latitude", String(g.latitude));
    if (g.longitude != null && g.longitude !== "") fd.append("longitude", String(g.longitude));

    fd.append("totalCapacity", String(g.totalCapacity));
    if (g.availableSlots !== "") fd.append("availableSlots", String(g.availableSlots));
    append("slotNumbering", g.slotNumbering?.trim());
    fd.append("pricePerHour", String(g.pricePerHour));
    if (g.pricePerDay !== "") fd.append("pricePerDay", String(g.pricePerDay));
    if (g.pricePerMonth !== "") fd.append("pricePerMonth", String(g.pricePerMonth));

    if (vehicleTypes.length) fd.append("vehicleTypes", JSON.stringify(vehicleTypes));
    if (amenities.length) fd.append("amenities", JSON.stringify(amenities));
    if (availableDays.length) fd.append("availableDays", JSON.stringify(availableDays));

    fd.append("open24Hours", open24 ? "true" : "false");
    if (!open24) {
      append("openTime", g.openTime);
      append("closeTime", g.closeTime);
    }

    const weekendVals = {};
    for (const k of ["saturdayPerHour", "sundayPerHour", "weekendPerDay"]) {
      if (weekend[k] !== "" && weekend[k] != null) weekendVals[k] = Number(weekend[k]);
    }
    if (Object.keys(weekendVals).length) fd.append("weekendPricing", JSON.stringify(weekendVals));

    const festVals = {};
    if (festival.name?.trim()) festVals.name = festival.name.trim();
    if (festival.perHour !== "" && festival.perHour != null) festVals.perHour = Number(festival.perHour);
    if (festival.perDay !== "" && festival.perDay != null) festVals.perDay = Number(festival.perDay);
    if (Object.keys(festVals).length) fd.append("festivalPricing", JSON.stringify(festVals));

    const rulesObj = {};
    rulesRows.forEach((r) => {
      if (r.rule.trim()) rulesObj[r.rule.trim()] = r.detail.trim();
    });
    if (Object.keys(rulesObj).length) fd.append("rules", JSON.stringify(rulesObj));

    fd.append("status", status);

    const existingUrls = images.filter((i) => i.url).map((i) => i.url);
    const newFiles = images.filter((i) => i.file);
    if (existingUrls.length) fd.append("images", JSON.stringify(existingUrls));
    const coverIdx = images.findIndex((i) => i.key === coverKey);
    if (coverIdx >= 0) fd.append("coverIndex", String(coverIdx));
    newFiles.forEach((i) => fd.append("files", i.file));
    if (proofFile) fd.append("propertyProof", proofFile);
    if (licenseFile) fd.append("parkingLicense", licenseFile);

    return fd;
  };

  const onSubmit = async (status) => {
    if (saving) return;
    if (!validate()) return;
    setSaving(status);
    try {
      const fd = buildFormData(status);
      if (isEdit) await providerService.updateParking(space.id, fd);
      else await providerService.createParking(fd);
      toast.success(isEdit ? "Parking updated." : "Parking space created.");
      onSaved?.();
    } catch (e) {
      toast.error(extractErrorMessage(e));
      setSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-ink">{isEdit ? "Edit Parking Space" : "Add Parking Space"}</h2>
            <p className="text-xs text-slate-400">Fill in the details to list your parking space.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-100 bg-slate-50/60 p-2 md:w-52 md:flex-col md:border-b-0 md:border-r">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-white text-brand-700 shadow-soft"
                      : "text-slate-500 hover:bg-white/70 hover:text-ink"
                  }`}
                >
                  <Icon size={16} className={active ? "text-brand-600" : "text-slate-400"} />
                  {s.label}
                </button>
              );
            })}
          </nav>

          <form onSubmit={handleSubmit(() => {})} className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            {section === "basic" && (
              <div className="grid gap-5">
                <Field label="Parking name" required error={errors.parkingName}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Sunrise Tower Basement Parking"
                    {...register("parkingName")}
                  />
                </Field>

                <Field label="Parking type" required error={errors.parkingType}>
                  <select className={selectCls} {...register("parkingType")}>
                    <option value="">Select type…</option>
                    {PARKING_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Surface type" required error={errors.surfaceType}>
                  <ChipGroup
                    options={SURFACES}
                    value={watch("surfaceType")}
                    onChange={(v) => setValue("surfaceType", v)}
                    multi={false}
                  />
                </Field>

                <Field label="Description" hint="Tell drivers about accessibility, security and approach.">
                  <textarea
                    className={`${inputCls} min-h-24 resize-y`}
                    placeholder="Describe your parking space…"
                    {...register("description")}
                  />
                </Field>
              </div>
            )}

            {section === "location" && (
              <div className="grid gap-5">
                <Field label="Map location">
                  <LocationPicker
                    value={{ latitude: coords[0], longitude: coords[1] }}
                    onPick={handlePick}
                    onAddress={handleAddress}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Street address" required error={errors.address} className="sm:col-span-2">
                    <input className={inputCls} placeholder="House no, street, locality" {...register("address")} />
                  </Field>
                  <Field label="Area / Colony">
                    <input className={inputCls} placeholder="e.g. Koramangala" {...register("area")} />
                  </Field>
                  <Field label="Landmark">
                    <input className={inputCls} placeholder="Near…" {...register("landmark")} />
                  </Field>
                  <Field label="City" required error={errors.city}>
                    <input className={inputCls} placeholder="e.g. Bengaluru" {...register("city")} />
                  </Field>
                  <Field label="State" required error={errors.state}>
                    <input className={inputCls} placeholder="e.g. Karnataka" {...register("state")} />
                  </Field>
                  <Field label="Country">
                    <input className={inputCls} {...register("country")} />
                  </Field>
                  <Field label="Pincode">
                    <input className={inputCls} placeholder="560001" {...register("pincode")} />
                  </Field>
                </div>
              </div>
            )}

            {section === "capacity" && (
              <div className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Total capacity" required error={errors.totalCapacity}>
                    <input className={inputCls} type="number" min="1" placeholder="e.g. 20" {...register("totalCapacity")} />
                  </Field>
                  <Field label="Currently available slots" hint="Defaults to full capacity on create.">
                    <input className={inputCls} type="number" min="0" placeholder="Auto" {...register("availableSlots")} />
                  </Field>
                </div>

                <Field label="Slot numbering" hint="Optional — describe slot labels, e.g. B1–B20.">
                  <input className={inputCls} placeholder="e.g. B1 to B20" {...register("slotNumbering")} />
                </Field>

                <Field label="Vehicle types" required error={errors.vehicleTypes}>
                  <ChipGroup options={VEHICLE_TYPES} value={vehicleTypes} onChange={setVehicleTypes} />
                </Field>
              </div>
            )}

            {section === "pricing" && (
              <div className="grid gap-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Price / hour (₹)" required error={errors.pricePerHour}>
                    <input className={inputCls} type="number" min="0" placeholder="40" {...register("pricePerHour")} />
                  </Field>
                  <Field label="Price / day (₹)">
                    <input className={inputCls} type="number" min="0" placeholder="Optional" {...register("pricePerDay")} />
                  </Field>
                  <Field label="Price / month (₹)">
                    <input className={inputCls} type="number" min="0" placeholder="Optional" {...register("pricePerMonth")} />
                  </Field>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="mb-3 text-sm font-bold text-ink">Weekend pricing (optional)</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Saturday (₹/hr)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0"
                        value={weekend.saturdayPerHour}
                        onChange={(e) => setWeekend({ ...weekend, saturdayPerHour: e.target.value })}
                      />
                    </Field>
                    <Field label="Sunday (₹/hr)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0"
                        value={weekend.sundayPerHour}
                        onChange={(e) => setWeekend({ ...weekend, sundayPerHour: e.target.value })}
                      />
                    </Field>
                    <Field label="Weekend day pass (₹)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0"
                        value={weekend.weekendPerDay}
                        onChange={(e) => setWeekend({ ...weekend, weekendPerDay: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="mb-3 text-sm font-bold text-ink">Festival pricing (optional)</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Festival name">
                      <input
                        className={inputCls}
                        placeholder="e.g. Diwali"
                        value={festival.name}
                        onChange={(e) => setFestival({ ...festival, name: e.target.value })}
                      />
                    </Field>
                    <Field label="Rate (₹/hr)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0"
                        value={festival.perHour}
                        onChange={(e) => setFestival({ ...festival, perHour: e.target.value })}
                      />
                    </Field>
                    <Field label="Day pass (₹)">
                      <input
                        className={inputCls}
                        type="number"
                        min="0"
                        value={festival.perDay}
                        onChange={(e) => setFestival({ ...festival, perDay: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {section === "hours" && (
              <div className="grid gap-5">
                <div className="rounded-2xl border border-slate-100 p-4">
                  <Toggle
                    checked={open24}
                    onChange={(v) => setValue("open24Hours", v)}
                    label="Open 24×7"
                    description="Available round the clock with no time restriction."
                  />
                </div>
                {!open24 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Opens at" error={errors.hours}>
                      <input className={inputCls} type="time" {...register("openTime")} />
                    </Field>
                    <Field label="Closes at" error={errors.hours}>
                      <input className={inputCls} type="time" {...register("closeTime")} />
                    </Field>
                  </div>
                )}
                <Field label="Available days" hint="Leave empty for every day.">
                  <ChipGroup options={DAYS} value={availableDays} onChange={setAvailableDays} />
                </Field>
              </div>
            )}

            {section === "amenities" && (
              <div className="grid gap-6">
                <Field label="Amenities">
                  <ChipGroup options={AMENITIES} value={amenities} onChange={setAmenities} />
                </Field>

                <div>
                  <p className="mb-2 text-sm font-bold text-ink">Rules</p>
                  <div className="grid gap-3">
                    {rulesRows.map((row, idx) => (
                      <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <input
                          className={inputCls}
                          placeholder="Rule, e.g. No overnight parking"
                          value={row.rule}
                          onChange={(e) =>
                            setRulesRows(rulesRows.map((r) => (r.id === row.id ? { ...r, rule: e.target.value } : r)))
                          }
                        />
                        <input
                          className={inputCls}
                          placeholder="Detail (optional)"
                          value={row.detail}
                          onChange={(e) =>
                            setRulesRows(rulesRows.map((r) => (r.id === row.id ? { ...r, detail: e.target.value } : r)))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setRulesRows(rulesRows.filter((r) => r.id !== row.id))}
                          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:text-red-500"
                          disabled={rulesRows.length === 1 && idx === 0}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setRulesRows([...rulesRows, { id: Date.now(), rule: "", detail: "" }])
                    }
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    <Plus size={15} /> Add rule
                  </button>
                </div>
              </div>
            )}

            {section === "media" && (
              <div className="grid gap-6">
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Photos <span className="ml-0.5 text-red-400">*</span>
                    <span className="ml-2 font-medium normal-case text-slate-300">min 1 · click a photo to set as cover</span>
                  </p>
                  {errors.images && <p className="mb-2 text-xs font-medium text-red-500">{errors.images}</p>}
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {images.map((img) => {
                      const src = img.file ? fileToUrl(img.file) : img.url;
                      const isCover = coverKey === img.key;
                      return (
                        <button
                          key={img.key}
                          type="button"
                          onClick={() => setCoverKey(img.key)}
                          className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition ${
                            isCover ? "border-brand-600" : "border-transparent hover:border-brand-300"
                          }`}
                        >
                          <img src={src} alt="parking" className="h-full w-full object-cover" />
                          <span
                            className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isCover ? "bg-brand-600 text-white" : "bg-white/80 text-slate-500"
                            }`}
                          >
                            {isCover ? "Cover" : "Set cover"}
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(img.key);
                            }}
                            className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink/50 text-white opacity-0 transition group-hover:opacity-100"
                          >
                            <X size={12} />
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="grid aspect-[4/3] place-items-center rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition hover:border-brand-300 hover:text-brand-600"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <ImagePlus size={20} />
                        <span className="text-xs font-semibold">Add photos</span>
                      </div>
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DocUpload label="Property proof" existing={space?.propertyProof} file={proofFile} onChange={setProofFile} />
                  <DocUpload label="Parking license" existing={space?.parkingLicense} file={licenseFile} onChange={setLicenseFile} />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-2 border-t border-slate-100 bg-white px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => onSubmit("DRAFT")}
              disabled={saving !== null}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 disabled:opacity-50"
            >
              <Save size={15} />
              {saving === "DRAFT" ? "Saving…" : isEdit ? "Save as draft" : "Save as draft"}
            </button>
            <button
              type="button"
              onClick={() => onSubmit("ACTIVE")}
              disabled={saving !== null}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-700 disabled:opacity-50"
            >
              {saving === "ACTIVE" ? (
                "Publishing…"
              ) : (
                <>
                  <Check size={15} /> {isEdit ? "Publish changes" : "Publish"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
