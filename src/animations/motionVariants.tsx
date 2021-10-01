const crossfadeAnimation = {
  first: {
    opacity: 0,
  },
  second: {
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.5,
    },
  },
};

const elevationEffect = {
  first: {
    opacity: 0,
    y: 50,
  },
  second: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      delay: 0.5,
    },
  },
};

export { crossfadeAnimation, elevationEffect };
