/* Copyright (c) Trainline Limited, 2016. All rights reserved. See LICENSE.txt in the project root for license information. */
'use strict';

let notImplemented = require('api/api-utils/notImplemented');
let getAllASGs = require('queryHandlers/ScanCrossAccountAutoScalingGroups');
let getAccountASGs = require('queryHandlers/ScanAutoScalingGroups');
let getASG = require('queryHandlers/GetAutoScalingGroup');
let getDynamo = require('queryHandlers/GetDynamoResource');
let GetLaunchConfiguration = require('queryHandlers/GetLaunchConfiguration');
let SetLaunchConfiguration = require('commands/launch-config/SetLaunchConfiguration');
let SetAutoScalingGroupSize = require('commands/asg/SetAutoScalingGroupSize');

/**
 * GET /asgs?account=xyz
 */
function getAsgs(req, res, next) {
  const accountName = req.swagger.params.account.value;

  if (accountName !== undefined) {
    return getAccountASGs({ accountName }).then(data => res.json(data)).catch(next);
  } else {
    return getAllASGs().then(data => res.json(data)).catch(next);
  }
}

/**
 * GET /asgs/{name}?account=xyz
 */
function getAsgByName(req, res, next) {
  const autoScalingGroupName = req.swagger.params.name.value;
  const accountName = req.swagger.params.account.value;

  return getASG({ accountName, autoScalingGroupName }).then(data => res.json(data)).catch(next);
}

/**
 * GET /asgs/{name}/ips?account=xyz
 */
function getAsgIps(req, res, next) {
  const key = req.swagger.params.name.value;
  const accountName = req.swagger.params.account.value;
  const resource = 'asgips';
  const exposeAudit = 'version-only';

  return getDynamo({ accountName, key, resource, exposeAudit }).then(data => res.json(data)).catch(next);
}

/**
 * GET /asgs/{name}/launch-config?account=xyz
 */
function getAsgLaunchConfig(req, res, next) {
  const accountName = req.swagger.params.account.value;
  const autoScalingGroupName = req.swagger.params.name.value

  return GetLaunchConfiguration({ accountName, autoScalingGroupName }).then(data => res.json(data)).catch(next);
}

/**
 * PATCH /asgs/{name}?account=xyz
 *
 * TODO(filip): shall we use this for scheduling?
 */
function patchAsg(req, res, next) {
  notImplemented(res, 'Updating ASGS');
}

/**
 * PUT /asgs/{name}/size?account=xyz
 */
function putAsgSize(req, res, next) {
  const accountName = req.swagger.params.account.value;
  const autoScalingGroupName = req.swagger.params.name.value;
  const body = req.swagger.params.body.value;
  const autoScalingGroupMinSize = body.min;
  const autoScalingGroupDesiredSize = body.desired;
  const autoScalingGroupMaxSize = body.max;

  SetAutoScalingGroupSize({ accountName, autoScalingGroupName,
    autoScalingGroupMinSize, autoScalingGroupDesiredSize, autoScalingGroupMaxSize })
    .then(data => res.json(data)).catch(next);
}

/**
 * PUT /asgs/{name}/launch-config?account=xyz
 */
function putAsgLaunchConfig(req, res, next) {
  const accountName = req.swagger.params.account.value;
  const data = req.swagger.params.body.value
  const autoScalingGroupName = req.swagger.params.name.value

  return SetLaunchConfiguration({ accountName, autoScalingGroupName, data }).then(data => res.json(data)).catch(next);
}

module.exports = {
  getAsgs,
  getAsgByName,
  getAsgIps,
  getAsgLaunchConfig,
  patchAsg,
  putAsgSize,
  putAsgLaunchConfig
};
