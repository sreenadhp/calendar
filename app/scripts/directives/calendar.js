'use strict';

/**
 * @ngdoc directive
 * @name calendarApp.directive:calendar
 * @description
 * # calendar
 */
angular.module('calendarApp')
  .directive('calendar', function (utils) {

    var getMalayalamMonthNames = function (month) {
      var malayalamMonthNames = month.days.map(function (day) {
        return day.malayalamMonth;
      });
      var uniqueMonths = utils.unique(malayalamMonthNames);
      return uniqueMonths.join(' - ');
    };

    var getMalayalamYears = function (month) {
      var malayalamYears = month.days.map(function (day) {
        return day.malayalamYear;
      });
      var uniqueYears = utils.unique(malayalamYears);
      return uniqueYears.join(' - ');
    };

    return {
      restrict    : 'E',
      replace     : true,
      templateUrl : 'views/calendar.html',
      scope       : {
        month : '=month'
      },
      link        : function (scope) {
        var weekdaysLookup = utils.weekdaysLookup;

        var month = scope.month;
        var weeks = scope.weeks = [];

        scope.year = scope.month.days[0].year;

        scope.weekdaysLookup = utils.weekdaysLookup;

        scope.malayalamMonthNames = getMalayalamMonthNames(month);

        scope.malayalamYears = getMalayalamYears(month);

        for (var i = 0; i < month.days.length; i++) {
          // cache the day we're looping with
          var day = month.days[i];

          // add a new week at the start and when 7 days have been added to previous one
          if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
            weeks.push([]);
          }

          // add the empty cells for when 1st of month is not a Sunday
          if (day.date === 1) {
            var weekdaysIndices = Object.keys(weekdaysLookup);
            var emptyCellsCount = 0;
            for (var j = 0; j < weekdaysIndices.length; j++) {
              var index = weekdaysIndices[j];
              if (day.weekdayName === weekdaysLookup[index].ml) {
                emptyCellsCount = index;
                break;
              }
            }
            for (var k = 0; k < emptyCellsCount; k++) {
              weeks[weeks.length - 1].push({});
            }
          }

          // add a new boolean property 'isToday' which will be true only for the current date
          var today = new Date();
          day.isToday = day.year === today.getFullYear() &&
            day.month === utils.monthsLookup[today.getMonth() + 1].en &&
            day.date === today.getDate();

          // add the day into the right position within the week array
          weeks[weeks.length - 1].push(day);

          // add the empty cells for when the last day of the month is not a Saturday
          if (i === month.days.length - 1) {
            for (var l = 0, len = 7 - weeks[weeks.length - 1].length; l < len; l++) {
              weeks[weeks.length - 1].push({});
            }
          }
        }
      }
    };
  });
