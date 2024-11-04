export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "denied") {
            reject(new Error("Please allow location access."));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        });
    } else {
      reject(new Error("Geolocation is not supported in your browser."));
    }
  });
};
