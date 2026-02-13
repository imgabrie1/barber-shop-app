export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  },

  multiRemove: (keys: string[]): void => {
    keys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Storage multiRemove error:", error);
      }
    });
  },
};
