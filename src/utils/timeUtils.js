export const calculateTimeDifferences = (list, property) => {
    const currentTime = new Date();
    return list.map((item) => {
      const apiDate = new Date(item[property]);
      const timeDifference = currentTime.getTime() - apiDate.getTime();
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
  
      let formattedTime;
  
      if (timeDifference < 60000) {
        formattedTime = `now`;
      } else if (timeDifference < 3600000) {
        formattedTime = `${minutes} minutes ago`;
      } else if (timeDifference < 86400000) {
        formattedTime = `${hours} hours ago`;
      } else if (timeDifference < 2592000000) {
        formattedTime = `${days} days ago`;
      } else {
        const day = apiDate.getUTCDate();
        const month = apiDate.getUTCMonth() + 1;
        const year = apiDate.getUTCFullYear();
        formattedTime = `${year}/${month}/${day}`; // yyyy/mm/dd
      }
  
      return formattedTime;
    });
  };