/*
 * The MIT License
 *
 * Copyright (c) 2021, Cloudogu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';


angular.module('adf.widget.github').controller('EditController', function (config, $scope, $sce) {
  $scope.accessTokenTooltip = $sce.trustAsHtml('Learn how to create a personal access token on <a href="https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token">github</a>');
  $scope.repositoryPathTooltip = $sce.trustAsHtml('Enter the repository like this: <b>organisation/repositoryname</b> eg. <b>github/gitignore</b>');
  $scope.closeTooltip = function (e) {
    console.log('REEEEEEEEEEEE');
    e.stopPropagation();
  };
});

angular.module('adf.widget.github').directive('onEscape', function () {
  return {
    restrict: 'A',
    scope: {
      fn: '&onEscape'
    },
    link: function(scope, elem, attrs) {
      elem.on('keydown', function (event) {
        if (event.keyCode === 27)
          scope.fn(event);
        scope.$apply();
      });
    }
  };
});


