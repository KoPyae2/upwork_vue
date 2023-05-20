//author by jack
export function checkPermissions(permission) {
  let permissions = JSON.parse(localStorage.getItem("permissions"));

  // if (permissions) {
  //   return permissions.includes(permission);
  // }
  return true
}
