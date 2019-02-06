const toString = function(content) {
  return JSON.stringify(content);
};

const getFirstElement = source => {
  return source[0];
};

const getUserIdByCookie = function(cookie) {
  const splittedCookie = cookie.split("=");
  return splittedCookie[1];
};

module.exports = { toString, getFirstElement ,getUserIdByCookie};
