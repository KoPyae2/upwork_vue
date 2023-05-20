import moment from "moment";

export function dateFormat(dtime) {
  return moment.unix(dtime).format("YYYY-MM-DD HH:mm");
}

export function dateSecFormat(dtime) {
  return moment.unix(dtime).format("YYYY-MM-DD HH:mm:ss");
}

export function originalDate(dtime) {
  return moment.parseZone(dtime).format("YYYY-MM-DD HH:mm");
}
export function DateOnly(dtime) {
  return moment.parseZone(dtime).format("YYYY-MM-DD");
}
export function fromNowFormat(dtime) {
  return moment.parseZone(dtime).from();
}

const pluralize = (count, noun, suffix = "s ") =>
  `${noun}${count !== 1 ? suffix : " "}`;

export function farFrom(start, end) {
  let difference = Math.abs(end - start);

  let days = Math.floor(difference / 86400);
  difference -= days * 86400;

  let hours = Math.floor(difference / 3600) % 24;
  difference -= hours * 3600;

  let minutes = Math.floor(difference / 60) % 60;
  difference -= minutes * 60;

  let seconds = difference % 60;

  let result_day = days > 0 ? days + "日 " : "";
  let result_hour = hours > 0 ? hours + "时 " : "";
  let result_minutes = minutes > 0 ? minutes + "分 " : "";
  let result_seconds = seconds > 0 ? seconds + "秒 " : "";

  let result = result_day + result_hour + result_minutes + result_seconds;

  return result;
}
