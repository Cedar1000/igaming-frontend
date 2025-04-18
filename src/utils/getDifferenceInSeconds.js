function getTimeDifferenceInSeconds(date1, date2) {
  // Convert both dates to milliseconds since the Unix epoch
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = time1 - time2;

  // Convert milliseconds to seconds
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

  return differenceInSeconds;
}

export default getTimeDifferenceInSeconds;
