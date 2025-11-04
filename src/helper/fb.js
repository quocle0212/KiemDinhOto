import LoadScript from 'load-script';

let initialized = false;
let queue = [];

export function fb(callback) {
  if (initialized) {
    callback(window.FB);
  } else {
    // 622521568333952, 667983873394718
    queue.push(callback);
    if (!window.fbAsyncInit) {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: "667983873394718",
          autoLogAppEvents: true,
          status: true,
          cookie: true,
          xfbml: false,
          version: 'v3.2',
        });
        initialized = true;
        queue.forEach(cb => cb(window.FB));
        queue = null;
      };
      const script = window.localStorage.getItem('fb:debug') === 'true'
        ? 'xfbml.customerchat/debug.js'
        : 'xfbml.customerchat.js';
      LoadScript(`https://connect.facebook.net/en_US/sdk/${script}`, { async: true });
    }
  }
}