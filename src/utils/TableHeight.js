export function getTableHeight(data) {
  const element = document.getElementById(data);
  let text = element.getBoundingClientRect().top;
  return window.innerHeight - text - 60 - 70;
}
