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
    "url": "assets/help/beginning/manual_button.png",
    "revision": "7032d5777dd74d16505bdd934e6ac060"
  }, {
    "url": "assets/help/beginning/manual_left_menu.png",
    "revision": "6c107fc9e5e8b5b169357d026f75a15b"
  }, {
    "url": "assets/help/beginning/snake.png",
    "revision": "9db384fc18bf4977e660f5189bbcb5e2"
  }, {
    "url": "assets/help/code_editor/code_editor.png",
    "revision": "b0bbab9f8e02088a874b4509259ac098"
  }, {
    "url": "assets/help/memory/jump_to_offset.png",
    "revision": "bf2ab2687bc1ec05ece88991b6d793e7"
  }, {
    "url": "assets/help/memory/memory_editing.png",
    "revision": "441aafe7a8b437691a4ff5b17fc3e86b"
  }, {
    "url": "assets/help/memory/memory.png",
    "revision": "55ba1be97f472eb748000d00cdc20e64"
  }, {
    "url": "assets/help/memory/selected.png",
    "revision": "d6c113bd6d4e60c6370fb6ae610982d3"
  }, {
    "url": "assets/help/projects/available_project.png",
    "revision": "f76f93c704a8a0ffeb841e66c9d13e99"
  }, {
    "url": "assets/help/projects/create_new_project.png",
    "revision": "4a4b45138015ee953c4fb283133243ff"
  }, {
    "url": "assets/help/projects/delete.png",
    "revision": "2ec332e7fab93d1256a977fd00dd0a96"
  }, {
    "url": "assets/help/projects/download_all.png",
    "revision": "53c53843dd683e2e25a8135eb3a745bb"
  }, {
    "url": "assets/help/projects/download.png",
    "revision": "f667ad277a2bc4fc9132b0fef3681881"
  }, {
    "url": "assets/help/projects/drag_and_drop.png",
    "revision": "dc3a3c792d4bcce973fdf388d46684cd"
  }, {
    "url": "assets/help/projects/navigation_placement.png",
    "revision": "f69ed45c8d1c61260512db6ba2e23c09"
  }, {
    "url": "assets/help/projects/opened_project.png",
    "revision": "7b7aad205b66369fb974e3db7055b4cc"
  }, {
    "url": "assets/help/projects/projects.png",
    "revision": "3c106799bbd1944cd644e57bd698faa4"
  }, {
    "url": "assets/help/projects/rename.png",
    "revision": "911db12d277aab4c730610f84ef22a44"
  }, {
    "url": "assets/help/registers/registers.png",
    "revision": "134552d9b86cb684d54a3a0a57ed0dd3"
  }, {
    "url": "assets/help/running_program/breakpoint.png",
    "revision": "833680a577bd5df07bc2d35e99e1e622"
  }, {
    "url": "assets/help/running_program/reset.png",
    "revision": "37b23b70834d528c67b6cb7063acabb5"
  }, {
    "url": "assets/help/running_program/run.png",
    "revision": "d89704a9346f38032407b22f62e15106"
  }, {
    "url": "assets/help/running_program/runBack.png",
    "revision": "543e824cd9e095cf1cc819765f68dc52"
  }, {
    "url": "assets/help/running_program/step_hover.png",
    "revision": "589e551ddeee7ef5b2d97fc11ad1dbd7"
  }, {
    "url": "assets/help/running_program/step.png",
    "revision": "ac470f8d52a4215ae8ccb00a649cb45a"
  }, {
    "url": "assets/help/running_program/stepBack.png",
    "revision": "dea36d152948d5addc1ccd44ac3a7af5"
  }, {
    "url": "assets/help/running_program/tutorial_left_navigation.png",
    "revision": "7cd5191543cc0131e2fe244a9580cb65"
  }, {
    "url": "assets/help/running_program/unsaved_changes.png",
    "revision": "041759942bb850775e1af1bc5a3c7f89"
  }, {
    "url": "assets/help/screen/screen_result.png",
    "revision": "527935144a4613dfc2686b49c46ac192"
  }, {
    "url": "assets/help/screen/screen_write.png",
    "revision": "26b7074ad5f1b8c5702eaf57147aba82"
  }, {
    "url": "assets/help/screen/screen.png",
    "revision": "a828dff2b14964e559fdb16de175e93b"
  }, {
    "url": "assets/help/screen/windows_color.png",
    "revision": "cc06bcb9d015d706b8706168aebf4064"
  }, {
    "url": "assets/help/settings/animations.png",
    "revision": "4c601ba13044aab50075c422c499d337"
  }, {
    "url": "assets/help/settings/checkbox_dark_theme.png",
    "revision": "3b624deab59b8f9bb238896a8f6c9d5d"
  }, {
    "url": "assets/help/settings/light_dark_theme.png",
    "revision": "2b632874780f950ef0c3a47ed3e220c7"
  }, {
    "url": "assets/help/settings/placement.png",
    "revision": "949b8b8790049f76467d6ed06b470fc9"
  }, {
    "url": "assets/help/settings/project_settings.png",
    "revision": "31e441a27113de3284f00f5f7e3080ca"
  }, {
    "url": "assets/help/settings/reset_all.png",
    "revision": "1a0126f8485e97e236f7c2c71f375475"
  }, {
    "url": "assets/help/settings/reset_projects.png",
    "revision": "18158a2f1f5352bc24a2200d2a962faf"
  }, {
    "url": "assets/help/tutorial/hidden_modules_in_tutorial.png",
    "revision": "f5d8575d286e44f3826b568326e08aba"
  }, {
    "url": "assets/help/tutorial/tutorial_code_editor.png",
    "revision": "0d8cbdbb5a80aef62651ebe7a8a5d41a"
  }, {
    "url": "assets/keyboard.png",
    "revision": "67066f0231ad7ae427707b371f2d5c17"
  }, {
    "url": "build/bundle.css",
    "revision": "70f6aa4c559a12570de60293eb08147b"
  }, {
    "url": "build/bundle.js",
    "revision": "419c35581174286830b3d060ce66d738"
  }, {
    "url": "favicon.png",
    "revision": "20316ee777424ccaa6046966f96c545e"
  }, {
    "url": "global.css",
    "revision": "6b2700c9d87d1a40d32568f240662c84"
  }, {
    "url": "index.html",
    "revision": "be155a93e12e1d32a5bb4e5d1d832f7e"
  }, {
    "url": "manifest.json",
    "revision": "3dcc849f25c3b28c54292077bfabbaef"
  }], {});

});
//# sourceMappingURL=sw.js.map
