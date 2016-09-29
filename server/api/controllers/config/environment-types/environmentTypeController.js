'use strict';

const RESOURCE = 'config/environmenttypes';
const KEY_NAME = 'EnvironmentType';

let envTypeConfig = require('api/api-utils/configController');

/**
 * GET /config/environment-types
 */
function getEnvironmentTypesConfig(req, res, next) {
  return envTypeConfig.getAll(RESOURCE).then(data => res.json(data)).catch(next);
}

/**
 * GET /config/environment-types/{name}
 */
function getEnvironmentTypeConfigByName(req, res, next) {
  const key = req.swagger.params.name.value;
  return envTypeConfig.getByKey(RESOURCE, key).then(data => res.json(data)).catch(next);
}

/**
 * POST /config/environment-types
 */
function postEnvironmentTypesConfig(req, res, next) {
  const envType = req.swagger.params.body.value;
  const user = req.user;

  return envTypeConfig.create(RESOURCE, envType, KEY_NAME, user).then(_ => res.status(201).end()).catch(next);
}

/**
 * PUT /config/environment-types/{name}
 */
function putEnvironmentTypeConfigByName(req, res, next) {
  const key = req.swagger.params.name.value;
  const expectedVersion = req.swagger.params['expected-version'].value;
  const envType = req.swagger.params.body.value;
  const user = req.user;

  return envTypeConfig
    .update(RESOURCE, key, KEY_NAME, envType, expectedVersion, user)
    .then(_ => res.status(200).end())
    .catch(next);
}

/**
 * DELETE /config/environment-types/{name}
 */
function deleteEnvironmentTypeConfigByName(req, res, next) {
  const key = req.swagger.params.name.value;
  const user = req.user;
  return envTypeConfig.deleteItem(RESOURCE, key, user).then(_ => res.status(200).end()).catch(next);
}

module.exports = {
  getEnvironmentTypesConfig,
  getEnvironmentTypeConfigByName,
  postEnvironmentTypesConfig,
  putEnvironmentTypeConfigByName,
  deleteEnvironmentTypeConfigByName
};
