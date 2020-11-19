

// TODO: remove when ant design's new fix gets released
// track https://github.com/ant-design/ant-design/issues/27658#issuecomment-723954128
// @ts-ignore
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};