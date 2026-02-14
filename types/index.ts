// Domain types barrel export
//
// Note: Attachment is defined in transport.ts, activity.ts, and accommodation.ts.
// We only export it once (from transport.ts) to avoid duplicate export errors.
// The interfaces are identical across all three files.

export * from "./trip";
export * from "./transport";

// Re-export everything from accommodation EXCEPT Attachment
export {
  type AccommodationType,
  type Accommodation,
  type AccommodationFormData,
  ACCOMMODATION_TYPES,
  ACCOMMODATION_ICONS,
  ACCOMMODATION_COLORS,
  getEmptyAccommodationForm,
  getAccommodationNights,
  createAccommodation,
} from "./accommodation";

// Re-export everything from activity EXCEPT Attachment
export {
  type ActivityType,
  type PaymentStatus,
  type Activity,
  type ActivityFormData,
  ACTIVITY_TYPES,
  ACTIVITY_ICONS,
  ACTIVITY_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  getEmptyActivityForm,
  getEstimatedDuration,
  formatDuration,
  createActivity,
} from "./activity";

export * from "./expense";
export * from "./checklist";
export * from "./note";
