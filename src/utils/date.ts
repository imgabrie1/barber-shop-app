/**
 * @param dateInput - string ISO ou objeto Date
 * @param includeTime - se deve ou não incluir o "às HH:MM"
 */
export const formatAppointmentDate = (dateInput: string | Date, includeTime = false): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  let dayLabel = "";

  if (checkDate.getTime() === today.getTime()) {
    dayLabel = "Hoje";
  } else if (checkDate.getTime() === tomorrow.getTime()) {
    dayLabel = "Amanhã";
  } else {
    const day = date.getDate();
    const month = date.toLocaleDateString("pt-BR", { month: "long" });
    const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
    const formatted = `${weekday}, ${day} de ${month}`;
    dayLabel = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  if (includeTime) {
    const time = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dayLabel} às ${time}`;
  }

  return dayLabel;
};