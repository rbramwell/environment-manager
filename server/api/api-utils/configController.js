'use strict';

let _ = require('lodash');
const accountName = require('config').getUserValue('masterAccountName');
const exposeAudit = 'version-only';

let getAllValues = require('queryHandlers/ScanDynamoResources');
let getValue = require('queryHandlers/GetDynamoResource');
let updateValue = require('commands/resources/UpdateDynamoResource');
let createValue = require('commands/resources/CreateDynamoResource');
let deleteValue = require('commands/resources/DeleteDynamoResource');
let metadata = require('commands/utils/metadata');

/**
 * Get all resources in a Dynamo table
 */
function getAll(resource) {
  return getAllValues({ resource, exposeAudit, accountName });
}

/**
 * Get a specific resource from a Dynamo table
 */
function getByKey(resource, key) {
  return getValue({ resource, key, exposeAudit, accountName });
}

/**
 * Get a specific resource from a Dynamo table that has includes sort key
 */
function getBySortKey(resource, partitionKey, sortKey) {
  return getValue({ key: partitionKey, range: sortKey, resource, exposeAudit, accountName });
}

/**
 * Create a resource in a Dynamo table
 */
function create(resource, value, keyName, user) {
  const key = value[keyName];
  const Value = _.omit(value, keyName);
  const item = { Value };
  const newItem = metadata.addMetadata({ resource, key, item, accountName, user });
  return createValue(newItem);
}

/**
 * Create a resource in a Dynamo table that includes a sort key
 */
function createWithSortKey(resource, value, partitionKey, sortKey, user) {
  const item = { Value: value };
  const newItem = metadata.addMetadata({ key: partitionKey, range: sortKey, resource, item, accountName, user });
  return createValue(newItem);
}

/**
 * Update (replace) a single Dynamo resource
 */
function update(resource, key, keyName, value, expectedVersion, user) {
  const item = { Value:_.omit(value, keyName) };
  const updatedItem = metadata.addMetadata({ resource, key, item, expectedVersion, accountName, user });
  return updateValue(updatedItem);
}

/**
 * Update (replace) a single Dynamo resource in a table that incldudes a sort key
 */
function updateWithSortKey(resource, value, partitionKey, sortKey, expectedVersion, user) {
  const item = { Value:value };
  const updatedItem = metadata.addMetadata({ key: partitionKey, range: sortKey, resource, item, expectedVersion, accountName, user });
  return updateValue(updatedItem);
}

/**
 * Delete a single item from a Dynamo table
 */
function deleteItem(resource, key, user) {
  const deletedItem = metadata.addMetadata({ resource, key, accountName, user });
  return deleteValue(deletedItem);
}

/**
 * Delete a single item from a Dynamo table that includes a sort key
 */
function deleteItemWithSortKey(resource, partitionKey, sortKey, user) {
  const deletedItem = metadata.addMetadata({ resource, key: partitionKey, range: sortKey, accountName, user });
  return deleteValue(deletedItem);
}

module.exports = {
  getAll,
  getByKey,
  getBySortKey,
  create,
  createWithSortKey,
  update,
  updateWithSortKey,
  deleteItem,
  deleteItemWithSortKey
};
