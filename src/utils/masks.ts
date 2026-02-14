export const maskPhone = (value: string) => {
  if (!value) return "";
  const phoneNumber = value.replace(/\D/g, "");
  return phoneNumber
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

export const unmaskPhone = (value: string) => {
  return value.replace(/\D/g, "");
};
