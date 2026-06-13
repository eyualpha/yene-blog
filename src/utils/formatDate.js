export const formatDate = (value) => {
  if (!value) return "";

  let date;
  if (typeof value === "string") {
    date = new Date(value);
  } else if (value?.toDate) {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
