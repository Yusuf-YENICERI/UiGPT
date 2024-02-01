export const isEmptyObjectLocDb = (value:object) => {
  if (typeof value == 'object' && Object.keys (value).length == 0) {
    return true;
  }

  return false;
};
