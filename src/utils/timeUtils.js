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

export const formatMessageTime = (message) => {
  const messageDate = new Date(message.time);
  const now = new Date();
  const day = String(messageDate.getDate()).padStart(2, "0");
  const month = String(messageDate.getMonth() + 1).padStart(2, "0");
  const year = messageDate.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const todayDate = `${String(now.getDate()).padStart(2, "0")}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${now.getFullYear()}`;
  const resultDate = formattedDate === todayDate ? "TODAY" : formattedDate;

  const hours = String(messageDate.getHours()).padStart(2, "0");
  const minutes = String(messageDate.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  return {
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    message: message.message,
    time: {
      date: resultDate,
      time: time,
    },
  };
};
