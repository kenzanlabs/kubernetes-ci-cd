/* eslint import/no-extraneous-dependencies: 0 */

import browserEnv from 'browser-env';

browserEnv(['document', 'window', 'navigator']);

/*
** Fix required for testing bug with react-slick
** https://github.com/akiran/react-slick/issues/93
*/
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  };
};
