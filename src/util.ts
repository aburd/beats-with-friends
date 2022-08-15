export function setNavExpanded(expanded: boolean) {
  const el = document.querySelector(".App") as HTMLDivElement;
  if (expanded) {
    el.classList.add("nav-expanded");
    return
  }
  el.classList.remove("nav-expanded");
}
