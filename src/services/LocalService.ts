const USER_LOCAL = "USER_LOCAL";

export const userLocalStorage = {
  set: (userData: any) => {
    let userJSON = JSON.stringify(userData);
    localStorage.setItem(USER_LOCAL, userJSON);
  },
  get: () => {
    let userJSON = localStorage.getItem(USER_LOCAL);
    if (userJSON) {
      return JSON.parse(userJSON);
    } else {
      return null;
    }
  },
  remove: () => {
    localStorage.removeItem(USER_LOCAL);
  },
};
