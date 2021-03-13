/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./sw.js",['./workbox-f0e3ab47'], function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.skipWaiting();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "assets/128.png",
    "revision": "04d54e742fb103b5dd618c2842124913"
  }, {
    "url": "assets/192.png",
    "revision": "3678dc75ec0c9e2fe4569d3feb9bdc20"
  }, {
    "url": "assets/512.png",
    "revision": "9eb47f270ad4b3cc1ba7458a94856003"
  }, {
    "url": "assets/keyboard.png",
    "revision": "67066f0231ad7ae427707b371f2d5c17"
  }, {
    "url": "build/bundle.css",
    "revision": "e1546194e10d81a4ca66c9aee7c388bb"
  }, {
    "url": "build/bundle.js",
    "revision": "9432384bfada82d09fbb44ce8dc2f2fd"
  }, {
    "url": "favicon.png",
    "revision": "20316ee777424ccaa6046966f96c545e"
  }, {
    "url": "global.css",
    "revision": "ab1f210436bd9ab8f7b734f9334c1fa3"
  }, {
    "url": "index.html",
    "revision": "cb358f28e061e4c7fac249ffabbe5128"
  }, {
    "url": "manifest.json",
    "revision": "b0e7d9850abc6532af0ffea183378865"
  }], {});

});
//# sourceMappingURL=sw.js.map
