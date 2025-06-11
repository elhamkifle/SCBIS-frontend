module.exports = new Proxy(
  {},
  {
    get: () => {
      return () => null; // return null component for each icon
    },
  }
);
