(function(window, undefined) {'use strict';
/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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




RegisterWidgets.$inject = ["dashboardProvider"];
GithubService.$inject = ["$q", "$http", "githubApiUrl"];
GithubIssuesController.$inject = ["config", "issues"];
GithubHistoryController.$inject = ["$filter", "config", "commits"];
GithubEventsController.$inject = ["config", "events"];
GithubCommitsController.$inject = ["config", "commits"];
GithubAuthorController.$inject = ["config", "commits"];
function RegisterWidgets(dashboardProvider) {
  // template object for github widgets
  var widget = {
    reload: true,
    category: 'GitHub',
    controllerAs: 'vm',
    edit: {
      controller: 'EditController',
      templateUrl: '{widgetsPath}/github/src/edit.html'
    }
  };

  var commitWidgets = angular.extend({
    resolve: {
      /* @ngInject */
      commits: ["github", "config", function (github, config) {
        if (config.path) {
          return github.getCommits(config);
        }
      }]
    }
  }, widget);

  // register github template by extending the template object
  dashboardProvider
    .widget('githubHistory', angular.extend({
      title: 'GitHub History',
      description: 'Displays the commit history of a GitHub project as chart',
      controller: 'GithubHistoryController',
      templateUrl: '{widgetsPath}/github/src/line-chart.html'
    }, commitWidgets))
    .widget('githubAuthor', angular.extend({
      title: 'GitHub Author',
      description: 'Displays the commits per author as pie chart',
      controller: 'GithubAuthorController',
      templateUrl: '{widgetsPath}/github/src/pie-chart.html'
    }, commitWidgets))
    .widget('githubCommits', angular.extend({
      title: 'GitHub Commits',
      description: 'Displays the commits of a GitHub project',
      controller: 'GithubCommitsController',
      templateUrl: '{widgetsPath}/github/src/commits.html'
    }, commitWidgets))
    .widget('githubIssues', angular.extend({
      title: 'GitHub Issues',
      description: 'Displays the issues of a GitHub project',
      controller: 'GithubIssuesController',
      templateUrl: '{widgetsPath}/github/src/issues.html',
      resolve: {
        /* @ngInject */
        issues: ["github", "config", function (github, config) {
          if (config.path) {
            return github.getIssues(config);
          }
        }]
      }
    }, widget))
    .widget('githubUserEvents', {
      title: 'GitHub User Events',
      description: 'Displays events of a certain user',
      category: 'GitHub',
      controller: 'GithubEventsController',
      controllerAs: 'vm',
      templateUrl: '{widgetsPath}/github/src/events.user.html',
      reload: true,
      edit: {
        controller: 'EditController',
        templateUrl: '{widgetsPath}/github/src/events.user.edit.html'
      },
      resolve: {
        events: ["github", "config", function (github, config) {
          if (config.user) {
            return github.getUserEvents(config);
          }
        }]
      }
    })
    .widget('githubOrganisationEvents', {
      title: 'GitHub Organisation Events',
      description: 'Displays events of a public organisation',
      category: 'GitHub',
      controller: 'GithubEventsController',
      controllerAs: 'vm',
      templateUrl: '{widgetsPath}/github/src/events.org.html',
      reload: true,
      edit: {
        controller: 'EditController',
        templateUrl: '{widgetsPath}/github/src/events.org.edit.html'
      },
      resolve: {
        events: ["github", "config", function (github, config) {
          if (config.org) {
            return github.getOrgaEvents(config);
          }
        }]
      }
    })
    .widget('githubRepoEvents', {
      title: 'GitHub Repository Events',
      description: 'Displays events of a certain repository',
      category: 'GitHub',
      controller: 'GithubEventsController',
      controllerAs: 'vm',
      templateUrl: '{widgetsPath}/github/src/events.repo.html',
      reload: true,
      edit: {
        controller: 'EditController',
        templateUrl: '{widgetsPath}/github/src/events.repo.edit.html'
      },
      resolve: {
        events: ["github", "config", function (github, config) {
          if (config.path) {
            return github.getRepoEvents(config);
          }
        }]
      }
    });
}

angular
  .module('adf.widget.github', ['adf.provider', 'chart.js'])
  .value('githubApiUrl', 'https://api.github.com/')
  .config(RegisterWidgets);

angular.module("adf.widget.github").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/github/src/commits.html","<div on-escape=closeTooltip(e)><div ng-if=!vm.commits class=\"alert alert-info\">Please configure the widget</div><div ng-if=config.path><ul class=media-list><li class=media ng-repeat=\"commit in vm.commits\"><div class=media-left><a href={{commit.author.html_url}} target=_blank><img class=\"media-object img-thumbnail\" ng-src={{commit.author.avatar_url}} style=\"width: 64px; height: 64px;\"></a></div><div class=media-body><h4 class=media-heading><a href={{commit.html_url}} target=_blank>{{commit.sha | limitTo: 12}}</a></h4><p>{{commit.commit.message | limitTo: 128}}</p><small><a href={{commit.author.html_url}} target=_blank>{{commit.commit.author.name}}</a>, {{commit.commit.author.date | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/github/src/edit.html","<form role=form><div class=form-group><label for=path>Github Repository Path</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"repositoryPathtooltipIsOpen = !repositoryPathtooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=repositoryPathtooltipIsOpen ng-mouseenter=\"repositoryPathtooltipIsOpen = !repositoryPathtooltipIsOpen\" uib-tooltip-html=repositoryPathTooltip tooltip-placement=top aria-label=\"Repository Path Tooltip\"></span> <input type=text class=form-control id=path ng-model=config.path placeholder=\"Enter Path (username/reponame)\" required></div><div class=form-group><label for=path>Access Token</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"accessTokenTooltipIsOpen = !accessTokenTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=accessTokenTooltipIsOpen ng-mouseenter=\"accessTokenTooltipIsOpen = !accessTokenTooltipIsOpen\" uib-tooltip-html=accessTokenTooltip tooltip-placement=top aria-label=\"Access Token Tooltip\"></span> <input type=text class=form-control id=path ng-model=config.accessToken required></div></form>");
$templateCache.put("{widgetsPath}/github/src/events.org.edit.html","<form role=form><div class=form-group><label for=path>Organisation</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"organisationTooltipIsOpen = !organisationTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=organisationTooltipIsOpen ng-mouseenter=\"organisationTooltipIsOpen = !organisationTooltipIsOpen\" uib-tooltip=\"Enter the github-organisation whose git events you want to display, e.g. cloudogu.\" tooltip-placement=top aria-label=\"Enter the github-organisation whose git events you want to display, e.g. cloudogu.\"></span> <input type=text class=form-control id=path ng-model=config.org placeholder=\"Enter Organisation\" required></div><div class=form-group><label for=path>Access Token</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"accessTokenTooltipIsOpen = !accessTokenTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=accessTokenTooltipIsOpen ng-mouseenter=\"accessTokenTooltipIsOpen = true\" uib-tooltip-html=accessTokenTooltip tooltip-placement=top aria-label=\"Access Token Tooltip\"></span> <input type=text class=form-control id=path ng-model=config.accessToken required></div></form>");
$templateCache.put("{widgetsPath}/github/src/events.org.html","<div><div ng-if=!config.org class=\"alert alert-info\">Please configure the widget</div><div ng-if=config.org><ul class=media-list><li class=media ng-repeat=\"event in vm.events\"><div class=media-left><a href={{event.userUrl}} target=_blank><img class=\"media-object img-thumbnail\" ng-src={{event.userImage}} style=\"width: 64px; height: 64px;\"></a></div><div class=media-body><h4 class=media-heading><a href={{event.userUrl}} target=_blank>{{event.actor.login}}</a> <span>{{event.messageAction | limitTo: 128}} <a href={{event.linkElementOne}}>{{event.messageElementOne}}</a></span> <span ng-if=event.messageElementTwo>at <a href={{event.linkElementTwo}}>{{event.messageElementTwo}}</a></span></h4><p ng-if=event.comments ng-repeat=\"comment in event.comments | limitTo:2\"><a ng-if=comment.link href={{comment.link}}>{{comment.id | limitTo: 7}}&nbsp;</a> <span>{{comment.message | limitTo: 128}}</span></p><small><a href={{event.userUrl}} target=_blank>{{event.actor.login}}</a>, {{event.created_at | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/github/src/events.repo.edit.html","<form role=form><div class=form-group><label for=path>Github Repository Path</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"repositoryPathtooltipIsOpen = !repositoryPathtooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=repositoryPathtooltipIsOpen ng-mouseenter=\"repositoryPathtooltipIsOpen = !repositoryPathtooltipIsOpen\" uib-tooltip-html=repositoryPathTooltip tooltip-placement=top aria-label=\"Repository Path Tooltip\"></span> <input type=text class=form-control id=path ng-model=config.path placeholder=\"Enter Path (owner/reponame)\" required></div><div class=form-group><label for=path>Access Token</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"accessTokenTooltipIsOpen = !accessTokenTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=accessTokenTooltipIsOpen ng-mouseenter=\"accessTokenTooltipIsOpen = true\" uib-tooltip-html=accessTokenTooltip tooltip-placement=top aria-label=\"Access Token Tooltip\"></span> <input type=text class=form-control id=path ng-model=config.accessToken required></div></form>");
$templateCache.put("{widgetsPath}/github/src/events.repo.html","<div><div ng-if=!config.path class=\"alert alert-info\">Please configure the widget</div><div ng-if=config.path><ul class=media-list><li class=media ng-repeat=\"event in vm.events\"><div class=media-left><a href={{event.userUrl}} target=_blank><img class=\"media-object img-thumbnail\" ng-src={{event.userImage}} style=\"width: 64px; height: 64px;\"></a></div><div class=media-body><h4 class=media-heading><a href={{event.userUrl}} target=_blank>{{event.actor.login}}</a> <span>{{event.messageAction | limitTo: 128}}<a href={{event.linkElementOne}}>{{event.messageElementOne}}</a></span> <span ng-if=event.messageElementTwo>at <a href={{event.linkElementTwo}}>{{event.messageElementTwo}}</a></span></h4><p ng-if=event.comments ng-repeat=\"comment in event.comments | limitTo:2\"><a ng-if=comment.link href={{comment.link}}>{{comment.id | limitTo: 7}}</a> <span>{{comment.message | limitTo: 128}}</span></p><small><a href={{event.userUrl}} target=_blank>{{event.actor.login}}</a>, {{event.created_at | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/github/src/events.user.edit.html","<form role=form><div class=form-group><label for=path>User Name</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"userNameTooltipIsOpen = !userNameTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=userNameTooltipIsOpen ng-mouseenter=\"userNameTooltipIsOpen = !userNameTooltipIsOpen\" uib-tooltip=\"Enter the github-user whose git events you want to display.\" tooltip-placement=top aria-label=\"Enter the github-user whose git events you want to display.\"></span> <input type=text class=form-control id=path ng-model=config.user placeholder=\"Enter User (username)\" required></div><div class=form-group><label for=path>Organisation</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"organisationTooltipIsOpen = !organisationTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=organisationTooltipIsOpen ng-mouseenter=\"organisationTooltipIsOpen = !organisationTooltipIsOpen\" uib-tooltip=\"Optional. Enter the github-organisation whose git events you want to display, e.g. cloudogu.\" tooltip-placement=top aria-label=\"Optional. Enter the github-organisation whose git events you want to display, e.g. cloudogu.\"></span> <input type=text class=form-control id=path ng-model=config.org placeholder=\"(Optional) Enter Organisation\"></div><div class=form-group><label for=path>Access Token</label> <span class=\"glyphicon glyphicon-info-sign ng-scope\" tabindex=0 ng-focus=\"accessTokenTooltipIsOpen = !accessTokenTooltipIsOpen\" tooltip-trigger=outsideClick tooltip-is-open=accessTokenTooltipIsOpen ng-mouseenter=\"accessTokenTooltipIsOpen = true\" uib-tooltip-html=accessTokenTooltip tooltip-placement=top aria-label=\"Access Token Tooltip\"></span> <input type=text class=form-control id=path ng-model=config.accessToken required></div></form>");
$templateCache.put("{widgetsPath}/github/src/events.user.html","<div><div ng-if=!config.user class=\"alert alert-info\">Please configure the widget</div><div ng-if=config.user><ul class=media-list><li class=media ng-repeat=\"event in vm.events\"><div class=media-left><a href={{event.userUrl}} target=_blank><img class=\"media-object img-thumbnail\" ng-src={{event.userImage}} style=\"width: 64px; height: 64px;\"></a></div><div class=media-body><h4 class=media-heading><a href={{event.userUrl}} target=_blank>{{event.actor.login}}</a> <span>{{event.messageAction | limitTo: 128}}<a href={{event.linkElementOne}}>{{event.messageElementOne}}</a></span> <span ng-if=event.messageElementTwo>at <a href={{event.linkElementTwo}}>{{event.messageElementTwo}}</a></span></h4><p ng-if=event.comments ng-repeat=\"comment in event.comments | limitTo:2\"><a ng-if=comment.link href={{comment.link}}>{{comment.id | limitTo: 7}}</a> {{comment.message | limitTo: 128}}</p><small><a href={{event.userUrl}} target=_blank>{{event.actor.login}}</a>, {{event.created_at | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/github/src/issues.html","<div><div ng-if=!config.path class=\"alert alert-info\">Please configure the widget</div><div ng-if=config.path><ul class=media-list><li class=media ng-repeat=\"issue in vm.issues\"><div class=media-left><a href={{issue.user.html_url}} target=_blank><img class=\"media-object img-thumbnail\" ng-src={{issue.user.avatar_url}} style=\"width: 64px; height: 64px;\"></a></div><div class=media-body><h4 class=media-heading><a href={{issue.html_url}} target=_blank>#{{issue.number}} {{issue.title}}</a></h4><p>{{issue.body | limitTo: 128}}</p><small><a href={{issue.user.html_url}} target=_blank>{{issue.user.login}}</a>, {{issue.created_at | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/github/src/line-chart.html","<div><div class=\"alert alert-info\" ng-if=!vm.chart>Please insert a repository path in the widget configuration</div><div ng-if=vm.chart><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-labels=vm.chart.labels chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div></div>");
$templateCache.put("{widgetsPath}/github/src/pie-chart.html","<div><div class=\"alert alert-info\" ng-if=!vm.chart>Please insert a repository path in the widget configuration</div><div ng-if=vm.chart><canvas id=pie class=\"chart chart-pie\" chart-legend=true chart-data=vm.chart.data chart-labels=vm.chart.labels chart-options=vm.chart.options></canvas></div></div>");}]);
/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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



angular
  .module('adf.widget.github')
  .factory('github', GithubService);

function GithubService($q, $http, githubApiUrl) {
  var service = {
    getCommits: getCommits,
    getIssues: getIssues,
    getUserEvents: getUserEvents,
    getOrgaEvents: getOrgaEvents,
    getRepoEvents: getRepoEvents
  };

  return service;

  // implementation

  function getIssues(config) {
    return fetch(createUrl('issues', config), config);
  }

  function getCommits(config) {
    return fetch(createUrl('commits', config), config);
  }

  function getUserEvents(config) {
    return fetch(createUrlUserEvents('events', config), config)
      .then(transformData);
  }

  function getOrgaEvents(config) {
    return fetch(createUrlOrgaEvents('events', config), config)
      .then(transformData);
  }

  function getRepoEvents(config) {
    return fetch(createUrl('events', config), config)
      .then(transformData);
  }

  function transformData(data) {
    for (var i = 0; i < data.length; i++) {

      data[i].userImage = data[i].actor.avatar_url;
      data[i].userUrl = 'https://github.com/' + data[i].actor.login;
      data[i].repoName = data[i].repo.name;
      data[i].repoUrl = 'https://github.com/' + data[i].repo.name;

      var repoName = data[i].repo.name;
      var repoUrl = data[i].repoUrl;

      var eventType = data[i].type;

      if (eventType === "PullRequestEvent") {

        var issueNumer = data[i].payload.number;
        var actionStatus = data[i].payload.action;

        if (actionStatus === "closed") {
          data[i].messageAction = "closed pull request ";
          data[i].messageElementOne = repoName + "#" + issueNumer;
          data[i].linkElementOne = repoUrl + "/issues/" + issueNumer;
        } else if (actionStatus === "opened") {
          data[i].messageAction = "opened pull request ";
          data[i].messageElementOne = repoName + "#" + issueNumer;
          data[i].linkElementOne = repoUrl + "/issues/" + issueNumer;
        }
        if (data[i].payload.pull_request) {
          data[i].comments = bindSingleComment(data[i].payload.pull_request.title);
        }
      } else if (eventType === "PushEvent") {
        data[i].messageAction = "pushed to ";
        data[i].messageElementOne = (data[i].payload.ref).substring(11);
        data[i].linkElementOne = repoUrl + "/tree/" + data[i].messageElementOne;
        data[i].messageElementTwo = repoName;
        data[i].linkElementTwo = repoUrl;

        if (data[i].payload.commits) {

          var itLength = data[i].payload.commits.length;
          var comments = [];

          for (var j = 0; j < itLength; j++) {

            var sha = data[i].payload.commits[j].sha;
            var object = {
              "id": sha,
              "link": repoUrl + "/commit/" + sha,
              "message": data[i].payload.commits[j].message
            };
            comments.push(object);
          }
          data[i].comments = comments;
        }
      } else if (eventType === "IssueCommentEvent") {

        var issueNumber = data[i].payload.issue.number;

        data[i].messageAction = "commented on issue ";
        data[i].messageElementOne = repoName + "#" + issueNumber;
        data[i].linkElementOne = repoUrl + "/issues/" + issueNumber;

        if (data[i].payload.issue.pull_request) {
          data[i].messageAction = "commented on pull request ";
        }
        if (data[i].payload.comment) {
          data[i].comments = bindSingleComment(data[i].payload.comment.body);
        }
      } else if (eventType === "IssuesEvent") {
        var actionStatus = data[i].payload.action;

        if (actionStatus === "closed") {
          data[i].messageAction = "closed issue ";
        } else if (actionStatus === "opened") {
          data[i].messageAction = "opened issue ";
        }
        var issueNumber = data[i].payload.issue.number;

        data[i].messageElementOne = repoName + "#" + issueNumber;
        data[i].linkElementOne = repoUrl + "/issues/" + issueNumber;
        if (data[i].payload.issue.title) {
          data[i].comments = bindSingleComment(data[i].payload.issue.title);
        }
      } else if (eventType === "DeleteEvent") {
        data[i].messageAction = "deleted " + data[i].payload.ref_type + " " + data[i].payload.ref + " at ";
        data[i].messageElementOne = repoName;
        data[i].linkElementOne = repoUrl;
      } else if (eventType === "ReleaseEvent") {
        var releaseName = data[i].payload.release.name;

        data[i].messageAction = "released "
        data[i].messageElementOne = releaseName;
        data[i].linkElementOne = repoUrl + "/releases/tag/" + releaseName;
        data[i].messageElementTwo = repoName;
        data[i].linkElementTwo = repoUrl;

        if (data[i].payload.release.assets) {
          var itLength = data[i].payload.release.assets.length;
          var comments = [];
          for (var j = 0; j < itLength; j++) {
            var object = {
              "message": data[i].payload.release.assets[j].name
            };
            comments.push(object);
          }
          data[i].comments = comments;
        }
      }
    }
    return data;
  }

  // returns array containing str to be bound to data-file
  function bindSingleComment(str) {
    var comments = [];
    var object = {
      "message": str
    };
    comments.push(object);
    return comments;
  }

  function createUrl(type, config) {
    return githubApiUrl + 'repos/' + config.path + '/' + type;
  }

  function createUrlUserEvents(type, config) {
    var url = githubApiUrl + 'users/' + config.user + '/' + type;
    if (config.org) {
      url += '/orgs/' + config.org;
    }
    return url;
  }

  function createUrlOrgaEvents(type, config) {
    var url = githubApiUrl + 'orgs/' + config.org + '/' + type;
    return url;
  }

  function fetch(url, config) {
    var deferred = $q.defer();

    var req = {
      method: 'GET',
      url: url,
      headers: {
        'Authorization': "token " + config.accessToken,
      }
    }

    // these header are not allowed by the github api and need to be removed
    if($http.defaults.headers.get) {
      delete $http.defaults.headers.get['If-Modified-Since']
      delete $http.defaults.headers.get['Cache-Control']
      delete $http.defaults.headers.get['Pragma']
    }

    $http(req).success(function successCallback(data) {
      deferred.resolve(data);
    }).error(function errorCallback(response) {
      deferred.reject();
    });

    return deferred.promise;
  }
}

/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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



function GithubIssuesController(config, issues) {
  var vm = this;

  vm.issues = issues;
}

angular
  .module('adf.widget.github')
  .controller('GithubIssuesController', GithubIssuesController);


/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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



function GithubHistoryController($filter, config, commits) {
  const vm = this;
  if (commits) {
    vm.chart = createChart();
  }

  function createChart() {
    const data = {};

    var orderedCommits = $filter('orderBy')(commits, function (commit) {
      return commit.commit.author.date;
    });

    angular.forEach(orderedCommits, function (commit) {
      var day = commit.commit.author.date;
      day = day.substring(0, day.indexOf('T'));

      if (data[day]) {
        data[day]++;
      } else {
        data[day] = 1;
      }
    });

    const chartData = [];
    const options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            display: true,
            position: 'left',
            ticks: {fixedStepSize: 1},
            scaleLabel: {
              display: true,
              labelString: 'Commits'
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      responsive: true
    };
    const chart = {
      labels: [],
      data: [chartData],
      series: [config.path],
      class: 'chart-line',
      options: options
    };

    angular.forEach(data, function (count, day) {
      chart.labels.push(day);
      chartData.push(count);
    });

    return chart;
  }
}

angular
  .module('adf.widget.github')
  .controller('GithubHistoryController', GithubHistoryController);

/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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


function GithubEventsController(config, events) {
  const vm = this;
  vm.events = events;
}

angular
  .module('adf.widget.github')
  .controller('GithubEventsController', GithubEventsController);

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




angular.module('adf.widget.github').controller('EditController', ["config", "$scope", "$sce", function (config, $scope, $sce) {
  $scope.accessTokenTooltip = $sce.trustAsHtml('Learn how to create a personal access token on <a href="https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token">github</a>');
  $scope.repositoryPathTooltip = $sce.trustAsHtml('Enter the repository like this: <b>organisation/repositoryname</b> eg. <b>github/gitignore</b>');
  $scope.closeTooltip = function (e) {
    console.log('REEEEEEEEEEEE');
    e.stopPropagation();
  };
}]);

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



/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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




function GithubCommitsController(config, commits) {
  var vm = this;

  vm.commits = commits;
}

angular
  .module('adf.widget.github')
  .controller('GithubCommitsController', GithubCommitsController);

/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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



function GithubAuthorController(config, commits) {
  var vm = this;

  if (commits) {
    vm.chart = createChart();
  }

  function createChart() {
    var data = {};
    angular.forEach(commits, function (commit) {
      var author = commit.commit.author.name;
      if (data[author]) {
        data[author]++;
      } else {
        data[author] = 1;
      }
    });

    var options = {
      legend: {
        display: true,
        position: 'bottom'
      },
      responsive: true
    }

    var chart = {
      labels: [],
      data: [],
      series: ['Commits'],
      class: 'chart-pie',
      options: options
    };

    angular.forEach(data, function (count, author) {
      chart.labels.push(author);
      chart.data.push(count);
    });

    return chart;
  }
}

angular
  .module('adf.widget.github')
  .controller('GithubAuthorController', GithubAuthorController);
})(window);