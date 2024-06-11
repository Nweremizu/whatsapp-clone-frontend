const DateFormatter = (time, type = "Date") => {
  const date = new Date(time);
  if (type === "Date") {
    if (Date.now() - date < 86400000) {
      return new Date(time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    });
  } else {
    if (Date.now() - date < 86400000) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
      });
    }
  }
};

export default DateFormatter;
