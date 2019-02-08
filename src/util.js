const toString = function(content) {
  return JSON.stringify(content);
};

const extractFirstElement = function(record) {
  return record[0];
};
const getUserIdByCookie = function(cookie) {
  const splittedCookie = cookie.split("=");
  return splittedCookie[1];
};

module.exports = { toString, extractFirstElement ,getUserIdByCookie};
