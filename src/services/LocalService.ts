const USER_LOCAL = "USER_LOCAL";

export const userLocalStorage = {
  set: (userData: any) => localStorage.setItem(USER_LOCAL, JSON.stringify(userData)),
  get: () => JSON.parse(localStorage.getItem(USER_LOCAL) || "null"),
  remove: () => localStorage.removeItem(USER_LOCAL),
};
