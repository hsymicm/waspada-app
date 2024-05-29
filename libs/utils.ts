export const scrollTop = (ref: any) => {
  if (ref?.current) {
    ref.current?.scrollTo({
      options: { y: 0 },
    })
  }
}

export const handleAuthErrorMessage = (message?: string) => {
  const defaultMsg = "Error, something wrong happened";

  if (!message) {
    return defaultMsg;
  }

  const parts = message.split("/")

  if (parts[0] !== "auth") {
    return defaultMsg;
  }

  const str = parts[1].replaceAll("-", " ")
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatRatingCounter = (count: number) => {
  if (count >= 1000000) {
      const millions = Math.floor(count / 1000000);
      const remainder = Math.floor((count % 1000000) / 100000);
      return `${millions}.${remainder}M`;
  } else if (count >= 1000) {
      const thousands = Math.floor(count / 1000);
      const remainder = Math.floor((count % 1000) / 100);
      return `${thousands}.${remainder}K`;
  } else {
      return count.toString();
  }
}

export const formatElapsedTime = (timestamp: any) => {
  const current = new Date();
  const timestampDate = timestamp.toDate();
  const elapsedTime = current - timestampDate;
  const seconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days} hari yang lalu`; // "x days ago"
  } else if (hours >= 1) {
      return `${hours} jam yang lalu`; // "x hours ago"
  } else if (minutes >= 1) {
      return `${minutes} menit yang lalu`; // "x minutes ago"
  } else {
      return "Baru saja"; // "Just now" for less than a minute
  }
}
