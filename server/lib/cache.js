module.exports = () =>
  (
    (cache) =>
      (key, str) =>
        key === true
          ? cache = {}
          : str
            ? cache[key] = str
            : key[str]
  )({})

