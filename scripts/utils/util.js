module.exports.getDate = function (date) {
  if (typeof date === "string") {
    date = new Date(date);
  }

  function paddingZero(number) {
    if (number < 10) return `0${number}`;

    return `${number}`;
  }

  return `${date.getFullYear()}-${paddingZero(
    date.getMonth() + 1
  )}-${paddingZero(date.getDate())}`;
};
