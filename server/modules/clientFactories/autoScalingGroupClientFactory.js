/* Copyright (c) Trainline Limited, 2016. All rights reserved. See LICENSE.txt in the project root for license information. */
'use strict';

let resourceProvider = require('modules/resourceProvider');

module.exports = {
  create: function (parameters) {
    return resourceProvider.getInstanceByName('asgs', parameters);
  },
};
