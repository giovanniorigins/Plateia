angular.module('plateia.filters', [])
    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value)
                return '';

            max = parseInt(max, 10);
            if (!max)
                return value;
            if (value.length <= max)
                return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || '…');
        };
    })
    .filter('dealFilter', function () {
        return function (items, options) {
            if (options.type == '') {
                return items;
            } else {
                var filtered = [];
                angular.forEach(items, function (item) {
                    if (item.coupon_type == options.type)
                        filtered.push(item);
                });
                return filtered;

            }
        }
    });
