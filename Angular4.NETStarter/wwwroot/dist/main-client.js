/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "18348a5d31282099d319"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(59)(__webpack_require__.s = 59);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = vendor_38957c1950c786f3dca0;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(1);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(40);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(13);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(28);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(40);
__webpack_require__(57);
__webpack_require__(26);
__webpack_require__(23);
var core_1 = __webpack_require__(1);
var platform_browser_dynamic_1 = __webpack_require__(49);
var app_module_1 = __webpack_require__(15);
if (true) {
    module['hot'].accept();
    module['hot'].dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    core_1.enableProdMode();
}
var modulePromise = platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(39);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(41);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(44);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(45);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=%2F__webpack_hmr", __webpack_require__(46)(module)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(280);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return AnimationDriver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnimationEngine; });
/* unused harmony export ɵAnimation */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return AnimationStyleNormalizer; });
/* unused harmony export ɵNoopAnimationStyleNormalizer */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return WebAnimationsStyleNormalizer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return NoopAnimationDriver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DomAnimationEngine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return NoopAnimationEngine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return WebAnimationsDriver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return supportsWebAnimations; });
/* unused harmony export ɵWebAnimationsPlayer */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_animations__ = __webpack_require__(47);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @license Angular v4.1.2
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @experimental
 */
var NoopAnimationDriver = (function () {
    function NoopAnimationDriver() {
    }
    NoopAnimationDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        return new __WEBPACK_IMPORTED_MODULE_0__angular_animations__["NoopAnimationPlayer"]();
    };
    return NoopAnimationDriver;
}());
/**
 * @experimental
 */
var AnimationDriver = (function () {
    function AnimationDriver() {
    }
    return AnimationDriver;
}());
AnimationDriver.NOOP = new NoopAnimationDriver();
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @abstract
 */
var AnimationEngine = (function () {
    function AnimationEngine() {
    }
    /**
     * @abstract
     * @param {?} trigger
     * @param {?=} name
     * @return {?}
     */
    AnimationEngine.prototype.registerTrigger = function (trigger, name) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} domFn
     * @return {?}
     */
    AnimationEngine.prototype.onInsert = function (element, domFn) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} domFn
     * @return {?}
     */
    AnimationEngine.prototype.onRemove = function (element, domFn) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    AnimationEngine.prototype.setProperty = function (element, property, value) { };
    /**
     * @abstract
     * @param {?} element
     * @param {?} eventName
     * @param {?} eventPhase
     * @param {?} callback
     * @return {?}
     */
    AnimationEngine.prototype.listen = function (element, eventName, eventPhase, callback) { };
    /**
     * @abstract
     * @return {?}
     */
    AnimationEngine.prototype.flush = function () { };
    Object.defineProperty(AnimationEngine.prototype, "activePlayers", {
        /**
         * @return {?}
         */
        get: function () { throw new Error('...'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationEngine.prototype, "queuedPlayers", {
        /**
         * @return {?}
         */
        get: function () { throw new Error('...'); },
        enumerable: true,
        configurable: true
    });
    return AnimationEngine;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ONE_SECOND = 1000;
/**
 * @param {?} exp
 * @param {?} errors
 * @return {?}
 */
function parseTimeExpression(exp, errors) {
    var /** @type {?} */ regex = /^([\.\d]+)(m?s)(?:\s+([\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i;
    var /** @type {?} */ duration;
    var /** @type {?} */ delay = 0;
    var /** @type {?} */ easing = null;
    if (typeof exp === 'string') {
        var /** @type {?} */ matches = exp.match(regex);
        if (matches === null) {
            errors.push("The provided timing value \"" + exp + "\" is invalid.");
            return { duration: 0, delay: 0, easing: null };
        }
        var /** @type {?} */ durationMatch = parseFloat(matches[1]);
        var /** @type {?} */ durationUnit = matches[2];
        if (durationUnit == 's') {
            durationMatch *= ONE_SECOND;
        }
        duration = Math.floor(durationMatch);
        var /** @type {?} */ delayMatch = matches[3];
        var /** @type {?} */ delayUnit = matches[4];
        if (delayMatch != null) {
            var /** @type {?} */ delayVal = parseFloat(delayMatch);
            if (delayUnit != null && delayUnit == 's') {
                delayVal *= ONE_SECOND;
            }
            delay = Math.floor(delayVal);
        }
        var /** @type {?} */ easingVal = matches[5];
        if (easingVal) {
            easing = easingVal;
        }
    }
    else {
        duration = (exp);
    }
    return { duration: duration, delay: delay, easing: easing };
}
/**
 * @param {?} styles
 * @return {?}
 */
function normalizeStyles(styles) {
    var /** @type {?} */ normalizedStyles = {};
    if (Array.isArray(styles)) {
        styles.forEach(function (data) { return copyStyles(data, false, normalizedStyles); });
    }
    else {
        copyStyles(styles, false, normalizedStyles);
    }
    return normalizedStyles;
}
/**
 * @param {?} styles
 * @param {?} readPrototype
 * @param {?=} destination
 * @return {?}
 */
function copyStyles(styles, readPrototype, destination) {
    if (destination === void 0) { destination = {}; }
    if (readPrototype) {
        // we make use of a for-in loop so that the
        // prototypically inherited properties are
        // revealed from the backFill map
        for (var /** @type {?} */ prop in styles) {
            destination[prop] = styles[prop];
        }
    }
    else {
        Object.keys(styles).forEach(function (prop) { return destination[prop] = styles[prop]; });
    }
    return destination;
}
/**
 * @param {?} element
 * @param {?} styles
 * @return {?}
 */
function setStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) { return element.style[prop] = styles[prop]; });
    }
}
/**
 * @param {?} element
 * @param {?} styles
 * @return {?}
 */
function eraseStyles(element, styles) {
    if (element['style']) {
        Object.keys(styles).forEach(function (prop) {
            // IE requires '' instead of null
            // see https://github.com/angular/angular/issues/7916
            element.style[prop] = '';
        });
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} visitor
 * @param {?} node
 * @param {?} context
 * @return {?}
 */
function visitAnimationNode(visitor, node, context) {
    switch (node.type) {
        case 0 /* State */:
            return visitor.visitState(/** @type {?} */ (node), context);
        case 1 /* Transition */:
            return visitor.visitTransition(/** @type {?} */ (node), context);
        case 2 /* Sequence */:
            return visitor.visitSequence(/** @type {?} */ (node), context);
        case 3 /* Group */:
            return visitor.visitGroup(/** @type {?} */ (node), context);
        case 4 /* Animate */:
            return visitor.visitAnimate(/** @type {?} */ (node), context);
        case 5 /* KeyframeSequence */:
            return visitor.visitKeyframeSequence(/** @type {?} */ (node), context);
        case 6 /* Style */:
            return visitor.visitStyle(/** @type {?} */ (node), context);
        default:
            throw new Error("Unable to resolve animation metadata node #" + node.type);
    }
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ANY_STATE = '*';
/**
 * @param {?} transitionValue
 * @param {?} errors
 * @return {?}
 */
function parseTransitionExpr(transitionValue, errors) {
    var /** @type {?} */ expressions = [];
    if (typeof transitionValue == 'string') {
        ((transitionValue))
            .split(/\s*,\s*/)
            .forEach(function (str) { return parseInnerTransitionStr(str, expressions, errors); });
    }
    else {
        expressions.push(/** @type {?} */ (transitionValue));
    }
    return expressions;
}
/**
 * @param {?} eventStr
 * @param {?} expressions
 * @param {?} errors
 * @return {?}
 */
function parseInnerTransitionStr(eventStr, expressions, errors) {
    if (eventStr[0] == ':') {
        eventStr = parseAnimationAlias(eventStr, errors);
    }
    var /** @type {?} */ match = eventStr.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
    if (match == null || match.length < 4) {
        errors.push("The provided transition expression \"" + eventStr + "\" is not supported");
        return expressions;
    }
    var /** @type {?} */ fromState = match[1];
    var /** @type {?} */ separator = match[2];
    var /** @type {?} */ toState = match[3];
    expressions.push(makeLambdaFromStates(fromState, toState));
    var /** @type {?} */ isFullAnyStateExpr = fromState == ANY_STATE && toState == ANY_STATE;
    if (separator[0] == '<' && !isFullAnyStateExpr) {
        expressions.push(makeLambdaFromStates(toState, fromState));
    }
}
/**
 * @param {?} alias
 * @param {?} errors
 * @return {?}
 */
function parseAnimationAlias(alias, errors) {
    switch (alias) {
        case ':enter':
            return 'void => *';
        case ':leave':
            return '* => void';
        default:
            errors.push("The transition alias value \"" + alias + "\" is not supported");
            return '* => *';
    }
}
/**
 * @param {?} lhs
 * @param {?} rhs
 * @return {?}
 */
function makeLambdaFromStates(lhs, rhs) {
    return function (fromState, toState) {
        var /** @type {?} */ lhsMatch = lhs == ANY_STATE || lhs == fromState;
        var /** @type {?} */ rhsMatch = rhs == ANY_STATE || rhs == toState;
        return lhsMatch && rhsMatch;
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} keyframes
 * @param {?} duration
 * @param {?} delay
 * @param {?} easing
 * @return {?}
 */
function createTimelineInstruction(keyframes, duration, delay, easing) {
    return {
        type: 1 /* TimelineAnimation */,
        keyframes: keyframes,
        duration: duration,
        delay: delay,
        totalTime: duration + delay, easing: easing
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} ast
 * @param {?=} startingStyles
 * @param {?=} finalStyles
 * @return {?}
 */
function buildAnimationKeyframes(ast, startingStyles, finalStyles) {
    if (startingStyles === void 0) { startingStyles = {}; }
    if (finalStyles === void 0) { finalStyles = {}; }
    var /** @type {?} */ normalizedAst = Array.isArray(ast) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["sequence"])(/** @type {?} */ (ast)) : (ast);
    return new AnimationTimelineVisitor().buildKeyframes(normalizedAst, startingStyles, finalStyles);
}
var AnimationTimelineContext = (function () {
    /**
     * @param {?} errors
     * @param {?} timelines
     * @param {?=} initialTimeline
     */
    function AnimationTimelineContext(errors, timelines, initialTimeline) {
        this.errors = errors;
        this.timelines = timelines;
        this.previousNode = ({});
        this.subContextCount = 0;
        this.currentTimeline = initialTimeline || new TimelineBuilder(0);
        timelines.push(this.currentTimeline);
    }
    /**
     * @return {?}
     */
    AnimationTimelineContext.prototype.createSubContext = function () {
        var /** @type {?} */ context = new AnimationTimelineContext(this.errors, this.timelines, this.currentTimeline.fork());
        context.previousNode = this.previousNode;
        context.currentAnimateTimings = this.currentAnimateTimings;
        this.subContextCount++;
        return context;
    };
    /**
     * @param {?=} newTime
     * @return {?}
     */
    AnimationTimelineContext.prototype.transformIntoNewTimeline = function (newTime) {
        if (newTime === void 0) { newTime = 0; }
        this.currentTimeline = this.currentTimeline.fork(newTime);
        this.timelines.push(this.currentTimeline);
        return this.currentTimeline;
    };
    /**
     * @param {?} time
     * @return {?}
     */
    AnimationTimelineContext.prototype.incrementTime = function (time) {
        this.currentTimeline.forwardTime(this.currentTimeline.duration + time);
    };
    return AnimationTimelineContext;
}());
var AnimationTimelineVisitor = (function () {
    function AnimationTimelineVisitor() {
    }
    /**
     * @param {?} ast
     * @param {?} startingStyles
     * @param {?} finalStyles
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.buildKeyframes = function (ast, startingStyles, finalStyles) {
        var /** @type {?} */ context = new AnimationTimelineContext([], []);
        context.currentTimeline.setStyles(startingStyles);
        visitAnimationNode(this, ast, context);
        // this checks to see if an actual animation happened
        var /** @type {?} */ timelines = context.timelines.filter(function (timeline) { return timeline.hasStyling(); });
        if (timelines.length && Object.keys(finalStyles).length) {
            var /** @type {?} */ tl = timelines[timelines.length - 1];
            if (!tl.allowOnlyTimelineStyles()) {
                tl.setStyles(finalStyles);
            }
        }
        return timelines.length ? timelines.map(function (timeline) { return timeline.buildKeyframes(); }) :
            [createTimelineInstruction([], 0, 0, '')];
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitState = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitTransition = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitSequence = function (ast, context) {
        var _this = this;
        var /** @type {?} */ subContextCount = context.subContextCount;
        if (context.previousNode.type == 6 /* Style */) {
            context.currentTimeline.forwardFrame();
            context.currentTimeline.snapshotCurrentStyles();
        }
        ast.steps.forEach(function (s) { return visitAnimationNode(_this, s, context); });
        // this means that some animation function within the sequence
        // ended up creating a sub timeline (which means the current
        // timeline cannot overlap with the contents of the sequence)
        if (context.subContextCount > subContextCount) {
            context.transformIntoNewTimeline();
        }
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitGroup = function (ast, context) {
        var _this = this;
        var /** @type {?} */ innerTimelines = [];
        var /** @type {?} */ furthestTime = context.currentTimeline.currentTime;
        ast.steps.forEach(function (s) {
            var /** @type {?} */ innerContext = context.createSubContext();
            visitAnimationNode(_this, s, innerContext);
            furthestTime = Math.max(furthestTime, innerContext.currentTimeline.currentTime);
            innerTimelines.push(innerContext.currentTimeline);
        });
        // this operation is run after the AST loop because otherwise
        // if the parent timeline's collected styles were updated then
        // it would pass in invalid data into the new-to-be forked items
        innerTimelines.forEach(function (timeline) { return context.currentTimeline.mergeTimelineCollectedStyles(timeline); });
        context.transformIntoNewTimeline(furthestTime);
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitAnimate = function (ast, context) {
        var /** @type {?} */ timings = ast.timings.hasOwnProperty('duration') ? (ast.timings) :
            parseTimeExpression(/** @type {?} */ (ast.timings), context.errors);
        context.currentAnimateTimings = timings;
        if (timings.delay) {
            context.incrementTime(timings.delay);
            context.currentTimeline.snapshotCurrentStyles();
        }
        var /** @type {?} */ astType = ast.styles ? ast.styles.type : -1;
        if (astType == 5 /* KeyframeSequence */) {
            this.visitKeyframeSequence(/** @type {?} */ (ast.styles), context);
        }
        else {
            var /** @type {?} */ styleAst = (ast.styles);
            if (!styleAst) {
                var /** @type {?} */ newStyleData = {};
                if (timings.easing) {
                    newStyleData['easing'] = timings.easing;
                }
                styleAst = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["style"])(newStyleData);
                ((styleAst))['treatAsEmptyStep'] = true;
            }
            context.incrementTime(timings.duration);
            if (styleAst) {
                this.visitStyle(styleAst, context);
            }
        }
        context.currentAnimateTimings = null;
        context.previousNode = ast;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitStyle = function (ast, context) {
        // this is a special case when a style() call is issued directly after
        // a call to animate(). If the clock is not forwarded by one frame then
        // the style() calls will be merged into the previous animate() call
        // which is incorrect.
        if (!context.currentAnimateTimings &&
            context.previousNode.type == 4 /* Animate */) {
            context.currentTimeline.forwardFrame();
        }
        var /** @type {?} */ normalizedStyles = normalizeStyles(ast.styles);
        var /** @type {?} */ easing = context.currentAnimateTimings && context.currentAnimateTimings.easing;
        this._applyStyles(normalizedStyles, easing, ((ast))['treatAsEmptyStep'] ? true : false, context);
        context.previousNode = ast;
    };
    /**
     * @param {?} styles
     * @param {?} easing
     * @param {?} treatAsEmptyStep
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype._applyStyles = function (styles, easing, treatAsEmptyStep, context) {
        if (styles.hasOwnProperty('easing')) {
            easing = easing || (styles['easing']);
            delete styles['easing'];
        }
        context.currentTimeline.setStyles(styles, easing, treatAsEmptyStep);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTimelineVisitor.prototype.visitKeyframeSequence = function (ast, context) {
        var _this = this;
        var /** @type {?} */ MAX_KEYFRAME_OFFSET = 1;
        var /** @type {?} */ limit = ast.steps.length - 1;
        var /** @type {?} */ firstKeyframe = ast.steps[0];
        var /** @type {?} */ offsetGap = 0;
        var /** @type {?} */ containsOffsets = getOffset(firstKeyframe) != null;
        if (!containsOffsets) {
            offsetGap = MAX_KEYFRAME_OFFSET / limit;
        }
        var /** @type {?} */ startTime = context.currentTimeline.duration;
        var /** @type {?} */ duration = ((context.currentAnimateTimings)).duration;
        var /** @type {?} */ innerContext = context.createSubContext();
        var /** @type {?} */ innerTimeline = innerContext.currentTimeline;
        innerTimeline.easing = ((context.currentAnimateTimings)).easing;
        ast.steps.forEach(function (step, i) {
            var /** @type {?} */ normalizedStyles = normalizeStyles(step.styles);
            var /** @type {?} */ offset = containsOffsets ?
                (step.offset != null ? step.offset : parseFloat(/** @type {?} */ (normalizedStyles['offset']))) :
                (i == limit ? MAX_KEYFRAME_OFFSET : i * offsetGap);
            innerTimeline.forwardTime(offset * duration);
            _this._applyStyles(normalizedStyles, null, false, innerContext);
        });
        // this will ensure that the parent timeline gets all the styles from
        // the child even if the new timeline below is not used
        context.currentTimeline.mergeTimelineCollectedStyles(innerTimeline);
        // we do this because the window between this timeline and the sub timeline
        // should ensure that the styles within are exactly the same as they were before
        context.transformIntoNewTimeline(startTime + duration);
        context.previousNode = ast;
    };
    return AnimationTimelineVisitor;
}());
var TimelineBuilder = (function () {
    /**
     * @param {?} startTime
     * @param {?=} globalTimelineStyles
     */
    function TimelineBuilder(startTime, globalTimelineStyles) {
        this.startTime = startTime;
        this.duration = 0;
        this.easing = '';
        this._previousKeyframe = {};
        this._keyframes = new Map();
        this._styleSummary = {};
        this._backFill = {};
        this._currentEmptyStepKeyframe = null;
        this._localTimelineStyles = Object.create(this._backFill, {});
        this._globalTimelineStyles =
            globalTimelineStyles ? globalTimelineStyles : this._localTimelineStyles;
        this._loadKeyframe();
    }
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.hasStyling = function () { return this._keyframes.size > 1; };
    Object.defineProperty(TimelineBuilder.prototype, "currentTime", {
        /**
         * @return {?}
         */
        get: function () { return this.startTime + this.duration; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?=} currentTime
     * @return {?}
     */
    TimelineBuilder.prototype.fork = function (currentTime) {
        if (currentTime === void 0) { currentTime = 0; }
        return new TimelineBuilder(currentTime || this.currentTime, this._globalTimelineStyles);
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype._loadKeyframe = function () {
        if (this._currentKeyframe) {
            this._previousKeyframe = this._currentKeyframe;
        }
        this._currentKeyframe = ((this._keyframes.get(this.duration)));
        if (!this._currentKeyframe) {
            this._currentKeyframe = Object.create(this._backFill, {});
            this._keyframes.set(this.duration, this._currentKeyframe);
        }
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.forwardFrame = function () {
        this.duration++;
        this._loadKeyframe();
    };
    /**
     * @param {?} time
     * @return {?}
     */
    TimelineBuilder.prototype.forwardTime = function (time) {
        this.duration = time;
        this._loadKeyframe();
    };
    /**
     * @param {?} prop
     * @param {?} value
     * @return {?}
     */
    TimelineBuilder.prototype._updateStyle = function (prop, value) {
        this._localTimelineStyles[prop] = value; /** @type {?} */
        ((this._globalTimelineStyles))[prop] = value;
        this._styleSummary[prop] = { time: this.currentTime, value: value };
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.allowOnlyTimelineStyles = function () { return this._currentEmptyStepKeyframe !== this._currentKeyframe; };
    /**
     * @param {?} styles
     * @param {?=} easing
     * @param {?=} treatAsEmptyStep
     * @return {?}
     */
    TimelineBuilder.prototype.setStyles = function (styles, easing, treatAsEmptyStep) {
        var _this = this;
        if (easing === void 0) { easing = null; }
        if (treatAsEmptyStep === void 0) { treatAsEmptyStep = false; }
        if (easing) {
            ((this._previousKeyframe))['easing'] = easing;
        }
        if (treatAsEmptyStep) {
            // special case for animate(duration):
            // all missing styles are filled with a `*` value then
            // if any destination styles are filled in later on the same
            // keyframe then they will override the overridden styles
            // We use `_globalTimelineStyles` here because there may be
            // styles in previous keyframes that are not present in this timeline
            Object.keys(this._globalTimelineStyles).forEach(function (prop) {
                _this._backFill[prop] = _this._globalTimelineStyles[prop] || __WEBPACK_IMPORTED_MODULE_0__angular_animations__["AUTO_STYLE"];
                _this._currentKeyframe[prop] = __WEBPACK_IMPORTED_MODULE_0__angular_animations__["AUTO_STYLE"];
            });
            this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        else {
            Object.keys(styles).forEach(function (prop) {
                if (prop !== 'offset') {
                    var /** @type {?} */ val = styles[prop];
                    _this._currentKeyframe[prop] = val;
                    if (!_this._localTimelineStyles[prop]) {
                        _this._backFill[prop] = _this._globalTimelineStyles[prop] || __WEBPACK_IMPORTED_MODULE_0__angular_animations__["AUTO_STYLE"];
                    }
                    _this._updateStyle(prop, val);
                }
            });
            Object.keys(this._localTimelineStyles).forEach(function (prop) {
                if (!_this._currentKeyframe.hasOwnProperty(prop)) {
                    _this._currentKeyframe[prop] = _this._localTimelineStyles[prop];
                }
            });
        }
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.snapshotCurrentStyles = function () { copyStyles(this._localTimelineStyles, false, this._currentKeyframe); };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.getFinalKeyframe = function () { return ((this._keyframes.get(this.duration))); };
    Object.defineProperty(TimelineBuilder.prototype, "properties", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ properties = [];
            for (var /** @type {?} */ prop in this._currentKeyframe) {
                properties.push(prop);
            }
            return properties;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} timeline
     * @return {?}
     */
    TimelineBuilder.prototype.mergeTimelineCollectedStyles = function (timeline) {
        var _this = this;
        Object.keys(timeline._styleSummary).forEach(function (prop) {
            var /** @type {?} */ details0 = _this._styleSummary[prop];
            var /** @type {?} */ details1 = timeline._styleSummary[prop];
            if (!details0 || details1.time > details0.time) {
                _this._updateStyle(prop, details1.value);
            }
        });
    };
    /**
     * @return {?}
     */
    TimelineBuilder.prototype.buildKeyframes = function () {
        var _this = this;
        var /** @type {?} */ finalKeyframes = [];
        // special case for when there are only start/destination
        // styles but no actual animation animate steps...
        if (this.duration == 0) {
            var /** @type {?} */ targetKeyframe = this.getFinalKeyframe();
            var /** @type {?} */ firstKeyframe = copyStyles(targetKeyframe, true);
            firstKeyframe['offset'] = 0;
            finalKeyframes.push(firstKeyframe);
            var /** @type {?} */ lastKeyframe = copyStyles(targetKeyframe, true);
            lastKeyframe['offset'] = 1;
            finalKeyframes.push(lastKeyframe);
        }
        else {
            this._keyframes.forEach(function (keyframe, time) {
                var /** @type {?} */ finalKeyframe = copyStyles(keyframe, true);
                finalKeyframe['offset'] = time / _this.duration;
                finalKeyframes.push(finalKeyframe);
            });
        }
        return createTimelineInstruction(finalKeyframes, this.duration, this.startTime, this.easing);
    };
    return TimelineBuilder;
}());
/**
 * @param {?} ast
 * @return {?}
 */
function getOffset(ast) {
    var /** @type {?} */ offset = ast.offset;
    if (offset == null) {
        var /** @type {?} */ styles = ast.styles;
        if (Array.isArray(styles)) {
            for (var /** @type {?} */ i = 0; i < styles.length; i++) {
                var /** @type {?} */ o = (styles[i]['offset']);
                if (o != null) {
                    offset = o;
                    break;
                }
            }
        }
        else {
            offset = (styles['offset']);
        }
    }
    return ((offset));
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} triggerName
 * @param {?} fromState
 * @param {?} toState
 * @param {?} isRemovalTransition
 * @param {?} fromStyles
 * @param {?} toStyles
 * @param {?} timelines
 * @return {?}
 */
function createTransitionInstruction(triggerName, fromState, toState, isRemovalTransition, fromStyles, toStyles, timelines) {
    return {
        type: 0 /* TransitionAnimation */,
        triggerName: triggerName,
        isRemovalTransition: isRemovalTransition,
        fromState: fromState,
        fromStyles: fromStyles,
        toState: toState,
        toStyles: toStyles,
        timelines: timelines
    };
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var AnimationTransitionFactory = (function () {
    /**
     * @param {?} _triggerName
     * @param {?} ast
     * @param {?} matchFns
     * @param {?} _stateStyles
     */
    function AnimationTransitionFactory(_triggerName, ast, matchFns, _stateStyles) {
        this._triggerName = _triggerName;
        this.matchFns = matchFns;
        this._stateStyles = _stateStyles;
        var normalizedAst = Array.isArray(ast.animation) ?
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["sequence"])(ast.animation) :
            ast.animation;
        this._animationAst = normalizedAst;
    }
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @return {?}
     */
    AnimationTransitionFactory.prototype.match = function (currentState, nextState) {
        if (!oneOrMoreTransitionsMatch(this.matchFns, currentState, nextState))
            return;
        var /** @type {?} */ backupStateStyles = this._stateStyles['*'] || {};
        var /** @type {?} */ currentStateStyles = this._stateStyles[currentState] || backupStateStyles;
        var /** @type {?} */ nextStateStyles = this._stateStyles[nextState] || backupStateStyles;
        var /** @type {?} */ timelines = buildAnimationKeyframes(this._animationAst, currentStateStyles, nextStateStyles);
        return createTransitionInstruction(this._triggerName, currentState, nextState, nextState === 'void', currentStateStyles, nextStateStyles, timelines);
    };
    return AnimationTransitionFactory;
}());
/**
 * @param {?} matchFns
 * @param {?} currentState
 * @param {?} nextState
 * @return {?}
 */
function oneOrMoreTransitionsMatch(matchFns, currentState, nextState) {
    return matchFns.some(function (fn) { return fn(currentState, nextState); });
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} ast
 * @return {?}
 */
function validateAnimationSequence(ast) {
    var /** @type {?} */ normalizedAst = Array.isArray(ast) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["sequence"])(/** @type {?} */ (ast)) : (ast);
    return new AnimationValidatorVisitor().validate(normalizedAst);
}
var AnimationValidatorVisitor = (function () {
    function AnimationValidatorVisitor() {
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.validate = function (ast) {
        var /** @type {?} */ context = new AnimationValidatorContext();
        visitAnimationNode(this, ast, context);
        return context.errors;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitState = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitTransition = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitSequence = function (ast, context) {
        var _this = this;
        ast.steps.forEach(function (step) { return visitAnimationNode(_this, step, context); });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitGroup = function (ast, context) {
        var _this = this;
        var /** @type {?} */ currentTime = context.currentTime;
        var /** @type {?} */ furthestTime = 0;
        ast.steps.forEach(function (step) {
            context.currentTime = currentTime;
            visitAnimationNode(_this, step, context);
            furthestTime = Math.max(furthestTime, context.currentTime);
        });
        context.currentTime = furthestTime;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitAnimate = function (ast, context) {
        // we reassign the timings here so that they are not reparsed each
        // time an animation occurs
        context.currentAnimateTimings = ast.timings =
            parseTimeExpression(/** @type {?} */ (ast.timings), context.errors);
        var /** @type {?} */ astType = ast.styles && ast.styles.type;
        if (astType == 5 /* KeyframeSequence */) {
            this.visitKeyframeSequence(/** @type {?} */ (ast.styles), context);
        }
        else {
            context.currentTime +=
                context.currentAnimateTimings.duration + context.currentAnimateTimings.delay;
            if (astType == 6 /* Style */) {
                this.visitStyle(/** @type {?} */ (ast.styles), context);
            }
        }
        context.currentAnimateTimings = null;
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitStyle = function (ast, context) {
        var /** @type {?} */ styleData = normalizeStyles(ast.styles);
        var /** @type {?} */ timings = context.currentAnimateTimings;
        var /** @type {?} */ endTime = context.currentTime;
        var /** @type {?} */ startTime = context.currentTime;
        if (timings && startTime > 0) {
            startTime -= timings.duration + timings.delay;
        }
        Object.keys(styleData).forEach(function (prop) {
            var /** @type {?} */ collectedEntry = context.collectedStyles[prop];
            var /** @type {?} */ updateCollectedStyle = true;
            if (collectedEntry) {
                if (startTime != endTime && startTime >= collectedEntry.startTime &&
                    endTime <= collectedEntry.endTime) {
                    context.errors.push("The CSS property \"" + prop + "\" that exists between the times of \"" + collectedEntry.startTime + "ms\" and \"" + collectedEntry.endTime + "ms\" is also being animated in a parallel animation between the times of \"" + startTime + "ms\" and \"" + endTime + "ms\"");
                    updateCollectedStyle = false;
                }
                // we always choose the smaller start time value since we
                // want to have a record of the entire animation window where
                // the style property is being animated in between
                startTime = collectedEntry.startTime;
            }
            if (updateCollectedStyle) {
                context.collectedStyles[prop] = { startTime: startTime, endTime: endTime };
            }
        });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationValidatorVisitor.prototype.visitKeyframeSequence = function (ast, context) {
        var _this = this;
        var /** @type {?} */ totalKeyframesWithOffsets = 0;
        var /** @type {?} */ offsets = [];
        var /** @type {?} */ offsetsOutOfOrder = false;
        var /** @type {?} */ keyframesOutOfRange = false;
        var /** @type {?} */ previousOffset = 0;
        ast.steps.forEach(function (step) {
            var /** @type {?} */ styleData = normalizeStyles(step.styles);
            var /** @type {?} */ offset = 0;
            if (styleData.hasOwnProperty('offset')) {
                totalKeyframesWithOffsets++;
                offset = (styleData['offset']);
            }
            keyframesOutOfRange = keyframesOutOfRange || offset < 0 || offset > 1;
            offsetsOutOfOrder = offsetsOutOfOrder || offset < previousOffset;
            previousOffset = offset;
            offsets.push(offset);
        });
        if (keyframesOutOfRange) {
            context.errors.push("Please ensure that all keyframe offsets are between 0 and 1");
        }
        if (offsetsOutOfOrder) {
            context.errors.push("Please ensure that all keyframe offsets are in order");
        }
        var /** @type {?} */ length = ast.steps.length;
        var /** @type {?} */ generatedOffset = 0;
        if (totalKeyframesWithOffsets > 0 && totalKeyframesWithOffsets < length) {
            context.errors.push("Not all style() steps within the declared keyframes() contain offsets");
        }
        else if (totalKeyframesWithOffsets == 0) {
            generatedOffset = 1 / length;
        }
        var /** @type {?} */ limit = length - 1;
        var /** @type {?} */ currentTime = context.currentTime;
        var /** @type {?} */ animateDuration = ((context.currentAnimateTimings)).duration;
        ast.steps.forEach(function (step, i) {
            var /** @type {?} */ offset = generatedOffset > 0 ? (i == limit ? 1 : (generatedOffset * i)) : offsets[i];
            var /** @type {?} */ durationUpToThisFrame = offset * animateDuration;
            context.currentTime =
                currentTime + ((context.currentAnimateTimings)).delay + durationUpToThisFrame; /** @type {?} */
            ((context.currentAnimateTimings)).duration = durationUpToThisFrame;
            _this.visitStyle(step, context);
        });
    };
    return AnimationValidatorVisitor;
}());
var AnimationValidatorContext = (function () {
    function AnimationValidatorContext() {
        this.errors = [];
        this.currentTime = 0;
        this.collectedStyles = {};
    }
    return AnimationValidatorContext;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@experimental Animation support is experimental.
 * @param {?} name
 * @param {?} definitions
 * @return {?}
 */
function buildTrigger(name, definitions) {
    return new AnimationTriggerVisitor().buildTrigger(name, definitions);
}
/**
 * \@experimental Animation support is experimental.
 */
var AnimationTrigger = (function () {
    /**
     * @param {?} name
     * @param {?} states
     * @param {?} _transitionAsts
     */
    function AnimationTrigger(name, states, _transitionAsts) {
        var _this = this;
        this.name = name;
        this._transitionAsts = _transitionAsts;
        this.transitionFactories = [];
        this.states = {};
        Object.keys(states).forEach(function (stateName) { _this.states[stateName] = copyStyles(states[stateName], false); });
        var errors = [];
        _transitionAsts.forEach(function (ast) {
            var exprs = parseTransitionExpr(ast.expr, errors);
            var sequenceErrors = validateAnimationSequence(ast);
            if (sequenceErrors.length) {
                errors.push.apply(errors, sequenceErrors);
            }
            else {
                _this.transitionFactories.push(new AnimationTransitionFactory(_this.name, ast, exprs, states));
            }
        });
        if (errors.length) {
            var LINE_START = '\n - ';
            throw new Error("Animation parsing for the " + name + " trigger have failed:" + LINE_START + errors.join(LINE_START));
        }
    }
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @return {?}
     */
    AnimationTrigger.prototype.createFallbackInstruction = function (currentState, nextState) {
        var /** @type {?} */ backupStateStyles = this.states['*'] || {};
        var /** @type {?} */ currentStateStyles = this.states[currentState] || backupStateStyles;
        var /** @type {?} */ nextStateStyles = this.states[nextState] || backupStateStyles;
        return createTransitionInstruction(this.name, currentState, nextState, nextState == 'void', currentStateStyles, nextStateStyles, []);
    };
    /**
     * @param {?} currentState
     * @param {?} nextState
     * @return {?}
     */
    AnimationTrigger.prototype.matchTransition = function (currentState, nextState) {
        for (var /** @type {?} */ i = 0; i < this.transitionFactories.length; i++) {
            var /** @type {?} */ result = this.transitionFactories[i].match(currentState, nextState);
            if (result)
                return result;
        }
        return null;
    };
    return AnimationTrigger;
}());
var AnimationTriggerContext = (function () {
    function AnimationTriggerContext() {
        this.errors = [];
        this.states = {};
        this.transitions = [];
    }
    return AnimationTriggerContext;
}());
var AnimationTriggerVisitor = (function () {
    function AnimationTriggerVisitor() {
    }
    /**
     * @param {?} name
     * @param {?} definitions
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.buildTrigger = function (name, definitions) {
        var _this = this;
        var /** @type {?} */ context = new AnimationTriggerContext();
        definitions.forEach(function (def) { return visitAnimationNode(_this, def, context); });
        return new AnimationTrigger(name, context.states, context.transitions);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitState = function (ast, context) {
        var /** @type {?} */ styles = normalizeStyles(ast.styles.styles);
        ast.name.split(/\s*,\s*/).forEach(function (name) { context.states[name] = styles; });
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitTransition = function (ast, context) {
        context.transitions.push(ast);
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitSequence = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitGroup = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitAnimate = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitStyle = function (ast, context) {
        // these values are not visited in this AST
    };
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    AnimationTriggerVisitor.prototype.visitKeyframeSequence = function (ast, context) {
        // these values are not visited in this AST
    };
    return AnimationTriggerVisitor;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MARKED_FOR_ANIMATION_CLASSNAME = 'ng-animating';
var MARKED_FOR_ANIMATION_SELECTOR = '.ng-animating';
var MARKED_FOR_REMOVAL = '$$ngRemove';
var VOID_STATE = 'void';
var DomAnimationEngine = (function () {
    /**
     * @param {?} _driver
     * @param {?} _normalizer
     */
    function DomAnimationEngine(_driver, _normalizer) {
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._flaggedInserts = new Set();
        this._queuedRemovals = new Map();
        this._queuedTransitionAnimations = [];
        this._activeTransitionAnimations = new Map();
        this._activeElementAnimations = new Map();
        this._elementTriggerStates = new Map();
        this._triggers = Object.create(null);
        this._triggerListeners = new Map();
        this._pendingListenerRemovals = new Map();
    }
    Object.defineProperty(DomAnimationEngine.prototype, "queuedPlayers", {
        /**
         * @return {?}
         */
        get: function () {
            return this._queuedTransitionAnimations.map(function (q) { return q.player; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomAnimationEngine.prototype, "activePlayers", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ players = [];
            this._activeElementAnimations.forEach(function (activePlayers) { return players.push.apply(players, activePlayers); });
            return players;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} trigger
     * @param {?=} name
     * @return {?}
     */
    DomAnimationEngine.prototype.registerTrigger = function (trigger, name) {
        name = name || trigger.name;
        if (this._triggers[name]) {
            return;
        }
        this._triggers[name] = buildTrigger(name, trigger.definitions);
    };
    /**
     * @param {?} element
     * @param {?} domFn
     * @return {?}
     */
    DomAnimationEngine.prototype.onInsert = function (element, domFn) {
        if (element['nodeType'] == 1) {
            this._flaggedInserts.add(element);
        }
        domFn();
    };
    /**
     * @param {?} element
     * @param {?} domFn
     * @return {?}
     */
    DomAnimationEngine.prototype.onRemove = function (element, domFn) {
        var _this = this;
        if (element['nodeType'] != 1) {
            domFn();
            return;
        }
        var /** @type {?} */ lookupRef = this._elementTriggerStates.get(element);
        if (lookupRef) {
            var /** @type {?} */ possibleTriggers = Object.keys(lookupRef);
            var /** @type {?} */ hasRemoval = possibleTriggers.some(function (triggerName) {
                var /** @type {?} */ oldValue = ((lookupRef))[triggerName];
                var /** @type {?} */ instruction = _this._triggers[triggerName].matchTransition(oldValue, VOID_STATE);
                return !!instruction;
            });
            if (hasRemoval) {
                element[MARKED_FOR_REMOVAL] = true;
                this._queuedRemovals.set(element, domFn);
                return;
            }
        }
        // this means that there are no animations to take on this
        // leave operation therefore we should fire the done|start callbacks
        if (this._triggerListeners.has(element)) {
            element[MARKED_FOR_REMOVAL] = true;
            this._queuedRemovals.set(element, function () { });
        }
        this._onRemovalTransition(element).forEach(function (player) { return player.destroy(); });
        domFn();
    };
    /**
     * @param {?} element
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    DomAnimationEngine.prototype.setProperty = function (element, property, value) {
        var /** @type {?} */ trigger = this._triggers[property];
        if (!trigger) {
            throw new Error("The provided animation trigger \"" + property + "\" has not been registered!");
        }
        var /** @type {?} */ lookupRef = this._elementTriggerStates.get(element);
        if (!lookupRef) {
            this._elementTriggerStates.set(element, lookupRef = {});
        }
        var /** @type {?} */ oldValue = lookupRef.hasOwnProperty(property) ? lookupRef[property] : VOID_STATE;
        if (oldValue !== value) {
            value = normalizeTriggerValue(value);
            var /** @type {?} */ instruction = trigger.matchTransition(oldValue, value);
            if (!instruction) {
                // we do this to make sure we always have an animation player so
                // that callback operations are properly called
                instruction = trigger.createFallbackInstruction(oldValue, value);
            }
            this.animateTransition(element, instruction);
            lookupRef[property] = value;
        }
    };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} eventPhase
     * @param {?} callback
     * @return {?}
     */
    DomAnimationEngine.prototype.listen = function (element, eventName, eventPhase, callback) {
        var _this = this;
        if (!eventPhase) {
            throw new Error("Unable to listen on the animation trigger \"" + eventName + "\" because the provided event is undefined!");
        }
        if (!this._triggers[eventName]) {
            throw new Error("Unable to listen on the animation trigger event \"" + eventPhase + "\" because the animation trigger \"" + eventName + "\" doesn't exist!");
        }
        var /** @type {?} */ elementListeners = this._triggerListeners.get(element);
        if (!elementListeners) {
            this._triggerListeners.set(element, elementListeners = []);
        }
        validatePlayerEvent(eventName, eventPhase);
        var /** @type {?} */ tuple = ({ triggerName: eventName, phase: eventPhase, callback: callback });
        elementListeners.push(tuple);
        return function () {
            // this is queued up in the event that a removal animation is set
            // to fire on the element (the listeners need to be set during flush)
            getOrSetAsInMap(_this._pendingListenerRemovals, element, []).push(tuple);
        };
    };
    /**
     * @return {?}
     */
    DomAnimationEngine.prototype._clearPendingListenerRemovals = function () {
        var _this = this;
        this._pendingListenerRemovals.forEach(function (tuples, element) {
            var /** @type {?} */ elementListeners = _this._triggerListeners.get(element);
            if (elementListeners) {
                tuples.forEach(function (tuple) {
                    var /** @type {?} */ index = elementListeners.indexOf(tuple);
                    if (index >= 0) {
                        elementListeners.splice(index, 1);
                    }
                });
            }
        });
        this._pendingListenerRemovals.clear();
    };
    /**
     * @param {?} element
     * @return {?}
     */
    DomAnimationEngine.prototype._onRemovalTransition = function (element) {
        // when a parent animation is set to trigger a removal we want to
        // find all of the children that are currently animating and clear
        // them out by destroying each of them.
        var /** @type {?} */ elms = element.querySelectorAll(MARKED_FOR_ANIMATION_SELECTOR);
        var _loop_1 = function (i) {
            var /** @type {?} */ elm = elms[i];
            var /** @type {?} */ activePlayers = this_1._activeElementAnimations.get(elm);
            if (activePlayers) {
                activePlayers.forEach(function (player) { return player.destroy(); });
            }
            var /** @type {?} */ activeTransitions = this_1._activeTransitionAnimations.get(elm);
            if (activeTransitions) {
                Object.keys(activeTransitions).forEach(function (triggerName) {
                    var /** @type {?} */ player = activeTransitions[triggerName];
                    if (player) {
                        player.destroy();
                    }
                });
            }
        };
        var this_1 = this;
        for (var /** @type {?} */ i = 0; i < elms.length; i++) {
            _loop_1(/** @type {?} */ i);
        }
        // we make a copy of the array because the actual source array is modified
        // each time a player is finished/destroyed (the forEach loop would fail otherwise)
        return copyArray(/** @type {?} */ ((this._activeElementAnimations.get(element))));
    };
    /**
     * @param {?} element
     * @param {?} instruction
     * @return {?}
     */
    DomAnimationEngine.prototype.animateTransition = function (element, instruction) {
        var _this = this;
        var /** @type {?} */ triggerName = instruction.triggerName;
        var /** @type {?} */ previousPlayers;
        if (instruction.isRemovalTransition) {
            previousPlayers = this._onRemovalTransition(element);
        }
        else {
            previousPlayers = [];
            var /** @type {?} */ existingTransitions = this._activeTransitionAnimations.get(element);
            var /** @type {?} */ existingPlayer = existingTransitions ? existingTransitions[triggerName] : null;
            if (existingPlayer) {
                previousPlayers.push(existingPlayer);
            }
        }
        // it's important to do this step before destroying the players
        // so that the onDone callback below won't fire before this
        eraseStyles(element, instruction.fromStyles);
        // we first run this so that the previous animation player
        // data can be passed into the successive animation players
        var /** @type {?} */ totalTime = 0;
        var /** @type {?} */ players = instruction.timelines.map(function (timelineInstruction, i) {
            totalTime = Math.max(totalTime, timelineInstruction.totalTime);
            return _this._buildPlayer(element, timelineInstruction, previousPlayers, i);
        });
        previousPlayers.forEach(function (previousPlayer) { return previousPlayer.destroy(); });
        var /** @type {?} */ player = optimizeGroupPlayer(players);
        player.onDone(function () {
            player.destroy();
            var /** @type {?} */ elmTransitionMap = _this._activeTransitionAnimations.get(element);
            if (elmTransitionMap) {
                delete elmTransitionMap[triggerName];
                if (Object.keys(elmTransitionMap).length == 0) {
                    _this._activeTransitionAnimations.delete(element);
                }
            }
            deleteFromArrayMap(_this._activeElementAnimations, element, player);
            setStyles(element, instruction.toStyles);
        });
        var /** @type {?} */ elmTransitionMap = getOrSetAsInMap(this._activeTransitionAnimations, element, {});
        elmTransitionMap[triggerName] = player;
        this._queuePlayer(element, triggerName, player, makeAnimationEvent(element, triggerName, instruction.fromState, instruction.toState, null, // this will be filled in during event creation
        totalTime));
        return player;
    };
    /**
     * @param {?} element
     * @param {?} instructions
     * @param {?=} previousPlayers
     * @return {?}
     */
    DomAnimationEngine.prototype.animateTimeline = function (element, instructions, previousPlayers) {
        var _this = this;
        if (previousPlayers === void 0) { previousPlayers = []; }
        var /** @type {?} */ players = instructions.map(function (instruction, i) {
            var /** @type {?} */ player = _this._buildPlayer(element, instruction, previousPlayers, i);
            player.onDestroy(function () { deleteFromArrayMap(_this._activeElementAnimations, element, player); });
            _this._markPlayerAsActive(element, player);
            return player;
        });
        return optimizeGroupPlayer(players);
    };
    /**
     * @param {?} element
     * @param {?} instruction
     * @param {?} previousPlayers
     * @param {?=} index
     * @return {?}
     */
    DomAnimationEngine.prototype._buildPlayer = function (element, instruction, previousPlayers, index) {
        if (index === void 0) { index = 0; }
        // only the very first animation can absorb the previous styles. This
        // is here to prevent the an overlap situation where a group animation
        // absorbs previous styles multiple times for the same element.
        if (index && previousPlayers.length) {
            previousPlayers = [];
        }
        return this._driver.animate(element, this._normalizeKeyframes(instruction.keyframes), instruction.duration, instruction.delay, instruction.easing, previousPlayers);
    };
    /**
     * @param {?} keyframes
     * @return {?}
     */
    DomAnimationEngine.prototype._normalizeKeyframes = function (keyframes) {
        var _this = this;
        var /** @type {?} */ errors = [];
        var /** @type {?} */ normalizedKeyframes = [];
        keyframes.forEach(function (kf) {
            var /** @type {?} */ normalizedKeyframe = {};
            Object.keys(kf).forEach(function (prop) {
                var /** @type {?} */ normalizedProp = prop;
                var /** @type {?} */ normalizedValue = kf[prop];
                if (prop != 'offset') {
                    normalizedProp = _this._normalizer.normalizePropertyName(prop, errors);
                    normalizedValue =
                        _this._normalizer.normalizeStyleValue(prop, normalizedProp, kf[prop], errors);
                }
                normalizedKeyframe[normalizedProp] = normalizedValue;
            });
            normalizedKeyframes.push(normalizedKeyframe);
        });
        if (errors.length) {
            var /** @type {?} */ LINE_START = '\n - ';
            throw new Error("Unable to animate due to the following errors:" + LINE_START + errors.join(LINE_START));
        }
        return normalizedKeyframes;
    };
    /**
     * @param {?} element
     * @param {?} player
     * @return {?}
     */
    DomAnimationEngine.prototype._markPlayerAsActive = function (element, player) {
        var /** @type {?} */ elementAnimations = getOrSetAsInMap(this._activeElementAnimations, element, []);
        elementAnimations.push(player);
    };
    /**
     * @param {?} element
     * @param {?} triggerName
     * @param {?} player
     * @param {?} event
     * @return {?}
     */
    DomAnimationEngine.prototype._queuePlayer = function (element, triggerName, player, event) {
        var /** @type {?} */ tuple = ({ element: element, player: player, triggerName: triggerName, event: event });
        this._queuedTransitionAnimations.push(tuple);
        player.init();
        element.classList.add(MARKED_FOR_ANIMATION_CLASSNAME);
        player.onDone(function () { element.classList.remove(MARKED_FOR_ANIMATION_CLASSNAME); });
    };
    /**
     * @return {?}
     */
    DomAnimationEngine.prototype._flushQueuedAnimations = function () {
        var _loop_2 = function () {
            var _a = ((this_2._queuedTransitionAnimations.shift())), player = _a.player, element = _a.element, triggerName = _a.triggerName, event = _a.event;
            var /** @type {?} */ parent = element;
            while (parent = parent.parentNode) {
                // this means that a parent element will or will not
                // have its own animation operation which in this case
                // there's no point in even trying to do an animation
                if (parent[MARKED_FOR_REMOVAL])
                    return "continue-parentLoop";
            }
            var /** @type {?} */ listeners = this_2._triggerListeners.get(element);
            if (listeners) {
                listeners.forEach(function (tuple) {
                    if (tuple.triggerName == triggerName) {
                        listenOnPlayer(player, tuple.phase, event, tuple.callback);
                    }
                });
            }
            // if a removal exists for the given element then we need cancel
            // all the queued players so that a proper removal animation can go
            if (this_2._queuedRemovals.has(element)) {
                player.destroy();
                return "continue";
            }
            this_2._markPlayerAsActive(element, player);
            // in the event that an animation throws an error then we do
            // not want to re-run animations on any previous animations
            // if they have already been kicked off beforehand
            player.init();
            if (!player.hasStarted()) {
                player.play();
            }
        };
        var this_2 = this;
        parentLoop: while (this._queuedTransitionAnimations.length) {
            var state_1 = _loop_2();
            switch (state_1) {
                case "continue-parentLoop": continue parentLoop;
            }
        }
    };
    /**
     * @return {?}
     */
    DomAnimationEngine.prototype.flush = function () {
        var _this = this;
        var /** @type {?} */ leaveListeners = new Map();
        this._queuedRemovals.forEach(function (callback, element) {
            var /** @type {?} */ tuple = _this._pendingListenerRemovals.get(element);
            if (tuple) {
                leaveListeners.set(element, tuple);
                _this._pendingListenerRemovals.delete(element);
            }
        });
        this._clearPendingListenerRemovals();
        this._pendingListenerRemovals = leaveListeners;
        this._flushQueuedAnimations();
        var /** @type {?} */ flushAgain = false;
        this._queuedRemovals.forEach(function (callback, element) {
            // an item that was inserted/removed in the same flush means
            // that an animation should not happen anyway
            if (_this._flaggedInserts.has(element))
                return;
            var /** @type {?} */ parent = element;
            var /** @type {?} */ players = [];
            while (parent = parent.parentNode) {
                // there is no reason to even try to
                if (parent[MARKED_FOR_REMOVAL]) {
                    callback();
                    return;
                }
                var /** @type {?} */ match = _this._activeElementAnimations.get(parent);
                if (match) {
                    players.push.apply(players, match);
                    break;
                }
            }
            // the loop was unable to find an parent that is animating even
            // though this element has set to be removed, so the algorithm
            // should check to see if there are any triggers on the element
            // that are present to handle a leave animation and then setup
            // those players to facilitate the callback after done
            if (players.length == 0) {
                // this means that the element has valid state triggers
                var /** @type {?} */ stateDetails_1 = _this._elementTriggerStates.get(element);
                if (stateDetails_1) {
                    Object.keys(stateDetails_1).forEach(function (triggerName) {
                        flushAgain = true;
                        var /** @type {?} */ oldValue = stateDetails_1[triggerName];
                        var /** @type {?} */ instruction = _this._triggers[triggerName].matchTransition(oldValue, VOID_STATE);
                        if (instruction) {
                            players.push(_this.animateTransition(element, instruction));
                        }
                        else {
                            var /** @type {?} */ event = makeAnimationEvent(element, triggerName, oldValue, VOID_STATE, '', 0);
                            var /** @type {?} */ player = new __WEBPACK_IMPORTED_MODULE_0__angular_animations__["NoopAnimationPlayer"]();
                            _this._queuePlayer(element, triggerName, player, event);
                        }
                    });
                }
            }
            if (players.length) {
                optimizeGroupPlayer(players).onDone(callback);
            }
            else {
                callback();
            }
        });
        this._queuedRemovals.clear();
        this._flaggedInserts.clear();
        // this means that one or more leave animations were detected
        if (flushAgain) {
            this._flushQueuedAnimations();
            this._clearPendingListenerRemovals();
        }
    };
    return DomAnimationEngine;
}());
/**
 * @param {?} map
 * @param {?} key
 * @param {?} defaultValue
 * @return {?}
 */
function getOrSetAsInMap(map, key, defaultValue) {
    var /** @type {?} */ value = map.get(key);
    if (!value) {
        map.set(key, value = defaultValue);
    }
    return value;
}
/**
 * @param {?} map
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
function deleteFromArrayMap(map, key, value) {
    var /** @type {?} */ arr = map.get(key);
    if (arr) {
        var /** @type {?} */ index = arr.indexOf(value);
        if (index >= 0) {
            arr.splice(index, 1);
            if (arr.length == 0) {
                map.delete(key);
            }
        }
    }
}
/**
 * @param {?} players
 * @return {?}
 */
function optimizeGroupPlayer(players) {
    switch (players.length) {
        case 0:
            return new __WEBPACK_IMPORTED_MODULE_0__angular_animations__["NoopAnimationPlayer"]();
        case 1:
            return players[0];
        default:
            return new __WEBPACK_IMPORTED_MODULE_0__angular_animations__["ɵAnimationGroupPlayer"](players);
    }
}
/**
 * @param {?} source
 * @return {?}
 */
function copyArray(source) {
    return source ? source.splice(0) : [];
}
/**
 * @param {?} triggerName
 * @param {?} eventName
 * @return {?}
 */
function validatePlayerEvent(triggerName, eventName) {
    switch (eventName) {
        case 'start':
        case 'done':
            return;
        default:
            throw new Error("The provided animation trigger event \"" + eventName + "\" for the animation trigger \"" + triggerName + "\" is not supported!");
    }
}
/**
 * @param {?} player
 * @param {?} eventName
 * @param {?} baseEvent
 * @param {?} callback
 * @return {?}
 */
function listenOnPlayer(player, eventName, baseEvent, callback) {
    switch (eventName) {
        case 'start':
            player.onStart(function () {
                var /** @type {?} */ event = copyAnimationEvent(baseEvent);
                event.phaseName = 'start';
                callback(event);
            });
            break;
        case 'done':
            player.onDone(function () {
                var /** @type {?} */ event = copyAnimationEvent(baseEvent);
                event.phaseName = 'done';
                callback(event);
            });
            break;
    }
}
/**
 * @param {?} e
 * @return {?}
 */
function copyAnimationEvent(e) {
    return makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, e.phaseName, e.totalTime);
}
/**
 * @param {?} element
 * @param {?} triggerName
 * @param {?} fromState
 * @param {?} toState
 * @param {?} phaseName
 * @param {?} totalTime
 * @return {?}
 */
function makeAnimationEvent(element, triggerName, fromState, toState, phaseName, totalTime) {
    return ({ element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime });
}
/**
 * @param {?} value
 * @return {?}
 */
function normalizeTriggerValue(value) {
    switch (typeof value) {
        case 'boolean':
            return value ? '1' : '0';
        default:
            return value ? value.toString() : null;
    }
}
/**
 * \@experimental Animation support is experimental.
 * @abstract
 */
var AnimationStyleNormalizer = (function () {
    function AnimationStyleNormalizer() {
    }
    /**
     * @abstract
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    AnimationStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) { };
    /**
     * @abstract
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    AnimationStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) { };
    return AnimationStyleNormalizer;
}());
/**
 * \@experimental Animation support is experimental.
 */
var NoopAnimationStyleNormalizer = (function () {
    function NoopAnimationStyleNormalizer() {
    }
    /**
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    NoopAnimationStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) { return propertyName; };
    /**
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    NoopAnimationStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        return (value);
    };
    return NoopAnimationStyleNormalizer;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Animation = (function () {
    /**
     * @param {?} input
     */
    function Animation(input) {
        var ast = Array.isArray(input) ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_animations__["sequence"])(input) : input;
        var errors = validateAnimationSequence(ast);
        if (errors.length) {
            var errorMessage = "animation validation failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        this._animationAst = ast;
    }
    /**
     * @param {?} startingStyles
     * @param {?} destinationStyles
     * @return {?}
     */
    Animation.prototype.buildTimelines = function (startingStyles, destinationStyles) {
        var /** @type {?} */ start = Array.isArray(startingStyles) ? normalizeStyles(startingStyles) : (startingStyles);
        var /** @type {?} */ dest = Array.isArray(destinationStyles) ? normalizeStyles(destinationStyles) : (destinationStyles);
        return buildAnimationKeyframes(this._animationAst, start, dest);
    };
    /**
     * @param {?} injector
     * @param {?} element
     * @param {?=} startingStyles
     * @param {?=} destinationStyles
     * @return {?}
     */
    Animation.prototype.create = function (injector, element, startingStyles, destinationStyles) {
        if (startingStyles === void 0) { startingStyles = {}; }
        if (destinationStyles === void 0) { destinationStyles = {}; }
        var /** @type {?} */ instructions = this.buildTimelines(startingStyles, destinationStyles);
        // note the code below is only here to make the tests happy (once the new renderer is
        // within core then the code below will interact with Renderer.transition(...))
        var /** @type {?} */ driver = injector.get(AnimationDriver);
        var /** @type {?} */ normalizer = injector.get(AnimationStyleNormalizer);
        var /** @type {?} */ engine = new DomAnimationEngine(driver, normalizer);
        return engine.animateTimeline(element, instructions);
    };
    return Animation;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WebAnimationsStyleNormalizer = (function (_super) {
    __extends(WebAnimationsStyleNormalizer, _super);
    function WebAnimationsStyleNormalizer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} propertyName
     * @param {?} errors
     * @return {?}
     */
    WebAnimationsStyleNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        return dashCaseToCamelCase(propertyName);
    };
    /**
     * @param {?} userProvidedProperty
     * @param {?} normalizedProperty
     * @param {?} value
     * @param {?} errors
     * @return {?}
     */
    WebAnimationsStyleNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        var /** @type {?} */ unit = '';
        var /** @type {?} */ strVal = value.toString().trim();
        if (DIMENSIONAL_PROP_MAP[normalizedProperty] && value !== 0 && value !== '0') {
            if (typeof value === 'number') {
                unit = 'px';
            }
            else {
                var /** @type {?} */ valAndSuffixMatch = value.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errors.push("Please provide a CSS unit value for " + userProvidedProperty + ":" + value);
                }
            }
        }
        return strVal + unit;
    };
    return WebAnimationsStyleNormalizer;
}(AnimationStyleNormalizer));
var DIMENSIONAL_PROP_MAP = makeBooleanMap('width,height,minWidth,minHeight,maxWidth,maxHeight,left,top,bottom,right,fontSize,outlineWidth,outlineOffset,paddingTop,paddingLeft,paddingBottom,paddingRight,marginTop,marginLeft,marginBottom,marginRight,borderRadius,borderWidth,borderTopWidth,borderLeftWidth,borderRightWidth,borderBottomWidth,textIndent'
    .split(','));
/**
 * @param {?} keys
 * @return {?}
 */
function makeBooleanMap(keys) {
    var /** @type {?} */ map = {};
    keys.forEach(function (key) { return map[key] = true; });
    return map;
}
var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
/**
 * @param {?} input
 * @return {?}
 */
function dashCaseToCamelCase(input) {
    return input.replace(DASH_CASE_REGEXP, function () {
        var m = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            m[_i] = arguments[_i];
        }
        return m[1].toUpperCase();
    });
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var DEFAULT_STATE_VALUE = 'void';
var DEFAULT_STATE_STYLES = '*';
var NoopAnimationEngine = (function (_super) {
    __extends(NoopAnimationEngine, _super);
    function NoopAnimationEngine() {
        var _this = _super.apply(this, arguments) || this;
        _this._listeners = new Map();
        _this._changes = [];
        _this._flaggedRemovals = new Set();
        _this._onDoneFns = [];
        _this._triggerStyles = Object.create(null);
        return _this;
    }
    /**
     * @param {?} trigger
     * @param {?=} name
     * @return {?}
     */
    NoopAnimationEngine.prototype.registerTrigger = function (trigger, name) {
        name = name || trigger.name;
        if (this._triggerStyles[name]) {
            return;
        }
        var /** @type {?} */ stateMap = {};
        trigger.definitions.forEach(function (def) {
            if (def.type === 0 /* State */) {
                var /** @type {?} */ stateDef = (def);
                stateMap[stateDef.name] = normalizeStyles(stateDef.styles.styles);
            }
        });
        this._triggerStyles[name] = stateMap;
    };
    /**
     * @param {?} element
     * @param {?} domFn
     * @return {?}
     */
    NoopAnimationEngine.prototype.onInsert = function (element, domFn) { domFn(); };
    /**
     * @param {?} element
     * @param {?} domFn
     * @return {?}
     */
    NoopAnimationEngine.prototype.onRemove = function (element, domFn) {
        domFn();
        if (element['nodeType'] == 1) {
            this._flaggedRemovals.add(element);
        }
    };
    /**
     * @param {?} element
     * @param {?} property
     * @param {?} value
     * @return {?}
     */
    NoopAnimationEngine.prototype.setProperty = function (element, property, value) {
        var /** @type {?} */ storageProp = makeStorageProp(property);
        var /** @type {?} */ oldValue = element[storageProp] || DEFAULT_STATE_VALUE;
        this._changes.push(/** @type {?} */ ({ element: element, oldValue: oldValue, newValue: value, triggerName: property }));
        var /** @type {?} */ triggerStateStyles = this._triggerStyles[property] || {};
        var /** @type {?} */ fromStateStyles = triggerStateStyles[oldValue] || triggerStateStyles[DEFAULT_STATE_STYLES];
        if (fromStateStyles) {
            eraseStyles(element, fromStateStyles);
        }
        element[storageProp] = value;
        this._onDoneFns.push(function () {
            var /** @type {?} */ toStateStyles = triggerStateStyles[value] || triggerStateStyles[DEFAULT_STATE_STYLES];
            if (toStateStyles) {
                setStyles(element, toStateStyles);
            }
        });
    };
    /**
     * @param {?} element
     * @param {?} eventName
     * @param {?} eventPhase
     * @param {?} callback
     * @return {?}
     */
    NoopAnimationEngine.prototype.listen = function (element, eventName, eventPhase, callback) {
        var /** @type {?} */ listeners = this._listeners.get(element);
        if (!listeners) {
            this._listeners.set(element, listeners = []);
        }
        var /** @type {?} */ tuple = ({ triggerName: eventName, eventPhase: eventPhase, callback: callback });
        listeners.push(tuple);
        return function () { return tuple.doRemove = true; };
    };
    /**
     * @return {?}
     */
    NoopAnimationEngine.prototype.flush = function () {
        var _this = this;
        var /** @type {?} */ onStartCallbacks = [];
        var /** @type {?} */ onDoneCallbacks = [];
        /**
         * @param {?} listener
         * @param {?} data
         * @return {?}
         */
        function handleListener(listener, data) {
            var /** @type {?} */ phase = listener.eventPhase;
            var /** @type {?} */ event = makeAnimationEvent$1(data.element, data.triggerName, data.oldValue, data.newValue, phase, 0);
            if (phase == 'start') {
                onStartCallbacks.push(function () { return listener.callback(event); });
            }
            else if (phase == 'done') {
                onDoneCallbacks.push(function () { return listener.callback(event); });
            }
        }
        this._changes.forEach(function (change) {
            var /** @type {?} */ element = change.element;
            var /** @type {?} */ listeners = _this._listeners.get(element);
            if (listeners) {
                listeners.forEach(function (listener) {
                    if (listener.triggerName == change.triggerName) {
                        handleListener(listener, change);
                    }
                });
            }
        });
        // upon removal ALL the animation triggers need to get fired
        this._flaggedRemovals.forEach(function (element) {
            var /** @type {?} */ listeners = _this._listeners.get(element);
            if (listeners) {
                listeners.forEach(function (listener) {
                    var /** @type {?} */ triggerName = listener.triggerName;
                    var /** @type {?} */ storageProp = makeStorageProp(triggerName);
                    handleListener(listener, /** @type {?} */ ({
                        element: element,
                        triggerName: triggerName,
                        oldValue: element[storageProp] || DEFAULT_STATE_VALUE,
                        newValue: DEFAULT_STATE_VALUE
                    }));
                });
            }
        });
        // remove all the listeners after everything is complete
        Array.from(this._listeners.keys()).forEach(function (element) {
            var /** @type {?} */ listenersToKeep = ((_this._listeners.get(element))).filter(function (l) { return !l.doRemove; });
            if (listenersToKeep.length) {
                _this._listeners.set(element, listenersToKeep);
            }
            else {
                _this._listeners.delete(element);
            }
        });
        onStartCallbacks.forEach(function (fn) { return fn(); });
        onDoneCallbacks.forEach(function (fn) { return fn(); });
        this._flaggedRemovals.clear();
        this._changes = [];
        this._onDoneFns.forEach(function (doneFn) { return doneFn(); });
        this._onDoneFns = [];
    };
    Object.defineProperty(NoopAnimationEngine.prototype, "activePlayers", {
        /**
         * @return {?}
         */
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NoopAnimationEngine.prototype, "queuedPlayers", {
        /**
         * @return {?}
         */
        get: function () { return []; },
        enumerable: true,
        configurable: true
    });
    return NoopAnimationEngine;
}(AnimationEngine));
/**
 * @param {?} element
 * @param {?} triggerName
 * @param {?} fromState
 * @param {?} toState
 * @param {?} phaseName
 * @param {?} totalTime
 * @return {?}
 */
function makeAnimationEvent$1(element, triggerName, fromState, toState, phaseName, totalTime) {
    return ({ element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime });
}
/**
 * @param {?} property
 * @return {?}
 */
function makeStorageProp(property) {
    return '_@_' + property;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WebAnimationsPlayer = (function () {
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @param {?=} previousPlayers
     */
    function WebAnimationsPlayer(element, keyframes, options, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var _this = this;
        this.element = element;
        this.keyframes = keyframes;
        this.options = options;
        this._onDoneFns = [];
        this._onStartFns = [];
        this._onDestroyFns = [];
        this._initialized = false;
        this._finished = false;
        this._started = false;
        this._destroyed = false;
        this.time = 0;
        this.parentPlayer = null;
        this._duration = options['duration'];
        this._delay = options['delay'] || 0;
        this.time = this._duration + this._delay;
        this.previousStyles = {};
        previousPlayers.forEach(function (player) {
            var styles = player._captureStyles();
            Object.keys(styles).forEach(function (prop) { return _this.previousStyles[prop] = styles[prop]; });
        });
    }
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._onFinish = function () {
        if (!this._finished) {
            this._finished = true;
            this._onDoneFns.forEach(function (fn) { return fn(); });
            this._onDoneFns = [];
        }
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.init = function () {
        var _this = this;
        if (this._initialized)
            return;
        this._initialized = true;
        var /** @type {?} */ keyframes = this.keyframes.map(function (styles) {
            var /** @type {?} */ formattedKeyframe = {};
            Object.keys(styles).forEach(function (prop, index) {
                var /** @type {?} */ value = styles[prop];
                if (value == __WEBPACK_IMPORTED_MODULE_0__angular_animations__["AUTO_STYLE"]) {
                    value = _computeStyle(_this.element, prop);
                }
                if (value != undefined) {
                    formattedKeyframe[prop] = value;
                }
            });
            return formattedKeyframe;
        });
        var /** @type {?} */ previousStyleProps = Object.keys(this.previousStyles);
        if (previousStyleProps.length) {
            var /** @type {?} */ startingKeyframe_1 = keyframes[0];
            var /** @type {?} */ missingStyleProps_1 = [];
            previousStyleProps.forEach(function (prop) {
                if (!startingKeyframe_1.hasOwnProperty(prop)) {
                    missingStyleProps_1.push(prop);
                }
                startingKeyframe_1[prop] = _this.previousStyles[prop];
            });
            if (missingStyleProps_1.length) {
                var /** @type {?} */ self_1 = this;
                var _loop_3 = function () {
                    var /** @type {?} */ kf = keyframes[i];
                    missingStyleProps_1.forEach(function (prop) {
                        kf[prop] = _computeStyle(self_1.element, prop);
                    });
                };
                // tslint:disable-next-line
                for (var /** @type {?} */ i = 1; i < keyframes.length; i++) {
                    _loop_3();
                }
            }
        }
        this._player = this._triggerWebAnimation(this.element, keyframes, this.options);
        this._finalKeyframe =
            keyframes.length ? _copyKeyframeStyles(keyframes[keyframes.length - 1]) : {};
        // this is required so that the player doesn't start to animate right away
        this._resetDomPlayerState();
        this._player.addEventListener('finish', function () { return _this._onFinish(); });
    };
    /**
     * \@internal
     * @param {?} element
     * @param {?} keyframes
     * @param {?} options
     * @return {?}
     */
    WebAnimationsPlayer.prototype._triggerWebAnimation = function (element, keyframes, options) {
        // jscompiler doesn't seem to know animate is a native property because it's not fully
        // supported yet across common browsers (we polyfill it for Edge/Safari) [CL #143630929]
        return (element['animate'](keyframes, options));
    };
    Object.defineProperty(WebAnimationsPlayer.prototype, "domPlayer", {
        /**
         * @return {?}
         */
        get: function () { return this._player; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onStart = function (fn) { this._onStartFns.push(fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onDone = function (fn) { this._onDoneFns.push(fn); };
    /**
     * @param {?} fn
     * @return {?}
     */
    WebAnimationsPlayer.prototype.onDestroy = function (fn) { this._onDestroyFns.push(fn); };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.play = function () {
        this.init();
        if (!this.hasStarted()) {
            this._onStartFns.forEach(function (fn) { return fn(); });
            this._onStartFns = [];
            this._started = true;
        }
        this._player.play();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.pause = function () {
        this.init();
        this._player.pause();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.finish = function () {
        this.init();
        this._onFinish();
        this._player.finish();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.reset = function () {
        this._resetDomPlayerState();
        this._destroyed = false;
        this._finished = false;
        this._started = false;
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._resetDomPlayerState = function () {
        if (this._player) {
            this._player.cancel();
        }
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.restart = function () {
        this.reset();
        this.play();
    };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.hasStarted = function () { return this._started; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.destroy = function () {
        if (!this._destroyed) {
            this._resetDomPlayerState();
            this._onFinish();
            this._destroyed = true;
            this._onDestroyFns.forEach(function (fn) { return fn(); });
            this._onDestroyFns = [];
        }
    };
    /**
     * @param {?} p
     * @return {?}
     */
    WebAnimationsPlayer.prototype.setPosition = function (p) { this._player.currentTime = p * this.time; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype.getPosition = function () { return this._player.currentTime / this.time; };
    /**
     * @return {?}
     */
    WebAnimationsPlayer.prototype._captureStyles = function () {
        var _this = this;
        var /** @type {?} */ styles = {};
        if (this.hasStarted()) {
            Object.keys(this._finalKeyframe).forEach(function (prop) {
                if (prop != 'offset') {
                    styles[prop] =
                        _this._finished ? _this._finalKeyframe[prop] : _computeStyle(_this.element, prop);
                }
            });
        }
        return styles;
    };
    return WebAnimationsPlayer;
}());
/**
 * @param {?} element
 * @param {?} prop
 * @return {?}
 */
function _computeStyle(element, prop) {
    return ((window.getComputedStyle(element)))[prop];
}
/**
 * @param {?} styles
 * @return {?}
 */
function _copyKeyframeStyles(styles) {
    var /** @type {?} */ newStyles = {};
    Object.keys(styles).forEach(function (prop) {
        if (prop != 'offset') {
            newStyles[prop] = styles[prop];
        }
    });
    return newStyles;
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WebAnimationsDriver = (function () {
    function WebAnimationsDriver() {
    }
    /**
     * @param {?} element
     * @param {?} keyframes
     * @param {?} duration
     * @param {?} delay
     * @param {?} easing
     * @param {?=} previousPlayers
     * @return {?}
     */
    WebAnimationsDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        var /** @type {?} */ playerOptions = { 'duration': duration, 'delay': delay, 'fill': 'forwards' };
        // we check for this to avoid having a null|undefined value be present
        // for the easing (which results in an error for certain browsers #9752)
        if (easing) {
            playerOptions['easing'] = easing;
        }
        var /** @type {?} */ previousWebAnimationPlayers = (previousPlayers.filter(function (player) { return player instanceof WebAnimationsPlayer; }));
        return new WebAnimationsPlayer(element, keyframes, playerOptions, previousWebAnimationPlayers);
    };
    return WebAnimationsDriver;
}());
/**
 * @return {?}
 */
function supportsWebAnimations() {
    return typeof Element !== 'undefined' && typeof ((Element)).prototype['animate'] === 'function';
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation browser package.
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the animation package.
 */
/**
 * Generated bundle index. Do not edit.
 */

//# sourceMappingURL=browser.es5.js.map


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserAnimationsModule", function() { return BrowserAnimationsModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoopAnimationsModule", function() { return NoopAnimationsModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵAnimationRenderer", function() { return AnimationRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵAnimationRendererFactory", function() { return AnimationRendererFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵe", function() { return BROWSER_ANIMATIONS_PROVIDERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵf", function() { return BROWSER_NOOP_ANIMATIONS_PROVIDERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵa", function() { return InjectableAnimationEngine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵc", function() { return instantiateDefaultStyleNormalizer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵd", function() { return instantiateRendererFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ɵb", function() { return instantiateSupportedAnimationDriver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__ = __webpack_require__(10);
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @license Angular v4.1.2
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */



/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var AnimationRendererFactory = (function () {
    /**
     * @param {?} delegate
     * @param {?} _engine
     * @param {?} _zone
     */
    function AnimationRendererFactory(delegate, _engine, _zone) {
        this.delegate = delegate;
        this._engine = _engine;
        this._zone = _zone;
    }
    /**
     * @param {?} hostElement
     * @param {?} type
     * @return {?}
     */
    AnimationRendererFactory.prototype.createRenderer = function (hostElement, type) {
        var _this = this;
        var /** @type {?} */ delegate = this.delegate.createRenderer(hostElement, type);
        if (!hostElement || !type || !type.data || !type.data['animation'])
            return delegate;
        var /** @type {?} */ namespaceId = type.id;
        var /** @type {?} */ animationTriggers = (type.data['animation']);
        animationTriggers.forEach(function (trigger) { return _this._engine.registerTrigger(trigger, namespaceify(namespaceId, trigger.name)); });
        return new AnimationRenderer(delegate, this._engine, this._zone, namespaceId);
    };
    return AnimationRendererFactory;
}());
AnimationRendererFactory.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/**
 * @nocollapse
 */
AnimationRendererFactory.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["RendererFactory2"], },
    { type: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["a" /* ɵAnimationEngine */], },
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"], },
]; };
var AnimationRenderer = (function () {
    /**
     * @param {?} delegate
     * @param {?} _engine
     * @param {?} _zone
     * @param {?} _namespaceId
     */
    function AnimationRenderer(delegate, _engine, _zone, _namespaceId) {
        this.delegate = delegate;
        this._engine = _engine;
        this._zone = _zone;
        this._namespaceId = _namespaceId;
        this.destroyNode = null;
        this._flushPromise = null;
        this.destroyNode = this.delegate.destroyNode ? function (n) { return delegate.destroyNode(n); } : null;
    }
    Object.defineProperty(AnimationRenderer.prototype, "data", {
        /**
         * @return {?}
         */
        get: function () { return this.delegate.data; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    AnimationRenderer.prototype.destroy = function () { this.delegate.destroy(); };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    AnimationRenderer.prototype.createElement = function (name, namespace) {
        return this.delegate.createElement(name, namespace);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.createComment = function (value) { return this.delegate.createComment(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.createText = function (value) { return this.delegate.createText(value); };
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    AnimationRenderer.prototype.selectRootElement = function (selectorOrNode) {
        return this.delegate.selectRootElement(selectorOrNode);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    AnimationRenderer.prototype.parentNode = function (node) { return this.delegate.parentNode(node); };
    /**
     * @param {?} node
     * @return {?}
     */
    AnimationRenderer.prototype.nextSibling = function (node) { return this.delegate.nextSibling(node); };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    AnimationRenderer.prototype.setAttribute = function (el, name, value, namespace) {
        this.delegate.setAttribute(el, name, value, namespace);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    AnimationRenderer.prototype.removeAttribute = function (el, name, namespace) {
        this.delegate.removeAttribute(el, name, namespace);
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    AnimationRenderer.prototype.addClass = function (el, name) { this.delegate.addClass(el, name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    AnimationRenderer.prototype.removeClass = function (el, name) { this.delegate.removeClass(el, name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} flags
     * @return {?}
     */
    AnimationRenderer.prototype.setStyle = function (el, style, value, flags) {
        this.delegate.setStyle(el, style, value, flags);
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} flags
     * @return {?}
     */
    AnimationRenderer.prototype.removeStyle = function (el, style, flags) {
        this.delegate.removeStyle(el, style, flags);
    };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.setValue = function (node, value) { this.delegate.setValue(node, value); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    AnimationRenderer.prototype.appendChild = function (parent, newChild) {
        var _this = this;
        this._engine.onInsert(newChild, function () { return _this.delegate.appendChild(parent, newChild); });
        this._queueFlush();
    };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    AnimationRenderer.prototype.insertBefore = function (parent, newChild, refChild) {
        var _this = this;
        this._engine.onInsert(newChild, function () { return _this.delegate.insertBefore(parent, newChild, refChild); });
        this._queueFlush();
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    AnimationRenderer.prototype.removeChild = function (parent, oldChild) {
        var _this = this;
        this._engine.onRemove(oldChild, function () {
            // Note: if an component element has a leave animation, and the component
            // a host leave animation, the view engine will call `removeChild` for the parent
            // component renderer as well as for the child component renderer.
            // Therefore, we need to check if we already removed the element.
            if (_this.delegate.parentNode(oldChild)) {
                _this.delegate.removeChild(parent, oldChild);
            }
        });
        this._queueFlush();
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    AnimationRenderer.prototype.setProperty = function (el, name, value) {
        if (name.charAt(0) == '@') {
            this._engine.setProperty(el, namespaceify(this._namespaceId, name.substr(1)), value);
            this._queueFlush();
        }
        else {
            this.delegate.setProperty(el, name, value);
        }
    };
    /**
     * @param {?} target
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    AnimationRenderer.prototype.listen = function (target, eventName, callback) {
        var _this = this;
        if (eventName.charAt(0) == '@') {
            var /** @type {?} */ element = resolveElementFromTarget(target);
            var _a = parseTriggerCallbackName(eventName.substr(1)), name = _a[0], phase = _a[1];
            return this._engine.listen(element, namespaceify(this._namespaceId, name), phase, function (event) {
                var /** @type {?} */ e = (event);
                if (e.triggerName) {
                    e.triggerName = deNamespaceify(_this._namespaceId, e.triggerName);
                }
                _this._zone.run(function () { return callback(event); });
            });
        }
        return this.delegate.listen(target, eventName, callback);
    };
    /**
     * @return {?}
     */
    AnimationRenderer.prototype._queueFlush = function () {
        var _this = this;
        if (!this._flushPromise) {
            this._zone.runOutsideAngular(function () {
                _this._flushPromise = Promise.resolve(null).then(function () {
                    _this._flushPromise = ((null));
                    _this._engine.flush();
                });
            });
        }
    };
    return AnimationRenderer;
}());
/**
 * @param {?} target
 * @return {?}
 */
function resolveElementFromTarget(target) {
    switch (target) {
        case 'body':
            return document.body;
        case 'document':
            return document;
        case 'window':
            return window;
        default:
            return target;
    }
}
/**
 * @param {?} triggerName
 * @return {?}
 */
function parseTriggerCallbackName(triggerName) {
    var /** @type {?} */ dotIndex = triggerName.indexOf('.');
    var /** @type {?} */ trigger = triggerName.substring(0, dotIndex);
    var /** @type {?} */ phase = triggerName.substr(dotIndex + 1);
    return [trigger, phase];
}
/**
 * @param {?} namespaceId
 * @param {?} value
 * @return {?}
 */
function namespaceify(namespaceId, value) {
    return namespaceId + "#" + value;
}
/**
 * @param {?} namespaceId
 * @param {?} value
 * @return {?}
 */
function deNamespaceify(namespaceId, value) {
    return value.replace(namespaceId + '#', '');
}
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var InjectableAnimationEngine = (function (_super) {
    __extends(InjectableAnimationEngine, _super);
    /**
     * @param {?} driver
     * @param {?} normalizer
     */
    function InjectableAnimationEngine(driver, normalizer) {
        return _super.call(this, driver, normalizer) || this;
    }
    return InjectableAnimationEngine;
}(__WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["b" /* ɵDomAnimationEngine */]));
InjectableAnimationEngine.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"] },
];
/**
 * @nocollapse
 */
InjectableAnimationEngine.ctorParameters = function () { return [
    { type: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["c" /* AnimationDriver */], },
    { type: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["d" /* ɵAnimationStyleNormalizer */], },
]; };
/**
 * @return {?}
 */
function instantiateSupportedAnimationDriver() {
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["e" /* ɵsupportsWebAnimations */])()) {
        return new __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["f" /* ɵWebAnimationsDriver */]();
    }
    return new __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["g" /* ɵNoopAnimationDriver */]();
}
/**
 * @return {?}
 */
function instantiateDefaultStyleNormalizer() {
    return new __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["h" /* ɵWebAnimationsStyleNormalizer */]();
}
/**
 * @param {?} renderer
 * @param {?} engine
 * @param {?} zone
 * @return {?}
 */
function instantiateRendererFactory(renderer, engine, zone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserModule.
 */
var BROWSER_ANIMATIONS_PROVIDERS = [
    { provide: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["c" /* AnimationDriver */], useFactory: instantiateSupportedAnimationDriver },
    { provide: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["d" /* ɵAnimationStyleNormalizer */], useFactory: instantiateDefaultStyleNormalizer },
    { provide: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["a" /* ɵAnimationEngine */], useClass: InjectableAnimationEngine }, {
        provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["RendererFactory2"],
        useFactory: instantiateRendererFactory,
        deps: [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["ɵDomRendererFactory2"], __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["a" /* ɵAnimationEngine */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]]
    }
];
/**
 * Separate providers from the actual module so that we can do a local modification in Google3 to
 * include them in the BrowserTestingModule.
 */
var BROWSER_NOOP_ANIMATIONS_PROVIDERS = [
    { provide: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["a" /* ɵAnimationEngine */], useClass: __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["i" /* ɵNoopAnimationEngine */] }, {
        provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["RendererFactory2"],
        useFactory: instantiateRendererFactory,
        deps: [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["ɵDomRendererFactory2"], __WEBPACK_IMPORTED_MODULE_2__angular_animations_browser__["a" /* ɵAnimationEngine */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]]
    }
];
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@experimental Animation support is experimental.
 */
var BrowserAnimationsModule = (function () {
    function BrowserAnimationsModule() {
    }
    return BrowserAnimationsModule;
}());
BrowserAnimationsModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["BrowserModule"]],
                providers: BROWSER_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
BrowserAnimationsModule.ctorParameters = function () { return []; };
/**
 * \@experimental Animation support is experimental.
 */
var NoopAnimationsModule = (function () {
    function NoopAnimationsModule() {
    }
    return NoopAnimationsModule;
}());
NoopAnimationsModule.decorators = [
    { type: __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"], args: [{
                imports: [__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["BrowserModule"]],
                providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
            },] },
];
/**
 * @nocollapse
 */
NoopAnimationsModule.ctorParameters = function () { return []; };
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation browser package.
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the animation package.
 */
/**
 * Generated bundle index. Do not edit.
 */

//# sourceMappingURL=animations.es5.js.map


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: __webpack_require__(31)
    })
], AppComponent);
exports.AppComponent = AppComponent;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var platform_browser_1 = __webpack_require__(6);
var forms_1 = __webpack_require__(5);
var app_component_1 = __webpack_require__(14);
var pagenotfound_component_1 = __webpack_require__(20);
var nav_component_1 = __webpack_require__(19);
var router_1 = __webpack_require__(50);
var animations_1 = __webpack_require__(11);
var required_validator_1 = __webpack_require__(21);
var validation_component_1 = __webpack_require__(22);
var kendo_component_1 = __webpack_require__(16);
var material_component_1 = __webpack_require__(17);
// Import the kendo ButtonsModule
var kendo_angular_buttons_1 = __webpack_require__(51);
var kendo_angular_label_1 = __webpack_require__(55);
var kendo_angular_dateinputs_1 = __webpack_require__(52);
var kendo_angular_dropdowns_1 = __webpack_require__(53);
var kendo_angular_inputs_1 = __webpack_require__(54);
// Import the material ButtonsModule
var material_1 = __webpack_require__(48);
var appRoutes = [
    { path: 'kendo', component: kendo_component_1.KendoComponent },
    { path: 'material', component: material_component_1.MaterialComponent }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule,
            forms_1.FormsModule, forms_1.ReactiveFormsModule,
            animations_1.BrowserAnimationsModule,
            kendo_angular_buttons_1.ButtonsModule, kendo_angular_label_1.LabelModule, kendo_angular_dateinputs_1.DateInputsModule, kendo_angular_dropdowns_1.DropDownsModule, kendo_angular_inputs_1.InputsModule,
            material_1.MaterialModule, material_1.MdNativeDateModule,
            router_1.RouterModule.forRoot(appRoutes)],
        declarations: [app_component_1.AppComponent,
            kendo_component_1.KendoComponent,
            material_component_1.MaterialComponent,
            pagenotfound_component_1.PageNotFoundComponent,
            nav_component_1.NavComponent,
            validation_component_1.ValidationComponent,
            required_validator_1.RequiredValidator],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var UserInfoDto_1 = __webpack_require__(18);
var KendoComponent = (function () {
    function KendoComponent() {
        this.title = 'Kendo Template Driven Form Demo!';
        this.genderItems = ["Male", "Female"];
        this.min = 18;
        this.max = 99;
        this.smallStep = 1;
        this.userIndo = new UserInfoDto_1.UserInfoDto();
        this.userList = new Array();
    }
    // Can use this way as well: save(value: any)
    KendoComponent.prototype.save = function (value) {
        this.userList.push(value);
    };
    return KendoComponent;
}());
KendoComponent = __decorate([
    core_1.Component({
        styles: [
            __webpack_require__(43)
        ],
        // prevent style encapsulation
        encapsulation: core_1.ViewEncapsulation.None,
        template: __webpack_require__(32)
    })
    // Demo Kendo + Template driven form
    ,
    __metadata("design:paramtypes", [])
], KendoComponent);
exports.KendoComponent = KendoComponent;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var forms_1 = __webpack_require__(5);
var MaterialComponent = (function () {
    function MaterialComponent(fb) {
        this.fb = fb;
        this.title = 'Kendo Model Driven/ Reactive Form Demo!';
        this.createForm();
        this.userList = new Array();
    }
    MaterialComponent.prototype.createForm = function () {
        this.userDetailForm = this.fb.group({
            Name: ['', forms_1.Validators.required],
            DoB: ['', forms_1.Validators.required],
            Gender: [''],
            Age: ['']
        });
    };
    MaterialComponent.prototype.save = function () {
        this.userList.push(this.userDetailForm.value);
    };
    return MaterialComponent;
}());
MaterialComponent = __decorate([
    core_1.Component({
        styles: [
            __webpack_require__(42)
        ],
        // prevent style encapsulation
        encapsulation: core_1.ViewEncapsulation.None,
        template: __webpack_require__(33)
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], MaterialComponent);
exports.MaterialComponent = MaterialComponent;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var UserInfoDto = (function () {
    function UserInfoDto() {
    }
    return UserInfoDto;
}());
exports.UserInfoDto = UserInfoDto;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var NavComponent = (function () {
    function NavComponent() {
    }
    return NavComponent;
}());
NavComponent = __decorate([
    core_1.Component({
        selector: 'nav-bar',
        template: __webpack_require__(34)
    }),
    __metadata("design:paramtypes", [])
], NavComponent);
exports.NavComponent = NavComponent;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var PageNotFoundComponent = (function () {
    function PageNotFoundComponent() {
    }
    return PageNotFoundComponent;
}());
PageNotFoundComponent = __decorate([
    core_1.Component({
        template: __webpack_require__(35)
    })
], PageNotFoundComponent);
exports.PageNotFoundComponent = PageNotFoundComponent;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var forms_1 = __webpack_require__(5);
var RequiredValidator = RequiredValidator_1 = (function () {
    function RequiredValidator() {
    }
    RequiredValidator.prototype.validate = function (c) {
        var value = c.value;
        try {
            if (String(value).length > 0 && value != null) {
                return null;
            }
        }
        catch (err) {
        }
        return { required: true };
    };
    return RequiredValidator;
}());
__decorate([
    core_1.Input('control'),
    __metadata("design:type", String)
], RequiredValidator.prototype, "control", void 0);
RequiredValidator = RequiredValidator_1 = __decorate([
    core_1.Directive({
        selector: '[validateRequired][ngModel],[validateRequired][formControl]',
        //extend the built-in validators NG_VALIDATORS to use our Required validator in providers.
        providers: [
            { provide: forms_1.NG_VALIDATORS, useExisting: core_1.forwardRef(function () { return RequiredValidator_1; }), multi: true }
        ]
    })
], RequiredValidator);
exports.RequiredValidator = RequiredValidator;
var RequiredValidator_1;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var ValidationComponent = (function () {
    function ValidationComponent() {
    }
    Object.defineProperty(ValidationComponent.prototype, "control", {
        set: function (control) {
            this.controlInput = control;
        },
        enumerable: true,
        configurable: true
    });
    return ValidationComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], ValidationComponent.prototype, "control", null);
ValidationComponent = __decorate([
    core_1.Component({
        selector: 'common-validation-message',
        template: __webpack_require__(36)
    })
], ValidationComponent);
exports.ValidationComponent = ValidationComponent;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.7'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector === '#' ? [] : selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.7'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.7'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.7'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.7'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.7'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.7'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.7'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.7'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.7'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".mat-elevation-z0{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}.mat-elevation-z1{box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}.mat-elevation-z2{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.mat-elevation-z3{box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12)}.mat-elevation-z4{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.mat-elevation-z5{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)}.mat-elevation-z6{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.mat-elevation-z7{box-shadow:0 4px 5px -2px rgba(0,0,0,.2),0 7px 10px 1px rgba(0,0,0,.14),0 2px 16px 1px rgba(0,0,0,.12)}.mat-elevation-z8{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mat-elevation-z9{box-shadow:0 5px 6px -3px rgba(0,0,0,.2),0 9px 12px 1px rgba(0,0,0,.14),0 3px 16px 2px rgba(0,0,0,.12)}.mat-elevation-z10{box-shadow:0 6px 6px -3px rgba(0,0,0,.2),0 10px 14px 1px rgba(0,0,0,.14),0 4px 18px 3px rgba(0,0,0,.12)}.mat-elevation-z11{box-shadow:0 6px 7px -4px rgba(0,0,0,.2),0 11px 15px 1px rgba(0,0,0,.14),0 4px 20px 3px rgba(0,0,0,.12)}.mat-elevation-z12{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mat-elevation-z13{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12)}.mat-elevation-z14{box-shadow:0 7px 9px -4px rgba(0,0,0,.2),0 14px 21px 2px rgba(0,0,0,.14),0 5px 26px 4px rgba(0,0,0,.12)}.mat-elevation-z15{box-shadow:0 8px 9px -5px rgba(0,0,0,.2),0 15px 22px 2px rgba(0,0,0,.14),0 6px 28px 5px rgba(0,0,0,.12)}.mat-elevation-z16{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}.mat-elevation-z17{box-shadow:0 8px 11px -5px rgba(0,0,0,.2),0 17px 26px 2px rgba(0,0,0,.14),0 6px 32px 5px rgba(0,0,0,.12)}.mat-elevation-z18{box-shadow:0 9px 11px -5px rgba(0,0,0,.2),0 18px 28px 2px rgba(0,0,0,.14),0 7px 34px 6px rgba(0,0,0,.12)}.mat-elevation-z19{box-shadow:0 9px 12px -6px rgba(0,0,0,.2),0 19px 29px 2px rgba(0,0,0,.14),0 7px 36px 6px rgba(0,0,0,.12)}.mat-elevation-z20{box-shadow:0 10px 13px -6px rgba(0,0,0,.2),0 20px 31px 3px rgba(0,0,0,.14),0 8px 38px 7px rgba(0,0,0,.12)}.mat-elevation-z21{box-shadow:0 10px 13px -6px rgba(0,0,0,.2),0 21px 33px 3px rgba(0,0,0,.14),0 8px 40px 7px rgba(0,0,0,.12)}.mat-elevation-z22{box-shadow:0 10px 14px -6px rgba(0,0,0,.2),0 22px 35px 3px rgba(0,0,0,.14),0 8px 42px 7px rgba(0,0,0,.12)}.mat-elevation-z23{box-shadow:0 11px 14px -7px rgba(0,0,0,.2),0 23px 36px 3px rgba(0,0,0,.14),0 9px 44px 8px rgba(0,0,0,.12)}.mat-elevation-z24{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)}.mat-ripple{overflow:hidden}.mat-ripple.mat-ripple-unbounded{overflow:visible}.mat-ripple-element{position:absolute;border-radius:50%;pointer-events:none;transition:opacity,transform 0s cubic-bezier(0,0,.2,1);transform:scale(0)}.mat-option{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;line-height:48px;height:48px;padding:0 16px;font-size:16px;font-family:Roboto,\"Helvetica Neue\",sans-serif;text-align:left;text-decoration:none;position:relative;cursor:pointer;outline:0}.mat-option[disabled]{cursor:default}[dir=rtl] .mat-option{text-align:right}.mat-option .mat-icon{margin-right:16px}[dir=rtl] .mat-option .mat-icon{margin-left:16px;margin-right:0}.mat-option[aria-disabled=true]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default}.mat-option-ripple{position:absolute;top:0;left:0;bottom:0;right:0;pointer-events:none}@media screen and (-ms-high-contrast:active){.mat-option-ripple{opacity:.5}}.mat-option-pseudo-checkbox{margin-right:8px}[dir=rtl] .mat-option-pseudo-checkbox{margin-left:8px;margin-right:0}.cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;text-transform:none;width:1px}.cdk-global-overlay-wrapper,.cdk-overlay-container{pointer-events:none;top:0;left:0;height:100%;width:100%}.cdk-overlay-container{position:fixed;z-index:1000}.cdk-global-overlay-wrapper{display:flex;position:absolute;z-index:1000}.cdk-overlay-pane{position:absolute;pointer-events:auto;box-sizing:border-box;z-index:1000}.cdk-overlay-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;z-index:1000;pointer-events:auto;transition:opacity .4s cubic-bezier(.25,.8,.25,1);opacity:0}.cdk-overlay-backdrop.cdk-overlay-backdrop-showing{opacity:.48}.cdk-overlay-dark-backdrop{background:rgba(0,0,0,.6)}.cdk-overlay-transparent-backdrop{background:0 0}.cdk-global-scrollblock{position:fixed;width:100%;overflow-y:scroll}.mat-ripple-element{background-color:rgba(0,0,0,.1)}.mat-option{color:rgba(0,0,0,.87)}.mat-option:focus:not(.mat-option-disabled),.mat-option:hover:not(.mat-option-disabled){background:rgba(0,0,0,.04)}.mat-option.mat-selected.mat-primary,.mat-primary .mat-option.mat-selected{color:#3f51b5}.mat-accent .mat-option.mat-selected,.mat-option.mat-selected.mat-accent{color:#ff4081}.mat-option.mat-selected.mat-warn,.mat-warn .mat-option.mat-selected{color:#f44336}.mat-option.mat-selected:not(.mat-option-multiple){background:rgba(0,0,0,.04)}.mat-option.mat-active{background:rgba(0,0,0,.04);color:rgba(0,0,0,.87)}.mat-option.mat-option-disabled{color:rgba(0,0,0,.38)}.mat-pseudo-checkbox{color:rgba(0,0,0,.54)}.mat-pseudo-checkbox::after{color:#fafafa}.mat-primary .mat-pseudo-checkbox-checked,.mat-primary .mat-pseudo-checkbox-indeterminate,.mat-pseudo-checkbox-checked.mat-primary,.mat-pseudo-checkbox-indeterminate.mat-primary{background:#3f51b5}.mat-accent .mat-pseudo-checkbox-checked,.mat-accent .mat-pseudo-checkbox-indeterminate,.mat-pseudo-checkbox-checked.mat-accent,.mat-pseudo-checkbox-indeterminate.mat-accent{background:#ff4081}.mat-pseudo-checkbox-checked.mat-warn,.mat-pseudo-checkbox-indeterminate.mat-warn,.mat-warn .mat-pseudo-checkbox-checked,.mat-warn .mat-pseudo-checkbox-indeterminate{background:#f44336}.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled,.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled{background:#b0b0b0}.mat-app-background{background-color:#fafafa}.mat-theme-loaded-marker{display:none}.mat-autocomplete-panel{background:#fff;color:rgba(0,0,0,.87)}.mat-autocomplete-panel .mat-option.mat-selected:not(.mat-active){background:#fff;color:rgba(0,0,0,.87)}.mat-button,.mat-icon-button{background:0 0}.mat-button.mat-primary .mat-button-focus-overlay,.mat-icon-button.mat-primary .mat-button-focus-overlay{background-color:rgba(63,81,181,.12)}.mat-button.mat-accent .mat-button-focus-overlay,.mat-icon-button.mat-accent .mat-button-focus-overlay{background-color:rgba(255,64,129,.12)}.mat-button.mat-warn .mat-button-focus-overlay,.mat-icon-button.mat-warn .mat-button-focus-overlay{background-color:rgba(244,67,54,.12)}.mat-button[disabled] .mat-button-focus-overlay,.mat-icon-button[disabled] .mat-button-focus-overlay{background-color:transparent}.mat-button.mat-primary,.mat-icon-button.mat-primary{color:#3f51b5}.mat-button.mat-accent,.mat-icon-button.mat-accent{color:#ff4081}.mat-button.mat-warn,.mat-icon-button.mat-warn{color:#f44336}.mat-button.mat-accent[disabled],.mat-button.mat-primary[disabled],.mat-button.mat-warn[disabled],.mat-button[disabled][disabled],.mat-icon-button.mat-accent[disabled],.mat-icon-button.mat-primary[disabled],.mat-icon-button.mat-warn[disabled],.mat-icon-button[disabled][disabled]{color:rgba(0,0,0,.38)}.mat-fab,.mat-mini-fab,.mat-raised-button{color:rgba(0,0,0,.87);background-color:#fff}.mat-fab.mat-primary,.mat-mini-fab.mat-primary,.mat-raised-button.mat-primary{color:rgba(255,255,255,.87)}.mat-fab.mat-accent,.mat-mini-fab.mat-accent,.mat-raised-button.mat-accent{color:#fff}.mat-fab.mat-warn,.mat-mini-fab.mat-warn,.mat-raised-button.mat-warn{color:#fff}.mat-fab.mat-accent[disabled],.mat-fab.mat-primary[disabled],.mat-fab.mat-warn[disabled],.mat-fab[disabled][disabled],.mat-mini-fab.mat-accent[disabled],.mat-mini-fab.mat-primary[disabled],.mat-mini-fab.mat-warn[disabled],.mat-mini-fab[disabled][disabled],.mat-raised-button.mat-accent[disabled],.mat-raised-button.mat-primary[disabled],.mat-raised-button.mat-warn[disabled],.mat-raised-button[disabled][disabled]{color:rgba(0,0,0,.38)}.mat-fab.mat-primary,.mat-mini-fab.mat-primary,.mat-raised-button.mat-primary{background-color:#3f51b5}.mat-fab.mat-accent,.mat-mini-fab.mat-accent,.mat-raised-button.mat-accent{background-color:#ff4081}.mat-fab.mat-warn,.mat-mini-fab.mat-warn,.mat-raised-button.mat-warn{background-color:#f44336}.mat-fab.mat-accent[disabled],.mat-fab.mat-primary[disabled],.mat-fab.mat-warn[disabled],.mat-fab[disabled][disabled],.mat-mini-fab.mat-accent[disabled],.mat-mini-fab.mat-primary[disabled],.mat-mini-fab.mat-warn[disabled],.mat-mini-fab[disabled][disabled],.mat-raised-button.mat-accent[disabled],.mat-raised-button.mat-primary[disabled],.mat-raised-button.mat-warn[disabled],.mat-raised-button[disabled][disabled]{background-color:rgba(0,0,0,.12)}.mat-fab.mat-primary .mat-ripple-element,.mat-mini-fab.mat-primary .mat-ripple-element,.mat-raised-button.mat-primary .mat-ripple-element{background-color:rgba(255,255,255,.2)}.mat-fab.mat-accent .mat-ripple-element,.mat-mini-fab.mat-accent .mat-ripple-element,.mat-raised-button.mat-accent .mat-ripple-element{background-color:rgba(255,255,255,.2)}.mat-fab.mat-warn .mat-ripple-element,.mat-mini-fab.mat-warn .mat-ripple-element,.mat-raised-button.mat-warn .mat-ripple-element{background-color:rgba(255,255,255,.2)}.mat-button.mat-primary .mat-ripple-element{background-color:rgba(63,81,181,.1)}.mat-button.mat-accent .mat-ripple-element{background-color:rgba(255,64,129,.1)}.mat-button.mat-warn .mat-ripple-element{background-color:rgba(244,67,54,.1)}.mat-icon-button.mat-primary .mat-ripple-element{background-color:rgba(63,81,181,.2)}.mat-icon-button.mat-accent .mat-ripple-element{background-color:rgba(255,64,129,.2)}.mat-icon-button.mat-warn .mat-ripple-element{background-color:rgba(244,67,54,.2)}.mat-fab,.mat-mini-fab{background-color:#ff4081;color:#fff}.mat-fab .mat-ripple-element,.mat-mini-fab .mat-ripple-element{background-color:rgba(255,255,255,.2)}.mat-button-toggle{color:rgba(0,0,0,.38)}.mat-button-toggle.cdk-focused .mat-button-toggle-focus-overlay{background-color:rgba(0,0,0,.06)}.mat-button-toggle-checked{background-color:#e0e0e0;color:#000}.mat-button-toggle-disabled{background-color:#eee;color:rgba(0,0,0,.38)}.mat-button-toggle-disabled.mat-button-toggle-checked{background-color:#bdbdbd}.mat-card{background:#fff;color:rgba(0,0,0,.87)}.mat-card-subtitle{color:rgba(0,0,0,.54)}.mat-checkbox-frame{border-color:rgba(0,0,0,.54)}.mat-checkbox-checkmark{fill:#fafafa}.mat-checkbox-checkmark-path{stroke:#fafafa!important}.mat-checkbox-mixedmark{background-color:#fafafa}.mat-checkbox-checked.mat-primary .mat-checkbox-background,.mat-checkbox-indeterminate.mat-primary .mat-checkbox-background{background-color:#3f51b5}.mat-checkbox-checked.mat-accent .mat-checkbox-background,.mat-checkbox-indeterminate.mat-accent .mat-checkbox-background{background-color:#ff4081}.mat-checkbox-checked.mat-warn .mat-checkbox-background,.mat-checkbox-indeterminate.mat-warn .mat-checkbox-background{background-color:#f44336}.mat-checkbox-disabled.mat-checkbox-checked .mat-checkbox-background,.mat-checkbox-disabled.mat-checkbox-indeterminate .mat-checkbox-background{background-color:#b0b0b0}.mat-checkbox-disabled:not(.mat-checkbox-checked) .mat-checkbox-frame{border-color:#b0b0b0}.mat-checkbox-disabled .mat-checkbox-label{color:#b0b0b0}.mat-checkbox:not(.mat-checkbox-disabled).mat-primary .mat-checkbox-ripple .mat-ripple-element{background-color:rgba(63,81,181,.26)}.mat-checkbox:not(.mat-checkbox-disabled).mat-accent .mat-checkbox-ripple .mat-ripple-element{background-color:rgba(255,64,129,.26)}.mat-checkbox:not(.mat-checkbox-disabled).mat-warn .mat-checkbox-ripple .mat-ripple-element{background-color:rgba(244,67,54,.26)}.mat-chip:not(.mat-basic-chip){background-color:#e0e0e0;color:rgba(0,0,0,.87)}.mat-chip.mat-chip-selected:not(.mat-basic-chip){background-color:grey;color:rgba(255,255,255,.87)}.mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-primary{background-color:#3f51b5;color:rgba(255,255,255,.87)}.mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-accent{background-color:#ff4081;color:#fff}.mat-chip.mat-chip-selected:not(.mat-basic-chip).mat-warn{background-color:#f44336;color:#fff}.mat-datepicker-content{background-color:#fff}.mat-calendar-arrow{border-top-color:rgba(0,0,0,.54)}.mat-calendar-next-button,.mat-calendar-previous-button{color:rgba(0,0,0,.54)}.mat-calendar-table-header{color:rgba(0,0,0,.38)}.mat-calendar-table-header-divider::after{background:rgba(0,0,0,.12)}.mat-calendar-body-label{color:rgba(0,0,0,.54)}.mat-calendar-body-cell-content{color:rgba(0,0,0,.87);border-color:transparent}.mat-calendar-body-disabled>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected){color:rgba(0,0,0,.38)}.cdk-keyboard-focused .mat-calendar-body-active>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected),:not(.mat-calendar-body-disabled):hover>.mat-calendar-body-cell-content:not(.mat-calendar-body-selected){background-color:rgba(0,0,0,.04)}.mat-calendar-body-selected{background-color:#3f51b5;color:rgba(255,255,255,.87)}.mat-calendar-body-disabled>.mat-calendar-body-selected{background-color:rgba(63,81,181,.4)}.mat-calendar-body-today:not(.mat-calendar-body-selected){border-color:rgba(0,0,0,.38)}.mat-calendar-body-today.mat-calendar-body-selected{box-shadow:inset 0 0 0 1px rgba(255,255,255,.87)}.mat-calendar-body-disabled>.mat-calendar-body-today:not(.mat-calendar-body-selected){border-color:rgba(0,0,0,.18)}.mat-dialog-container{background:#fff}.mat-icon.mat-primary{color:#3f51b5}.mat-icon.mat-accent{color:#ff4081}.mat-icon.mat-warn{color:#f44336}.mat-input-placeholder{color:rgba(0,0,0,.38)}.mat-focused .mat-input-placeholder{color:#3f51b5}.mat-focused .mat-input-placeholder.mat-accent{color:#ff4081}.mat-focused .mat-input-placeholder.mat-warn{color:#f44336}.mat-input-element:disabled{color:rgba(0,0,0,.38)}.mat-focused .mat-input-placeholder.mat-float .mat-placeholder-required,input.mat-input-element:-webkit-autofill+.mat-input-placeholder .mat-placeholder-required{color:#ff4081}.mat-input-underline{border-color:rgba(0,0,0,.12)}.mat-input-underline .mat-input-ripple{background-color:#3f51b5}.mat-input-underline .mat-input-ripple.mat-accent{background-color:#ff4081}.mat-input-underline .mat-input-ripple.mat-warn{background-color:#f44336}.mat-input-invalid .mat-input-placeholder,.mat-input-invalid .mat-placeholder-required{color:#f44336}.mat-input-invalid .mat-input-ripple{background-color:#f44336}.mat-input-error{color:#f44336}.mat-list .mat-list-item,.mat-nav-list .mat-list-item{color:rgba(0,0,0,.87)}.mat-list .mat-subheader,.mat-nav-list .mat-subheader{color:rgba(0,0,0,.54)}.mat-divider{border-top-color:rgba(0,0,0,.12)}.mat-nav-list .mat-list-item{outline:0}.mat-nav-list .mat-list-item.mat-list-item-focus,.mat-nav-list .mat-list-item:hover{background:rgba(0,0,0,.04)}.mat-menu-content{background:#fff}.mat-menu-item{background:0 0;color:rgba(0,0,0,.87)}.mat-menu-item[disabled]{color:rgba(0,0,0,.38)}.mat-menu-item .mat-icon{color:rgba(0,0,0,.54);vertical-align:middle}.mat-menu-item:focus:not([disabled]),.mat-menu-item:hover:not([disabled]){background:rgba(0,0,0,.04)}.mat-progress-bar-background{background-image:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23c5cae9%27%2F%3E%3C%2Fsvg%3E\")}.mat-progress-bar-buffer{background-color:#c5cae9}.mat-progress-bar-fill::after{background-color:#3f51b5}.mat-progress-bar.mat-accent .mat-progress-bar-background{background-image:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23ff80ab%27%2F%3E%3C%2Fsvg%3E\")}.mat-progress-bar.mat-accent .mat-progress-bar-buffer{background-color:#ff80ab}.mat-progress-bar.mat-accent .mat-progress-bar-fill::after{background-color:#ff4081}.mat-progress-bar.mat-warn .mat-progress-bar-background{background-image:url(\"data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%271.1%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20xmlns%3Axlink%3D%27http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%27%20x%3D%270px%27%20y%3D%270px%27%20enable-background%3D%27new%200%200%205%202%27%20xml%3Aspace%3D%27preserve%27%20viewBox%3D%270%200%205%202%27%20preserveAspectRatio%3D%27none%20slice%27%3E%3Ccircle%20cx%3D%271%27%20cy%3D%271%27%20r%3D%271%27%20fill%3D%27%23ffcdd2%27%2F%3E%3C%2Fsvg%3E\")}.mat-progress-bar.mat-warn .mat-progress-bar-buffer{background-color:#ffcdd2}.mat-progress-bar.mat-warn .mat-progress-bar-fill::after{background-color:#f44336}.mat-progress-spinner path,.mat-spinner path{stroke:#3f51b5}.mat-progress-spinner.mat-accent path,.mat-spinner.mat-accent path{stroke:#ff4081}.mat-progress-spinner.mat-warn path,.mat-spinner.mat-warn path{stroke:#f44336}.mat-radio-outer-circle{border-color:rgba(0,0,0,.54)}.mat-radio-checked .mat-radio-outer-circle{border-color:#ff4081}.mat-radio-disabled .mat-radio-outer-circle{border-color:rgba(0,0,0,.38)}.mat-radio-inner-circle{background-color:#ff4081}.mat-radio-ripple .mat-ripple-element{background-color:rgba(255,64,129,.26)}.mat-radio-disabled .mat-radio-inner-circle,.mat-radio-disabled .mat-radio-ripple .mat-ripple-element{background-color:rgba(0,0,0,.38)}.mat-radio-disabled .mat-radio-label-content{color:rgba(0,0,0,.38)}.mat-select-arrow,.mat-select-trigger{color:rgba(0,0,0,.38)}.mat-select-underline{background-color:rgba(0,0,0,.12)}.mat-select-arrow,.mat-select-disabled .mat-select-value,.mat-select-trigger{color:rgba(0,0,0,.38)}.mat-select-content,.mat-select-panel-done-animating{background:#fff}.mat-select-value{color:rgba(0,0,0,.87)}.mat-select:focus:not(.mat-select-disabled).mat-primary .mat-select-arrow,.mat-select:focus:not(.mat-select-disabled).mat-primary .mat-select-trigger{color:#3f51b5}.mat-select:focus:not(.mat-select-disabled).mat-primary .mat-select-underline{background-color:#3f51b5}.mat-select:focus:not(.mat-select-disabled).mat-accent .mat-select-arrow,.mat-select:focus:not(.mat-select-disabled).mat-accent .mat-select-trigger{color:#ff4081}.mat-select:focus:not(.mat-select-disabled).mat-accent .mat-select-underline{background-color:#ff4081}.mat-select:focus:not(.mat-select-disabled).mat-warn .mat-select-arrow,.mat-select:focus:not(.mat-select-disabled).mat-warn .mat-select-trigger,.mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .mat-select-arrow,.mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .mat-select-trigger{color:#f44336}.mat-select:focus:not(.mat-select-disabled).mat-warn .mat-select-underline,.mat-select:not(:focus).ng-invalid.ng-touched:not(.mat-select-disabled) .mat-select-underline{background-color:#f44336}.mat-sidenav-container{background-color:#fafafa;color:rgba(0,0,0,.87)}.mat-sidenav{background-color:#fff;color:rgba(0,0,0,.87)}.mat-sidenav.mat-sidenav-push{background-color:#fff}.mat-sidenav-backdrop.mat-sidenav-shown{background-color:rgba(0,0,0,.6)}.mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb{background-color:#e91e63}.mat-slide-toggle.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar{background-color:rgba(233,30,99,.5)}.mat-slide-toggle:not(.mat-checked) .mat-ripple-element{background-color:rgba(0,0,0,.06)}.mat-slide-toggle .mat-ripple-element{background-color:rgba(233,30,99,.12)}.mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb{background-color:#3f51b5}.mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar{background-color:rgba(63,81,181,.5)}.mat-slide-toggle.mat-primary:not(.mat-checked) .mat-ripple-element{background-color:rgba(0,0,0,.06)}.mat-slide-toggle.mat-primary .mat-ripple-element{background-color:rgba(63,81,181,.12)}.mat-slide-toggle.mat-warn.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb{background-color:#f44336}.mat-slide-toggle.mat-warn.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar{background-color:rgba(244,67,54,.5)}.mat-slide-toggle.mat-warn:not(.mat-checked) .mat-ripple-element{background-color:rgba(0,0,0,.06)}.mat-slide-toggle.mat-warn .mat-ripple-element{background-color:rgba(244,67,54,.12)}.mat-disabled .mat-slide-toggle-thumb{background-color:#bdbdbd}.mat-disabled .mat-slide-toggle-bar{background-color:rgba(0,0,0,.1)}.mat-slide-toggle-thumb{background-color:#fafafa}.mat-slide-toggle-bar{background-color:rgba(0,0,0,.38)}.mat-slider-track-background{background-color:rgba(0,0,0,.26)}.mat-primary .mat-slider-thumb,.mat-primary .mat-slider-thumb-label,.mat-primary .mat-slider-track-fill{background-color:#3f51b5}.mat-primary .mat-slider-thumb-label-text{color:rgba(255,255,255,.87)}.mat-accent .mat-slider-thumb,.mat-accent .mat-slider-thumb-label,.mat-accent .mat-slider-track-fill{background-color:#ff4081}.mat-accent .mat-slider-thumb-label-text{color:#fff}.mat-warn .mat-slider-thumb,.mat-warn .mat-slider-thumb-label,.mat-warn .mat-slider-track-fill{background-color:#f44336}.mat-warn .mat-slider-thumb-label-text{color:#fff}.mat-slider-focus-ring{background-color:rgba(255,64,129,.2)}.cdk-focused .mat-slider-track-background,.mat-slider:hover .mat-slider-track-background{background-color:rgba(0,0,0,.38)}.mat-slider-disabled .mat-slider-thumb,.mat-slider-disabled .mat-slider-track-background,.mat-slider-disabled .mat-slider-track-fill{background-color:rgba(0,0,0,.26)}.mat-slider-disabled:hover .mat-slider-track-background{background-color:rgba(0,0,0,.26)}.mat-slider-min-value .mat-slider-focus-ring{background-color:rgba(0,0,0,.12)}.mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb,.mat-slider-min-value.mat-slider-thumb-label-showing .mat-slider-thumb-label{background-color:#000}.mat-slider-min-value.mat-slider-thumb-label-showing.cdk-focused .mat-slider-thumb,.mat-slider-min-value.mat-slider-thumb-label-showing.cdk-focused .mat-slider-thumb-label{background-color:rgba(0,0,0,.26)}.mat-slider-min-value:not(.mat-slider-thumb-label-showing) .mat-slider-thumb{border-color:rgba(0,0,0,.26);background-color:transparent}.mat-slider-min-value:not(.mat-slider-thumb-label-showing).cdk-focused .mat-slider-thumb,.mat-slider-min-value:not(.mat-slider-thumb-label-showing):hover .mat-slider-thumb{border-color:rgba(0,0,0,.38)}.mat-slider-min-value:not(.mat-slider-thumb-label-showing).cdk-focused.mat-slider-disabled .mat-slider-thumb,.mat-slider-min-value:not(.mat-slider-thumb-label-showing):hover.mat-slider-disabled .mat-slider-thumb{border-color:rgba(0,0,0,.26)}.mat-slider-has-ticks .mat-slider-wrapper::after{border-color:rgba(0,0,0,.7)}.mat-slider-horizontal .mat-slider-ticks{background-image:repeating-linear-gradient(to right,rgba(0,0,0,.7),rgba(0,0,0,.7) 2px,transparent 0,transparent);background-image:-moz-repeating-linear-gradient(.0001deg,rgba(0,0,0,.7),rgba(0,0,0,.7) 2px,transparent 0,transparent)}.mat-slider-vertical .mat-slider-ticks{background-image:repeating-linear-gradient(to bottom,rgba(0,0,0,.7),rgba(0,0,0,.7) 2px,transparent 0,transparent)}.mat-tab-header,.mat-tab-nav-bar{border-bottom:1px solid rgba(0,0,0,.12)}.mat-tab-group-inverted-header .mat-tab-header,.mat-tab-group-inverted-header .mat-tab-nav-bar{border-top:1px solid rgba(0,0,0,.12);border-bottom:none}.mat-tab-label:focus{background-color:rgba(197,202,233,.3)}.mat-ink-bar{background-color:#3f51b5}.mat-tab-label,.mat-tab-link{color:rgba(0,0,0,.87)}.mat-tab-label.mat-tab-disabled,.mat-tab-link.mat-tab-disabled{color:rgba(0,0,0,.38)}.mat-toolbar{background:#f5f5f5;color:rgba(0,0,0,.87)}.mat-toolbar.mat-primary{background:#3f51b5;color:rgba(255,255,255,.87)}.mat-toolbar.mat-accent{background:#ff4081;color:#fff}.mat-toolbar.mat-warn{background:#f44336;color:#fff}.mat-tooltip{background:rgba(97,97,97,.9)}\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, ".k-content,.k-input,.k-textbox,.k-widget{background-color:#fff;border-color:#e2e2e2;color:#656565;border-radius:2px}.k-header{background-color:#f6f6f6;border-color:#e2e2e2}.k-icon,.k-icon:focus,.k-icon:hover,.k-link{color:#656565;text-decoration:none}.k-centered{top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.k-state-default{border-color:#e2e2e2}.k-state-selected{background-color:#ff6358;border-color:#ff685d;color:#fff}.k-state-active{background-color:#fff}.k-state-focused,.k-textbox:focus{box-shadow:0 0 0 2px #f0f0f0}.k-state-hover,.k-state-hover:hover{background-color:#ededed;border-color:#c3c3c3;color:#656565}.k-state-disabled,.k-state-disabled .k-button,.k-state-disabled .k-link{border-color:#d2d2d2;color:#d2d2d2;cursor:default;outline:0}.k-state-disabled{opacity:.7}.k-state-error{border-style:ridge}.k-state-empty{font-style:italic}.k-state-highlight{background-color:#f6f6f6;border-color:#ff6358}.k-button-bare{background:none!important;border-width:0;box-shadow:none}.k-button-bare:focus{box-shadow:none!important;border-color:transparent}.k-var--accent{background-color:#ff6358}.k-var--base{background-color:#f6f6f6}.k-var--background{background-color:#fff}.k-var--border-radius{margin-top:2px}.k-var--normal-background{background-color:#fff}.k-var--normal-text-color{background-color:#656565}.k-var--hover-background{background-color:#ededed}.k-var--hover-text-color{background-color:#656565}.k-var--selected-background{background-color:#ff6358}.k-var--selected-text-color{background-color:#fff}.k-var--error{background-color:#f31700}.k-var--warning{background-color:#ffc000}.k-var--success{background-color:#37b400}.k-var--info{background-color:#0058e9}.k-var--series-a{background-color:#ff6358}.k-var--series-b{background-color:#ffd246}.k-var--series-c{background-color:#78d237}.k-var--series-d{background-color:#28b4c8}.k-var--series-e{background-color:#2d73f5}.k-var--series-f{background-color:#aa46be}html{font-family:sans-serif}.k-reset{border:0;font-size:100%;list-style:none;margin:0;outline:0;padding:0;text-decoration:none}.k-widget{font-size:14px;font-family:inherit}.k-button,.k-input,.k-textbox,.k-textbox>input{font-size:100%;font-family:inherit;border-style:solid;border-width:1px;-webkit-appearance:none}.k-content,.k-grid,.k-panelbar,.k-slider,.k-textbox,.k-widget{outline:0}.k-floatwrap:after{clear:both;content:'';display:block;height:0;overflow:hidden;visibility:hidden}.k-link{cursor:pointer;outline:0}.k-link,.k-link:hover{text-decoration:none}.k-loading{width:64px;height:64px;display:block}.k-loading .animate{-webkit-animation:loading 2s infinite linear;animation:loading 2s infinite linear}@-webkit-keyframes loading{0%{stroke-dasharray:0 251;stroke-dashoffset:502}50%{stroke-dasharray:250 1}to{stroke-dasharray:0 251;stroke-dashoffset:0}}@keyframes loading{0%{stroke-dasharray:0 251;stroke-dashoffset:502}50%{stroke-dasharray:250 1}to{stroke-dasharray:0 251;stroke-dashoffset:0}}.k-block,.k-textbox,.k-widget{box-sizing:border-box}@font-face{font-family:KendoUIGlyphs;font-style:normal;font-weight:400;src:url(\"data:application/font-woff;base64,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ESMRIRUhETMRITWAQEBAQEBAQEBAQAMAQEBAQEBAQED9gEBAgEBA/wBAQIBAQIBAQAEAQECAQECAQED/AEBAgEBAgEBA/oBA/oABgEABgANAQEBAQECAQED/AEBAgEBAAgBAQIBAQP8AQECAQEACgEBAQED9AEBAQEBAQEBAQEBAQAMAQEBAQEBA/oABgP6AQP6AAYBAAAAAGwBAAEADgAOAAAQACQAOABMAGAAdACIAJwAsADEANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAAABFSE1IQEjFTM1FSM1MxUVIzUzFREjNTMVFSM1MxUBIzUzFRUjNTMVESM1MxUVIzUzFQEjNTMVMyM1MxUzIzUzFRUjNTMVFSM1MxURIzUzFRUjNTMVFSM1MxUlIxUzNRcjNTMVMyM1MxUlIxUzNRcjNTMVMyM1MxUBIxUzNRcjNTMVMyM1MxUDgPzAA0D9AEBAQEBAQEBAQEADAEBAQEBAQEBA/YBAQIBAQIBAQEBAQEBAQEBAQED+gEBAgEBAgEBAAQBAQIBAQIBAQP8AQECAQECAQEACAEBAAYBAQMBAQIBAQP8AQECAQEACAEBAgEBA/wBAQIBAQAKAQEBAQEBAgEBAgEBA/wBAQIBAQIBAQEBAQEBAQEBAQEBAQEBAQEADQEBAQEBAQEAAABsAQABAA4ADgAAEAAkADgATABgAHQAiACcALAAxADYAOwBAAEUASgBPAFQAWQBeAGMAaABtAHIAdwB8AIEAhgAAJSMRMxEBNSMVMyM1MxUjIzUzFSMhNTMVIyM1MxUjATUzFSMjNTMVIyE1MxUjIzUzFSMBNTMVIxU1MxUjFTUzFSMjNTMVIyM1MxUjITUzFSMjNTMVIyM1MxUjEzUjFTMHNTMVIxU1MxUjEzUjFTMHNTMVIxU1MxUjATUjFTMHNTMVIxU1MxUjAgBAQAGAQEDAQECAQED/AEBAgEBAAgBAQIBAQP8AQECAQEACgEBAQEBAQIBAQIBAQP8AQECAQECAQEBAQEBAQEBAQEBAQEBAQEBAA0BAQEBAQEBAQANA/MADAEBAQEBAQEBAQED9AEBAQEBAQEBAAoBAQIBAQIBAQEBAQEBAQEBAQEABgEBAgEBAgEBA/wBAQIBAQIBAQAEAQECAQECAQEAAAAALAEAAQAOAA4AABAAJAA4AEwAYAB0AIgAnACwAMQA2AAABIzUzFTcjFTM1MyMVMzU1IxUzNTUjFTM1ESMVMzU1IxUzNTcjFTM1MyMVMzUTESERIQchESERAQBAQIBAQIBAQEBAQEBAQEBAgEBAgEBAgPzAA0BA/UACwAHAQEBAQEBAQIBAQIBAQP4AQECAQECAQEBAQAGA/MADQED9QALAAAAAABsAQABAA4ADgAAEAAkADgATABgAHQAiACcALAAxADYAOwBAAEUASgBPAFQAWQBeAGMAaABtAHIAdwB8AIEAhgAAARUhNSEFIxUzNRUjNTMVFSM1MxUVIzUzFRUjNTMVASM1MxUVIzUzFRUjNTMVFSM1MxUBIzUzFTMjNTMVEyM1MxUVIzUzFRUjNTMVFSM1MxUVIzUzFRUjNTMVJSMVMzUXIzUzFTMjNTMVJSMVMzUXIzUzFTMjNTMVASMVMzUXIzUzFRMjNTMVA4D8wANA/QBAQEBAQEBAQEBAAwBAQEBAQEBAQP2AQECAQECAQEBAQEBAQEBAQEBA/oBAQIBAQIBAQAEAQECAQECAQED/AEBAgEBAgEBAA4BAQIBAQMBAQIBAQIBAQIBAQAGAQECAQECAQECAQEABAEBAQEABAEBAgEBAgEBAgEBAgEBAgEBAQEBAQEBAQEBAQEBAQEBAQAHAQEBAQEABAEBAAAAbAEAAQAOAA4AABAAJAA4AEwAYAB0AIgAnACwAMQA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAACUjETMRAzUjFTMjNTMVIyM1MxUjIzUzFSMjNTMVIwE1MxUjIzUzFSMjNTMVIyM1MxUjATUzFSMVNTMVIwU1MxUjIzUzFSMjNTMVIyM1MxUjIzUzFSMjNTMVIxM1IxUzBzUzFSMVNTMVIxM1IxUzBzUzFSMVNTMVIwE1IxUzBzUzFSMFNTMVIwOAQECAQEDAQECAQECAQECAQEABgEBAgEBAgEBAgEBAAQBAQEBAAQBAQIBAQIBAQIBAQIBAQIBAQEBAQEBAQEBAQEBAQEBAQEABwEBAQEBAAQBAQEADQPzAAwBAQEBAQEBAQEBA/QBAQEBAQEBAQAKAQECAQECAQEBAQEBAQEBAQEBAAYBAQIBAQIBAQP8AQECAQECAQEABAEBAgEBAgEBAAAAAGwBAAEADgAOAAAQACQAOABMAGAAdACIAJwAsADEANgA7AEAARQBKAE8AVABZAF4AYwBoAG0AcgB3AHwAgQCGAAA3NSEVISUzNSMVNTMVIzU1MxUjNTUzFSM1NTMVIzUBMxUjNTUzFSM1NTMVIzU1MxUjNQEzFSM1IzMVIzUDMxUjNTUzFSM1NTMVIzU1MxUjNTUzFSM1NTMVIzUFMzUjFSczFSM1IzMVIzUFMzUjFSczFSM1IzMVIzUBMzUjFSczFSM1AzMVIzVAA0D8wAMAQEBAQEBAQEBAQP0AQEBAQEBAQEACgEBAgEBAgEBAQEBAQEBAQEBAQAGAQECAQECAQED/AEBAgEBAgEBAAQBAQIBAQIBAQEBAQIBAQMBAQIBAQIBAQIBAQP6AQECAQECAQECAQED/AEBAQED/AEBAgEBAgEBAgEBAgEBAgEBAQEBAQEBAQEBAQEBAQEBAQP5AQEBAQED/AEBAAAAAABsAQABAA4ADgAAEAAkADgATABgAHQAiACcALAAxADYAOwBAAEUASgBPAFQAWQBeAGMAaABtAHIAdwB8AIEAhgAAEzMRIxETFTM1IzMVIzUzMxUjNTMzFSM1MzMVIzUzARUjNTMzFSM1MzMVIzUzMxUjNTMBFSM1MzUVIzUzJRUjNTMzFSM1MzMVIzUzMxUjNTMzFSM1MzMVIzUzAxUzNSM3FSM1MzUVIzUzAxUzNSM3FSM1MzUVIzUzARUzNSM3FSM1MyUVIzUzQEBAgEBAwEBAgEBAgEBAgEBA/oBAQIBAQIBAQIBAQP8AQEBAQP8AQECAQECAQECAQECAQECAQEBAQEBAQEBAQEBAQEBAQEBA/kBAQEBAQP8AQEADgPzAA0D9AEBAQEBAQEBAQEADAEBAQEBAQEBA/YBAQIBAQIBAQEBAQEBAQEBAQED+gEBAgEBAgEBAAQBAQIBAQIBAQP8AQECAQECAQEAAAAAhAEAAQAOAA4AABAAJAA4AEwAYAB0AIgAnACwAMQA2ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAAAE1IxUzIzUzFSMjNTMVIyM1MxUjIzUzFSMBNTMVIyM1MxUjIzUzFSMjNTMVIwE1MxUjFTUzFSMFNTMVIyM1MxUjIzUzFSMjNTMVIyM1MxUjIzUzFSMTNSMVMwc1MxUjFTUzFSMTNSMVMwc1MxUjFTUzFSMBNTMVIxM1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RUg6/rcQIRHMMWgzPGlOLSkiLhseIz1SLilRJiysQl5AOCgAAAIAgACAA8ADAAAFAAwAAAERIREhAQEhESM1IREDwPzAAkABAP0AAsDA/gACAP6AAoD/AP7AAUDA/gAAAAEAQACAA4ADQAALAAATFSERIREhNSERIRHAAoD9QAGA/kADQALAQP5AAkBA/UACQAAAAAABAEAAgAQAA0AADQAAAQMzEyEDIREhNSERIRMBLm5AWwJTbv1AAYD+QAMukgKA/oABQP6AAkBA/UACAAABAAAAAQAAOQQud18PPPUACwQAAAAAANKQOx0AAAAA0pA7HQAA/8AEAAPAAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAQAAAEAAAAAAAAAAAAAAAAAAAChBAAAAAAAAAAAAAAAAgAAAAQAASIEAAFABAABIgQAAUAEAAEABAABQAQAAQAEAAEABAABQAQAAcAEAAFABAABgAQAAQAEAAGABAABAAQAAYAEAAFABAABQAQAAUAEAAFABAABAAQAAQAEAAEABAABAAQAAMAEAAFABAAAwAQAAYAEAABABAABAAQAAKQEAACABAAAgAQAAMAEAAFABAAAwAQAAUAEAADABAAAwAQAAMEEAABUBAAAgAQAAMAEAADABAABAAQAAMAEAACABAAAgAQAAEAEAABABAAAQAQAAAAEAAAABAAAAAQAAAAEAABABAABAAQAAMAEAACABAAAgAQAAIAEAACABAABAAQAAIAEAACABAAAQAQAAEAEAAHABAAAgAQAAUAEAACABAAAgAQAAIAEAACABAABQAQAAMAEAAC1BAAAQAQAAEAEAABABAAAAAQAAEAEAACABAAAwAQAAQAEAADABAAAwAQAAEAEAAEABAAAcQQAAIAEAACABAAAwAQAAMAEAACaBAAAgAQAAIAEAACABAAAgAQAAIAEAABUBAAAgAQAAIAEAACABAAAgAQAAIAEAAAABAAAAAQAAAAEAACABAAAdwQAAIAEAACABAAAgAQAAAAEAABABAAAlgQAAAAEAACABAAAtwQAAEAEAAAABAAAQAQAAEAEAABABAAAQAQAAEAEAAAABAAAQAQAAEAEAABABAAAQAQAAEAEAABABAAAQAQAAEAEAABABAAAQAQAAEAEAABABAAAQAQAAMAEAABGBAABAAQAAEAEAABABAAAQAQAASwEAAChBAAAQAQAAEAEAABABAAAHQQAAFkEAACABAAAQAQAAEAAAAAAAAoAFAAeAC4APgBOAF4AdgCOAKYAvgDMANoA6AD2AQQBFAEiATABPgFMAVoBaAF2AYQBkgGgAbIBxAHYAewCMAJSAmgCsgLkAv4DFAMiAzIDSANuA6oEAAQkBD4ETARsBIwEtAT6BUYFoAXyBiQGVAaABsIG9gc8B1oHhggWCMIJBAksCVAJcAmOCawJvAnKCeAKDAo2ClQKhAqcCr4K4AsACx4LRAtoC8wL9gweDHgMugzoDZANtg7oD0gPqA/uEAwQmBEmEVoRjhHCEfYSShJoEoYSpBLgExwTQBNkE4gT2BTKFO4VEBU2FZIWIhZIFnIWvhcgF7gYEhhSGJQZABlCGYQZ8BowGnwauhrsG4YcPBzyHUQd+h6wH2YgHCD4IZ4h4iH2IjYidCKyI0gjniPyJEYknCV4Jdgl9iYQJi4AAQAAAKEA1gAhAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAA0AAAABAAAAAAACAAcAlgABAAAAAAADAA0ASAABAAAAAAAEAA0AqwABAAAAAAAFAAsAJwABAAAAAAAGAA0AbwABAAAAAAAKABoA0gADAAEECQABABoADQADAAEECQACAA4AnQADAAEECQADABoAVQADAAEECQAEABoAuAADAAEECQAFABYAMgADAAEECQAGABoAfAADAAEECQAKADQA7EtlbmRvVUlHbHlwaHMASwBlAG4AZABvAFUASQBHAGwAeQBwAGgAc1ZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMEtlbmRvVUlHbHlwaHMASwBlAG4AZABvAFUASQBHAGwAeQBwAGgAc0tlbmRvVUlHbHlwaHMASwBlAG4AZABvAFUASQBHAGwAeQBwAGgAc1JlZ3VsYXIAUgBlAGcAdQBsAGEAcktlbmRvVUlHbHlwaHMASwBlAG4AZABvAFUASQBHAGwAeQBwAGgAc0ZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\") format(\"woff\")}.k-icon{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:KendoUIGlyphs;font-style:normal;font-variant:normal;font-weight:400;font-size:16px;line-height:1;speak:none;text-transform:none;text-decoration:initial}.k-icon:before{vertical-align:baseline}.k-icon-md{font-size:32px}.k-icon-lg{font-size:48px}.k-i-arrow-n:before{content:'\\E600'}.k-i-arrow-e:before{content:'\\E601'}.k-i-arrow-s:before{content:'\\E602'}.k-i-arrow-w:before{content:'\\E603'}.k-i-seek-n:before{content:'\\E604'}.k-i-seek-e:before{content:'\\E605'}.k-i-seek-s:before{content:'\\E606'}.k-i-seek-w:before{content:'\\E607'}.k-i-sarrow-n:before{content:'\\E608'}.k-i-sarrow-e:before{content:'\\E609'}.k-i-sarrow-s:before{content:'\\E60A'}.k-i-sarrow-w:before{content:'\\E60B'}.k-i-expand-n:before{content:'\\E60C'}.k-i-expand-e:before{content:'\\E60D'}.k-i-expand-s:before{content:'\\E60E'}.k-i-expand-w:before{content:'\\E60F'}.k-i-collapse-ne:before{content:'\\E610'}.k-i-collapse-se:before{content:'\\E611'}.k-i-collapse-sw:before{content:'\\E612'}.k-i-collapse-nw:before{content:'\\E613'}.k-i-resize-ne:before{content:'\\E614'}.k-i-resize-se:before{content:'\\E615'}.k-i-resize-sw:before{content:'\\E616'}.k-i-resize-nw:before{content:'\\E617'}.k-i-arrowhead-n:before{content:'\\E618'}.k-i-arrowhead-e:before{content:'\\E619'}.k-i-arrowhead-s:before{content:'\\E61A'}.k-i-arrowhead-w:before{content:'\\E61B'}.k-i-pencil:before{content:'\\E61C'}.k-i-x:before{content:'\\E61D'}.k-i-checkmark:before{content:'\\E61E'}.k-i-deny:before{content:'\\E61F'}.k-i-trash:before{content:'\\E620'}.k-i-plus:before{content:'\\E621'}.k-i-splus:before{content:'\\E622'}.k-i-minus:before{content:'\\E623'}.k-i-sminus:before{content:'\\E624'}.k-i-filter:before{content:'\\E625'}.k-i-filter-clear:before{content:'\\E626'}.k-i-refresh:before{content:'\\E627'}.k-i-refresh-clear:before{content:'\\E628'}.k-i-restore:before{content:'\\E629'}.k-i-maximize:before{content:'\\E62A'}.k-i-minimize:before{content:'\\E62B'}.k-i-pin:before{content:'\\E62C'}.k-i-unpin:before{content:'\\E62D'}.k-i-calendar:before{content:'\\E62E'}.k-i-clock:before{content:'\\E62F'}.k-i-search:before{content:'\\E630'}.k-i-zoom-in:before{content:'\\E631'}.k-i-zoom-out:before{content:'\\E632'}.k-i-print:before{content:'\\E633'}.k-i-folder-add:before{content:'\\E634'}.k-i-folder-up:before{content:'\\E635'}.k-i-insert-image:before{content:'\\E636'}.k-i-image:before{content:'\\E637'}.k-i-insert-file:before{content:'\\E638'}.k-i-file:before{content:'\\E639'}.k-i-files:before{content:'\\E63A'}.k-i-pdf:before{content:'\\E63B'}.k-i-pdfa:before{content:'\\E68D'}.k-i-xls:before{content:'\\E63C'}.k-i-xlsa:before{content:'\\E63D'}.k-i-lock:before{content:'\\E63E'}.k-i-unlock:before{content:'\\E63F'}.k-i-rows:before{content:'\\E640'}.k-i-columns:before{content:'\\E641'}.k-i-hamburger:before{content:'\\E642'}.k-i-vbars:before{content:'\\E643'}.k-i-hbars:before{content:'\\E644'}.k-i-move:before{content:'\\E645'}.k-i-group:before{content:'\\E646'}.k-i-ungroup:before{content:'\\E647'}.k-i-dimension:before{content:'\\E648'}.k-i-connector:before{content:'\\E649'}.k-i-kpi:before{content:'\\E64A'}.k-i-undo:before{content:'\\E64B'}.k-i-redo:before{content:'\\E64C'}.k-i-undo-large:before{content:'\\E64D'}.k-i-redo-large:before{content:'\\E64E'}.k-i-rotate-ccw:before{content:'\\E64F'}.k-i-rotate-cw:before{content:'\\E650'}.k-i-cut:before{content:'\\E651'}.k-i-copy:before{content:'\\E652'}.k-i-paste:before{content:'\\E653'}.k-i-bold:before{content:'\\E654'}.k-i-italic:before{content:'\\E655'}.k-i-underline:before{content:'\\E656'}.k-i-strike-through:before{content:'\\E657'}.k-i-text:before{content:'\\E658'}.k-i-font-size:before{content:'\\E68E'}.k-i-font-family:before{content:'\\E68F'}.k-i-fx:before{content:'\\E659'}.k-i-subscript:before{content:'\\E65A'}.k-i-superscript:before{content:'\\E65B'}.k-i-background:before{content:'\\E65C'}.k-i-sum:before{content:'\\E65D'}.k-i-increase-decimal:before{content:'\\E65E'}.k-i-decrease-decimal:before{content:'\\E65F'}.k-i-justify-left:before{content:'\\E660'}.k-i-justify-center:before{content:'\\E661'}.k-i-justify-right:before{content:'\\E662'}.k-i-justify-full:before{content:'\\E663'}.k-i-justify-clear:before{content:'\\E664'}.k-i-align-top:before{content:'\\E665'}.k-i-align-middle:before{content:'\\E666'}.k-i-align-bottom:before{content:'\\E667'}.k-i-indent:before{content:'\\E668'}.k-i-outdent:before{content:'\\E669'}.k-i-insert-n:before{content:'\\E66A'}.k-i-insert-m:before{content:'\\E66B'}.k-i-insert-s:before{content:'\\E66C'}.k-i-insert-unordered-list:before{content:'\\E66D'}.k-i-insert-ordered-list:before{content:'\\E66E'}.k-i-sort-asc:before{content:'\\E66F'}.k-i-sort-desc:before{content:'\\E670'}.k-i-unsort:before{content:'\\E671'}.k-i-hyperlink:before{content:'\\E672'}.k-i-hyperlinremove:before{content:'\\E673'}.k-i-clearformat:before{content:'\\E674'}.k-i-html:before{content:'\\E675'}.k-i-exception:before{content:'\\E676'}.k-i-custom:before{content:'\\E677'}.k-i-cog:before{content:'\\E678'}.k-i-create-table:before{content:'\\E679'}.k-i-add-column-left:before{content:'\\E67A'}.k-i-add-column-right:before{content:'\\E67B'}.k-i-delete-column:before{content:'\\E67C'}.k-i-add-row-above:before{content:'\\E67D'}.k-i-add-row-below:before{content:'\\E67E'}.k-i-delete-row:before{content:'\\E67F'}.k-i-merge-cells:before{content:'\\E680'}.k-i-normal-layout:before{content:'\\E681'}.k-i-page-layout:before{content:'\\E682'}.k-i-all-borders:before{content:'\\E683'}.k-i-inside-borders:before{content:'\\E684'}.k-i-inside-horizontal-borders:before{content:'\\E685'}.k-i-inside-vertical-borders:before{content:'\\E686'}.k-i-outside-borders:before{content:'\\E687'}.k-i-top-border:before{content:'\\E688'}.k-i-right-border:before{content:'\\E689'}.k-i-bottom-border:before{content:'\\E68A'}.k-i-left-border:before{content:'\\E68B'}.k-i-no-borders:before{content:'\\E68C'}.k-i-merge-horizontally:before{content:'\\E690'}.k-i-merge-vertically:before{content:'\\E691'}.k-i-text-wrap:before{content:'\\E692'}.k-i-dollar:before{content:'\\E693'}.k-i-percent:before{content:'\\E694'}.k-i-freeze-col:before{content:'\\E695'}.k-i-freeze-row:before{content:'\\E696'}.k-i-freeze-panes:before{content:'\\E697'}.k-i-format-number:before{content:'\\E698'}.k-i-reset-color:before{content:'\\E900'}.k-i-file-horizontal:before{content:'\\E901'}.k-i-folder:before{content:'\\E902'}.k-i-folder-open:before{content:'\\E903'}.k-plus:before{content:'\\E621'}.k-minus:before{content:'\\E623'}.k-button{border-radius:2px;border-style:solid;border-width:1px;cursor:pointer;display:inline-block;font-family:inherit;line-height:1.2em;margin:0;padding:6px 18px;text-align:center;text-decoration:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.k-button [disabled]{cursor:default}.k-button::-moz-focus-inner{border:0;padding:0}.k-button .k-icon{vertical-align:text-bottom}.k-button>.k-image{vertical-align:middle}.k-button .k-icon,.k-button>.k-image{margin-right:6px}.k-button-icon{padding:6px;line-height:1em}.k-button-icon .k-icon{margin-right:0}.k-button-icon>span{width:1em}.k-button-icontext{overflow:visible}.k-button-bare{border-width:0;color:inherit}.k-button-group{display:inline-block;border-width:1px;border-style:solid}.k-button-group .k-button{border-width:0;position:relative;margin-left:1px}.k-button-group .k-button:before{content:'';height:100%;position:absolute;width:1px;top:0;left:0;margin-left:-1px}.k-button-group .k-button.k-group-start{margin-left:0}.k-button-group .k-button.k-group-start:before{display:none}.k-button{color:#656565;background-color:#fff;background-image:-webkit-linear-gradient(#f6f6f6,#f1f1f1);background-image:linear-gradient(#f6f6f6,#f1f1f1);border-color:rgba(0,0,0,.08);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.k-button>.k-icon{color:inherit}.k-button:hover{background-image:-webkit-linear-gradient(#eaeaea,#e8e8e8);background-image:linear-gradient(#eaeaea,#e8e8e8);border-color:rgba(0,0,0,.15)}.k-button.k-state-focused,.k-button:focus{background-color:#fff;background-image:-webkit-linear-gradient(#f6f6f6,#f1f1f1);background-image:linear-gradient(#f6f6f6,#f1f1f1);border-color:rgba(0,0,0,.15);box-shadow:0 0 0 2px #f0f0f0;outline:0}.k-button.k-state-active,.k-button:active{background-image:-webkit-linear-gradient(#f1f1f1,#f6f6f6);background-image:linear-gradient(#f1f1f1,#f6f6f6);border-color:rgba(0,0,0,.1);box-shadow:inset 0 3px 5px #e8e8e8}.k-button.k-state-disabled,.k-button.k-state-disabled:active,.k-button.k-state-disabled:hover,.k-button[disabled],.k-state-disabled .k-button,.k-state-disabled .k-button:active,.k-state-disabled .k-button:hover,[disabled] .k-button{color:#656565;background-image:-webkit-linear-gradient(#f6f6f6,#f1f1f1);background-image:linear-gradient(#f6f6f6,#f1f1f1);border-color:rgba(0,0,0,.08);opacity:.7;box-shadow:none;cursor:default;outline:0}.k-primary{color:#fff;background-color:#ff6358;background-image:-webkit-linear-gradient(#ff6b58,#ff6358);background-image:linear-gradient(#ff6b58,#ff6358);border-color:#ff6358}.k-primary:hover{background-image:-webkit-linear-gradient(#ff7458,#ff6b58);background-image:linear-gradient(#ff7458,#ff6b58);border-color:#ff6358}.k-primary.k-state-focused,.k-primary:focus{background-color:#ff6358;background-image:-webkit-linear-gradient(#ff6b58,#ff6358);background-image:linear-gradient(#ff6b58,#ff6358);box-shadow:0 0 0 2px #ffd1cd}.k-primary.k-state-active,.k-primary:active{background-image:-webkit-linear-gradient(#ff6358,#ff6b58);background-image:linear-gradient(#ff6358,#ff6b58);box-shadow:inset 0 3px 5px #fc655b}.k-primary.k-state-disabled,.k-primary .k-state-disabled:active,.k-primary .k-state-disabled:focus,.k-primary.k-state-disabled:hover{color:#fff;background-color:#ff6358;background-image:-webkit-linear-gradient(#ff7458,#ff6358);background-image:linear-gradient(#ff7458,#ff6358);border-color:#ff6358;box-shadow:none}.k-button-group{border-color:rgba(0,0,0,.08);border-radius:2px}.k-button-group .k-button{border-radius:0}.k-button-group .k-button:before{background:rgba(0,0,0,.08)}.k-button-group .k-button:focus{box-shadow:inset 0 0 0 2px #e9e9e9}.k-button-group .k-button.k-state-active{color:#fff;background-color:#ff6358;background-image:-webkit-linear-gradient(#ff6b58,#ff6358);background-image:linear-gradient(#ff6b58,#ff6358);border-color:#ff6358;box-shadow:none}.k-button-group .k-button.k-state-active:focus{box-shadow:inset 0 0 0 2px #ff594e}.k-button-group .k-button.k-state-active:hover{background-image:-webkit-linear-gradient(#ff7458,#ff6b58);background-image:linear-gradient(#ff7458,#ff6b58);border-color:#ff6358}.k-button-group .k-button.k-state-active.k-state-active+.k-button:before,.k-button-group .k-button.k-state-active.k-state-active:before{background:#ff6358}.k-button-group .k-button.k-group-start{border-radius:1px 0 0 1px}.k-button-group .k-button.k-group-end{border-radius:0 1px 1px 0}.k-button-group .k-button.k-group-start:last-child{border-radius:2px}.k-button-group.k-state-disabled .k-button:focus{box-shadow:none}.k-animation-container{position:absolute;overflow:hidden;z-index:100}.k-animation-container-fixed{position:fixed}.k-push-right-appear,.k-push-right-enter{-webkit-transform:translate(-100%);transform:translate(-100%)}.k-push-right-appear-active,.k-push-right-enter-active{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-right-leave{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-push-right-leave-active{-webkit-transform:translate(100%,-100%);transform:translate(100%,-100%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-right-enter-active+.k-push-right-enter-active,.k-push-right-leave-active+.k-push-right-leave-active{display:none}.k-push-left-appear,.k-push-left-enter{-webkit-transform:translate(100%);transform:translate(100%)}.k-push-left-appear-active,.k-push-left-enter-active{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-left-leave{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-push-left-leave-active{-webkit-transform:translate(-100%,-100%);transform:translate(-100%,-100%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-left-enter-active+.k-push-left-enter-active,.k-push-left-leave-active+.k-push-left-leave-active{display:none}.k-push-down-appear,.k-push-down-enter{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-push-down-appear-active,.k-push-down-enter-active{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-down-leave{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-push-down-leave-active{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-up-appear,.k-push-up-enter{-webkit-transform:translateY(100%);transform:translateY(100%)}.k-push-up-appear-active,.k-push-up-enter-active{-webkit-transform:translate(0);transform:translate(0);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-push-up-leave{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-push-up-leave-active{-webkit-transform:translateY(-200%);transform:translateY(-200%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-expand .k-child-animation-container{overflow:hidden}.k-fade-enter{opacity:0}.k-fade-enter-active{opacity:1;-webkit-transition:opacity .5s ease-in-out;transition:opacity .5s ease-in-out}.k-fade-leave{opacity:1}.k-fade-leave-active{opacity:0;-webkit-transition:opacity .5s ease-in-out;transition:opacity .5s ease-in-out}.k-fade-enter-active+.k-fade-enter-active,.k-fade-leave-active+.k-fade-leave-active{display:none}.k-zoom-in-appear,.k-zoom-in-enter{opacity:0}.k-zoom-in-appear-active,.k-zoom-in-enter-active{opacity:1;-webkit-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out}.k-zoom-in-leave{-webkit-transform:translateY(-100%) scale(1);transform:translateY(-100%) scale(1)}.k-zoom-in-leave-active{-webkit-transform:translateY(-100%) scale(0);transform:translateY(-100%) scale(0);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-zoom-out-appear,.k-zoom-out-enter{-webkit-transform:scale(0);transform:scale(0)}.k-zoom-out-appear-active,.k-zoom-out-enter-active{-webkit-transform:scale(1);transform:scale(1);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-zoom-out-leave{opacity:1;-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-zoom-out-leave-active{opacity:0;-webkit-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out}.k-slide-in-appear{opacity:.1;-webkit-transform:translateY(-3em);transform:translateY(-3em)}.k-slide-in-appear .k-centered{-webkit-transform:translate(-50%,-60%);transform:translate(-50%,-60%)}.k-slide-in-appear-active{opacity:1;-webkit-transform:translate(0);transform:translate(0);-webkit-transition:opacity .3s cubic-bezier(.2,1,.2,1),-webkit-transform .3s cubic-bezier(.2,.6,.4,1);transition:opacity .3s cubic-bezier(.2,1,.2,1),-webkit-transform .3s cubic-bezier(.2,.6,.4,1);transition:transform .3s cubic-bezier(.2,.6,.4,1),opacity .3s cubic-bezier(.2,1,.2,1);transition:transform .3s cubic-bezier(.2,.6,.4,1),opacity .3s cubic-bezier(.2,1,.2,1),-webkit-transform .3s cubic-bezier(.2,.6,.4,1)}.k-slide-in-appear-active .k-centered{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.k-slide-down-enter{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.k-slide-down-enter-active{-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-down-enter-active,.k-slide-down-leave{-webkit-transform:translateY(0);transform:translateY(0)}.k-slide-down-leave-active{-webkit-transform:translateY(-100%);transform:translateY(-100%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-up-enter{-webkit-transform:translateY(100%);transform:translateY(100%)}.k-slide-up-enter-active{-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-up-enter-active,.k-slide-up-leave{-webkit-transform:translateY(0);transform:translateY(0)}.k-slide-up-leave-active{-webkit-transform:translateY(100%);transform:translateY(100%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-right-enter{-webkit-transform:translateX(-100%);transform:translateX(-100%)}.k-slide-right-enter-active{-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-right-enter-active,.k-slide-right-leave{-webkit-transform:translateX(0);transform:translateX(0)}.k-slide-right-leave-active{-webkit-transform:translateX(-100%);transform:translateX(-100%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-left-enter{-webkit-transform:translateX(100%);transform:translateX(100%)}.k-slide-left-enter-active{-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-slide-left-enter-active,.k-slide-left-leave{-webkit-transform:translateX(0);transform:translateX(0)}.k-slide-left-leave-active{-webkit-transform:translateX(100%);transform:translateX(100%);-webkit-transition:-webkit-transform .3s ease-in-out;transition:-webkit-transform .3s ease-in-out;transition:transform .3s ease-in-out;transition:transform .3s ease-in-out,-webkit-transform .3s ease-in-out}.k-popup .k-list-optionlabel,.k-popup .k-list .k-item{padding:1px 17px 1px 8px;line-height:2em;min-height:2em;white-space:normal}.k-popup.k-list-container{border-width:1px;border-style:solid;box-sizing:border-box}.k-list-optionlabel{border-bottom-width:1px;border-bottom-style:solid}.k-list-filter{display:block;position:relative;margin:8px}.k-list-filter>.k-textbox{padding-right:20px;width:100%;box-sizing:border-box}.k-list-filter>.k-icon{position:absolute;right:6px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.k-popup{color:#656565}.k-popup.k-list-container{background-color:#f6f6f6;border-color:rgba(0,0,0,.08)}.k-popup.k-list-container .k-item{-webkit-transition:background-color .2s ease;transition:background-color .2s ease;cursor:pointer}.k-popup.k-list-container .k-item.k-state-selected{box-shadow:none}.k-popup.k-list-container .k-item:hover{background-color:#ededed}.k-popup.k-list-container .k-item:hover.k-state-selected{background-color:#ed5c52;color:#fff}.k-popup.k-list-container .k-item.k-state-focused,.k-popup.k-list-container .k-item:focus{box-shadow:inset 0 0 0 2px #dfdfdf}.k-popup.k-list-container .k-item.k-state-focused.k-state-selected,.k-popup.k-list-container .k-item:focus.k-state-selected{box-shadow:inset 0 0 0 1px #eb5b51}.k-popup.k-list-container .k-list-optionlabel{border-bottom-color:rgba(0,0,0,.08);box-shadow:0 5px 10px 0 rgba(0,0,0,.06)}.k-animation-container{border-radius:0 0 2px 2px}.k-autocomplete,.k-combobox,.k-dropdown,.k-textbox{box-sizing:border-box;position:relative;display:inline-block;width:12.4em;overflow:visible;border-width:0;vertical-align:middle}.k-autocomplete,.k-combobox,.k-dropdown{white-space:nowrap}.k-autocomplete .k-popup,.k-combobox .k-popup,.k-dropdown .k-popup{width:100%}.k-autocomplete{position:relative;cursor:default}.k-dropdown-wrap{display:block;position:relative}.k-dropdown-wrap .k-select{position:absolute;top:0;right:0;display:inline-block;text-decoration:none;min-height:1.65em;line-height:2em;vertical-align:middle;text-align:center;width:1.9em;height:100%;padding:0}.k-dropdown-wrap .k-icon{line-height:2.004em}.k-list-scroller{position:relative;overflow:auto}.k-autocomplete,.k-dropdown-wrap,.k-textbox{border-width:1px;border-style:solid;padding:0 1.9em 0 0}.k-autocomplete,.k-textbox{padding:0}.k-space-left .k-icon{left:3px}.k-space-right .k-icon{right:3px}.k-textbox:after{content:'\\A0';display:block;height:.4px;overflow:hidden}.k-combobox .k-input,.k-textbox>input{width:100%;vertical-align:top}.k-dropdown-wrap .k-input,.k-selectbox .k-input{font-family:inherit;border-width:0;outline:0}.k-dropdown .k-input,.k-selectbox .k-input{background:transparent;display:block;overflow:hidden;text-overflow:ellipsis}.k-combobox .k-select{border-style:solid;border-width:0;border-color:inherit}.k-autocomplete .k-input,.k-textbox>input{display:block}.k-autocomplete .k-input{width:100%}.k-dropdown .k-select,.k-selectbox .k-select{overflow:hidden;border:0;text-decoration:none;font:inherit;color:inherit}.k-autocomplete .k-input,.k-dropdown-wrap .k-input,.k-selectbox .k-input,.k-textbox>input{height:1.65em;line-height:1.65em;padding:.177em 0;text-indent:.33em;border:0;margin:0}.k-webkit .k-combobox .k-dropdown-wrap:before{padding-bottom:.38em}.k-combobox .k-icon,.k-dropdown,.k-selectbox .k-icon{cursor:pointer}.k-multiselect-wrap{position:relative;border-width:0;border-style:solid;border-radius:4px;min-height:2.04em}.k-multiselect-wrap .k-input{background-color:transparent;height:1.31em;line-height:1.31em;padding:.18em 0;text-indent:.33em;border:0;margin:1px 0 0;float:left}.k-multiselect-wrap .k-input::-ms-clear{display:none}.k-multiselect-wrap li{margin:1px 0 1px 1px;padding:.1em 1.6em .1em .4em;line-height:1.5em;float:left;position:relative}.k-multiselect-wrap .k-select{position:absolute;top:0;bottom:0;right:0;padding:.1em .2em}.k-autocomplete .k-loading,.k-multiselect .k-loading{position:absolute;right:3px;bottom:4px}.k-multiselect .k-loading-hidden{visibility:hidden}.k-textbox{display:inline-block;vertical-align:middle;outline:0}.k-textbox.k-space-left{padding-left:1.9em}.k-textbox.k-space-right{padding-right:1.9em}.k-textbox .k-icon{top:50%;margin:-8px 0 0;position:absolute}.k-input{padding:.25em 0}.k-input,.k-textbox>input{outline:0;-webkit-tap-highlight-color:transparent}input.k-textbox,textarea.k-textbox{padding:2px .3em}input.k-textbox{height:2em;text-indent:.33em;line-height:2em}.k-ie input.k-textbox{text-indent:.165em}.k-ff input.k-textbox{height:2.17em}textarea.k-textbox{height:auto}.k-combobox,.k-dropdown,.k-dropdown-wrap{border-radius:2px}.k-dropdown-wrap{background-color:#fff;background-image:-webkit-linear-gradient(#f6f6f6,#f1f1f1);background-image:linear-gradient(#f6f6f6,#f1f1f1);border-color:rgba(0,0,0,.08)}.k-dropdown-wrap:hover,.k-dropdown-wrap:hover .k-select{background-color:#ededed;background-image:-webkit-linear-gradient(#eaeaea,#e8e8e8);background-image:linear-gradient(#eaeaea,#e8e8e8);border-color:rgba(0,0,0,.15)}.k-dropdown-wrap.k-state-focused,.k-dropdown-wrap:focus{border-color:rgba(0,0,0,.15);box-shadow:0 0 0 2px #f0f0f0;outline:0}.k-dropdown-wrap.k-state-disabled.k-state-focused,.k-dropdown-wrap.k-state-disabled:hover{box-shadow:none;background-color:#fff;background-position:50% 50%;border-color:rgba(0,0,0,.08)}.k-dropdown-wrap.k-state-invalid{color:#fff;background-color:#f31700;background-image:none}.k-dropdown-wrap.k-state-invalid>.k-input{color:#fff}.k-dropdown-wrap .k-input{border-radius:2px 0 0 2px}.k-dropdown-wrap>.k-select{border-radius:0 2px 2px 0}.k-combobox .k-dropdown-wrap.k-state-invalid>.k-input{color:#656565}.k-combobox .k-dropdown-wrap.k-state-invalid .k-select{color:#fff;background-color:#f31700;background-image:none}.k-textbox{border-color:rgba(0,0,0,.08);border-radius:2px}.k-textbox:hover{border-color:rgba(0,0,0,.15)}.k-dropdown-wrap.k-state-border-down{border-radius:2px 2px 0 0}.k-switch{cursor:pointer;display:inline-block;font-size:.75em;overflow:hidden;position:relative;text-align:left;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;width:5em;outline:0}.k-switch [type=checkbox]{display:none}.k-switch,.k-switch-container,.k-switch-handle,.k-switch-wrapper{box-sizing:border-box}.k-switch-wrapper{display:none}.k-switch .k-switch-background{border-top-right-radius:0;border-bottom-right-radius:0}.k-switch-container{padding:2px 0;display:block;width:100%;overflow:hidden;background:transparent;border-width:0;-webkit-transform:translateZ(0);transform:translateZ(0)}.k-switch-handle{position:relative;width:2em;height:2em;display:inline-block;background-color:currentcolor;margin:0 6px 0 2px;border:1px solid transparent;background-clip:padding-box;box-shadow:0 1px 0 1px currentcolor,0 -1px 0 1px currentcolor;vertical-align:middle}.k-switch-label-off{left:2em;margin-left:2px}.k-switch-label-on{left:-2em}.k-switch-label-off,.k-switch-label-on{top:-1px;display:block;text-align:center;position:absolute;text-transform:uppercase;text-shadow:none;line-height:2em;vertical-align:middle}.k-switch-container,.k-switch-wrapper{border-width:1px;border-style:solid;background-clip:content-box}.k-switch,.k-switch-container,.k-switch-wrapper{border-radius:1.25em;outline:0}.k-switch-container,.k-switch-wrapper{border-color:rgba(0,0,0,.08)}.k-switch-container:hover,.k-switch-wrapper:hover{border-color:rgba(0,0,0,.15)}.k-switch-container{box-shadow:inset 0 2px 4px 0 rgba(0,0,0,.06)}.k-switch-wrapper{background-color:#fff}.k-switch-background{background-position:4.3em 0;background-repeat:no-repeat}.k-switch-handle{background-color:#fff;background-image:-webkit-linear-gradient(#f5f5f5,#f2f2f2);background-image:linear-gradient(#f5f5f5,#f2f2f2);border-color:rgba(0,0,0,.08);box-shadow:0 2px 4px 0 rgba(0,0,0,.06);border-radius:50%}.k-switch-off,.k-switch-on{color:#fff}.k-switch-on .k-switch-handle{background:#ff6358;border-color:#ff6358}.k-switch-on:hover .k-switch-handle{background-color:#ff6358;background-image:-webkit-linear-gradient(#ff7658,#ff6e58);background-image:linear-gradient(#ff7658,#ff6e58);border-color:#ff6b58}.k-switch-off:hover .k-switch-handle{background-image:-webkit-linear-gradient(#ededed,#e8e8e8);background-image:linear-gradient(#ededed,#e8e8e8);border-color:rgba(0,0,0,.15)}.k-switch-off:focus .k-switch-handle{background-image:-webkit-linear-gradient(#f5f5f5,#f2f2f2);background-image:linear-gradient(#f5f5f5,#f2f2f2)}.k-switch-label-on{color:#ff6358;background-color:transparent}.k-switch-label-off{color:#868686}.k-switch:focus{box-shadow:0 0 0 2px rgba(0,0,0,.06);outline:none}.k-switch:focus .k-switch-container,.k-switch:focus .k-switch-wrapper{border-color:rgba(0,0,0,.15)}.k-switch.k-state-disabled{cursor:auto}.k-switch.k-state-disabled .k-switch-container,.k-switch.k-state-disabled .k-switch-wrapper{border-color:rgba(0,0,0,.08);box-shadow:none}.k-switch.k-state-disabled:focus{box-shadow:none}.k-switch.k-state-disabled .k-switch-handle{background-image:-webkit-linear-gradient(#f5f5f5,#f2f2f2);background-image:linear-gradient(#f5f5f5,#f2f2f2);border-color:rgba(0,0,0,.08)}.k-switch.k-state-disabled.k-switch-on .k-switch-handle{background:#ff6358;border-color:#ff6358;opacity:.5}.k-slider{background-color:transparent;border-width:0;position:relative}.k-slider .k-button{height:28px;line-height:28px;margin:0;min-width:0;outline:0;padding:0;position:absolute;width:28px;box-sizing:content-box}.k-slider .k-button .k-icon{vertical-align:baseline;line-height:28px;margin-right:0}.k-slider .k-button-increase{right:0;top:0}.k-slider .k-button-decrease{left:0;top:0}.k-slider .k-label{font-size:.92em;position:absolute;white-space:nowrap}.k-slider .k-slider-track,.k-slider .k-tick{cursor:pointer}.k-slider .k-tick{background-color:transparent;background-position:50%;background-repeat:no-repeat;margin:0;padding:0;position:relative}.k-slider.k-state-disabled .k-draghandle,.k-slider.k-state-disabled .k-slider-track,.k-slider.k-state-disabled .k-tick{cursor:default}.k-slider-vertical{height:200px;width:30px;outline:0}.k-slider-vertical .k-button-decrease{bottom:0;top:auto}.k-slider-vertical .k-tick{text-align:right;margin-left:2px}.k-slider-vertical .k-slider-topleft .k-tick{text-align:left}.k-slider-vertical .k-tick{background-position:-92px}.k-slider-vertical .k-slider-topleft .k-tick{background-position:-122px}.k-slider-vertical .k-slider-bottomright .k-tick{background-position:-152px}.k-slider-vertical .k-ticlarge{background-position:-2px}.k-slider-vertical .k-slider-topleft .k-ticlarge{background-position:-32px}.k-slider-vertical .k-slider-bottomright .k-ticlarge{background-position:-62px}.k-slider-vertical .k-first{background-position:-92px 100%}.k-slider-vertical .k-ticlarge.k-first{background-position:-2px 100%}.k-slider-vertical .k-slider-topleft .k-first{background-position:-122px 100%}.k-slider-vertical .k-slider-topleft .k-ticlarge.k-first{background-position:-32px 100%}.k-slider-vertical .k-slider-bottomright .k-first{background-position:-152px 100%}.k-slider-vertical .k-slider-bottomright .k-ticlarge.k-first{background-position:-62px 100%}.k-slider-vertical .k-last{background-position:-92px 0}.k-slider-vertical .k-ticlarge.k-last{background-position:-2px 0}.k-slider-vertical .k-slider-topleft .k-last{background-position:-122px 0}.k-slider-vertical .k-slider-topleft .k-ticlarge.k-last{background-position:-32px 0}.k-slider-vertical .k-slider-bottomright .k-last{background-position:-152px 0}.k-slider-vertical .k-slider-bottomright .k-ticlarge.k-last{background-position:-62px 0}.k-slider-vertical .k-label{display:block;left:120%;text-align:left}.k-slider-vertical .k-last .k-label{top:-.5em}.k-slider-vertical .k-first .k-label{bottom:-.5em}.k-slider-vertical .k-slider-topleft .k-label{left:auto;right:120%}.k-slider-horizontal{display:inline-block;height:30px;width:200px;outline:0}.k-slider-horizontal .k-tick{float:left;height:100%;text-align:center;margin-top:2px;background-position:center -92px}.k-slider-horizontal .k-slider-topleft .k-tick{background-position:center -122px}.k-slider-horizontal .k-slider-bottomright .k-tick{background-position:center -152px}.k-slider-horizontal .k-ticlarge{background-position:center -2px}.k-slider-horizontal .k-slider-topleft .k-ticlarge{background-position:center -32px}.k-slider-horizontal .k-slider-bottomright .k-ticlarge{background-position:center -62px}.k-slider-horizontal .k-first{background-position:0 -92px}.k-slider-horizontal .k-ticlarge.k-first{background-position:0 -2px}.k-slider-horizontal .k-slider-topleft .k-first{background-position:0 -122px}.k-slider-horizontal .k-slider-topleft .k-ticlarge.k-first{background-position:0 -32px}.k-slider-horizontal .k-slider-bottomright .k-first{background-position:0 -152px}.k-slider-horizontal .k-slider-bottomright .k-ticlarge.k-first{background-position:0 -62px}.k-slider-horizontal .k-last{background-position:100% -92px}.k-slider-horizontal .k-ticlarge.k-last{background-position:100% -2px}.k-slider-horizontal .k-slider-topleft .k-last{background-position:100% -122px}.k-slider-horizontal .k-slider-topleft .k-ticlarge.k-last{background-position:100% -32px}.k-slider-horizontal .k-slider-bottomright .k-last{background-position:100% -152px}.k-slider-horizontal .k-slider-bottomright .k-ticlarge.k-last{background-position:100% -62px}.k-slider-horizontal .k-label{left:0;bottom:-1.2em;line-height:1;width:100%}.k-slider-horizontal .k-first .k-label{left:-50%}.k-slider-horizontal .k-last .k-label{left:auto;right:-50%}.k-slider-horizontal .k-slider-topleft .k-label{top:-1.2em}.k-slider-wrap{height:100%;width:100%}.k-slider-selection,.k-slider-track{margin:0;padding:0;position:absolute}.k-slider-horizontal .k-slider-selection,.k-slider-horizontal .k-slider-track{height:4px;left:0;margin-top:-2px;top:50%}.k-slider-vertical .k-slider-selection,.k-slider-vertical .k-slider-track{bottom:0;left:50%;margin-left:-2px;width:4px}.k-slider-horizontal .k-slider-buttons .k-slider-track{left:38px}.k-slider-vertical .k-slider-buttons .k-slider-track{bottom:38px}.k-draghandle{background-color:transparent;background-repeat:no-repeat;border-style:solid;border-width:1px;outline:0;overflow:hidden;position:absolute;text-align:center;text-decoration:none;text-indent:-3333px;box-sizing:content-box}.k-slider-horizontal .k-draghandle{height:14px;top:-6px;width:14px;-webkit-transition:left .3s ease-out,background-color .3s ease-out;transition:left .3s ease-out,background-color .3s ease-out}.k-slider-vertical .k-draghandle{height:14px;left:-6px;width:14px;-webkit-transition:bottom .3s ease-out,background-color .3s ease-out;transition:bottom .3s ease-out,background-color .3s ease-out}.k-draghandle.k-pressed{-webkit-transition:none;transition:none}.k-slider-horizontal .k-slider-selection{-webkit-transition:width .3s ease-out;transition:width .3s ease-out}.k-slider-vertical .k-slider-selection{-webkit-transition:height .3s ease-out;transition:height .3s ease-out}.k-slider-selection.k-pressed{-webkit-transition:none;transition:none}.k-slider-items{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.k-slider-buttons .k-slider-items{margin-left:38px}.k-slider-horizontal .k-slider-items{height:100%}.k-slider-vertical .k-slider-items{padding-top:1px}.k-slider-horizontal .k-slider-buttons .k-slider-items{padding-top:0}.k-slider-vertical .k-slider-buttons .k-slider-items{margin:0;padding-top:35px}.k-slider .k-slider-selection,.k-slider .k-slider-track{border-radius:2px}.k-slider .k-slider-track{background-color:#e6e6e6}.k-slider .k-draghandle,.k-slider .k-slider-selection{background-color:#ff6358}.k-slider .k-draghandle{border-color:rgba(0,0,0,.08);border-radius:50%}.k-slider .k-draghandle.k-pressed,.k-slider .k-draghandle:hover{background-color:#ff5044}.k-slider .k-draghandle:focus{box-shadow:0 0 2px 2px rgba(0,0,0,.06)}.k-slider .k-draghandle.k-pressed,.k-slider .k-draghandle:active{box-shadow:inset 0 2px 3px 1px rgba(0,0,0,.06)}.k-slider .k-draghandle:hover{border-color:rgba(0,0,0,.15)}.k-slider .k-button{border-radius:50%}.k-slider .k-button:active{color:#656565;box-shadow:0 0 0 2px rgba(0,0,0,.06)}.k-slider.k-state-disabled .k-button:active,.k-slider.k-state-disabled .k-button:focus,.k-slider.k-state-disabled .k-button:hover,.k-slider.k-state-disabled .k-draghandle:active,.k-slider.k-state-disabled .k-draghandle:focus,.k-slider.k-state-disabled .k-draghandle:hover{color:#fefefe;background-color:#ff6358;border-color:rgba(0,0,0,.08);box-shadow:none}.k-slider-horizontal .k-tick{background-image:url(\"data:image/gif;base64,R0lGODlhAQC0AIABALi4uAAAACH5BAEAAAEALAAAAAABALQAAAIWjIGJxqzazlux2ovlzND2rAHgSIZWAQA7\")}.k-slider-vertical .k-tick{background-image:url(\"data:image/gif;base64,R0lGODlhtAABAIABALi4uAAAACH5BAEAAAEALAAAAAC0AAEAAAIWjIGJxqzazlux2ovlzND2rAHgSIZWAQA7\")}.k-progressbar{display:inline-block;position:relative;vertical-align:middle;border-width:1px;border-style:solid;border-radius:2px}.k-progressbar>.k-state-selected{position:absolute;border-style:solid;border-width:1px;overflow:hidden}.k-progressbar>.k-reset{list-style:none;margin:0;padding:0;position:absolute;left:-1px;top:-1px;width:100%;height:100%;border-radius:2px;white-space:nowrap}.k-progressbar-horizontal{width:27em;height:1.9em}.k-progressbar-horizontal>.k-state-selected{left:-1px;right:auto;top:-1px;height:100%;border-radius:2px 0 0 2px}.k-progressbar-horizontal .k-item{display:inline-block;height:100%;border-style:solid;margin-left:-1px;border-width:1px 0 1px 1px}.k-progressbar-horizontal .k-item.k-first{margin-left:0}.k-progressbar-horizontal .k-item.k-last{border-right-width:0}.k-progressbar-horizontal.k-progressbar-reverse>.k-state-selected{left:auto;right:-1px;border-radius:0 2px 2px 0}.k-progressbar-horizontal.k-progressbar-reverse .k-item{border-width:1px 0 1px 1px}.k-progressbar-vertical{width:1.9em;height:27em}.k-progressbar-vertical>.k-state-selected{left:-1px;bottom:-1px;width:100%;border-radius:0 0 2px 2px}.k-progressbar-vertical.k-progressbar-reverse>.k-state-selected{bottom:auto;top:-1px;border-radius:2px 2px 0 0}.k-progressbar>.k-state-selected.k-complete{border-radius:2px}.k-progressbar-horizontal .k-first{border-top-left-radius:2px;border-bottom-left-radius:2px;border-left-width:1px}.k-progressbar-horizontal .k-last{border-top-right-radius:2px;border-bottom-right-radius:2px}.k-progressbar-horizontal .k-last.k-state-selected,.k-progressbar-horizontal.k-progressbar-reverse .k-last{border-right-width:1px}.k-progressbar-vertical .k-item{width:100%;border-style:solid;border-width:1px 1px 0;margin-top:-1px}.k-progressbar-vertical .k-item.k-first{margin-top:0}.k-progressbar-vertical .k-item.k-last{border-bottom-width:0}.k-progressbar-vertical .k-first{border-top-left-radius:2px;border-top-right-radius:2px}.k-progressbar-vertical .k-last{border-bottom-left-radius:2px;border-bottom-right-radius:2px;border-bottom-width:1px}.k-progressbar-vertical.k-progressbar-reverse .k-first{border-top-width:1px}.k-progress-status-wrap{position:absolute;top:-1px;border:1px solid transparent;border-radius:2px;line-height:2em;width:100%;height:100%;left:-1px;right:auto;text-align:right}.k-progressbar-horizontal.k-progressbar-reverse .k-progress-status-wrap{left:auto;right:-1px;text-align:left}.k-progressbar-vertical .k-progress-status-wrap{top:auto;bottom:-1px}.k-progressbar-vertical.k-progressbar-reverse .k-progress-status-wrap{bottom:auto;top:-1px}.k-progress-status{display:inline-block;padding:0 .5em;min-width:10px;white-space:nowrap}.k-progressbar-vertical.k-progressbar-reverse .k-progress-status{position:absolute;bottom:0;left:0}.k-progressbar-vertical .k-progress-status{-webkit-transform:rotate(-90deg) translateX(-100%);transform:rotate(-90deg) translateX(-100%);-webkit-transform-origin:0 0;transform-origin:0 0}.k-progressbar-vertical.k-progressbar-reverse .k-progress-status{-webkit-transform:rotate(90deg) translateX(-100%);transform:rotate(90deg) translateX(-100%);-webkit-transform-origin:0 100%;transform-origin:0 100%}.k-progressbar{background-color:#f6f6f6}.k-progressbar,.k-progressbar .k-item{border-color:rgba(0,0,0,.08)}.k-progressbar .k-state-selected{border-color:#ff5044}.k-progressbar-indeterminate{background:url(\"data:image/gif;base64,R0lGODlhFgAWAJECAPDw8OTk5AAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBAACACwAAAAAFgAWAAACL4yPAcsNmZyESDp6bMNGM654DyeOWAmipJiyqweGWuy+Fg23s37zk38BboQf4qIAACH5BAUEAAIALAAAAAAWABYAAAIwBIKpYe231ntRTlfTxZlt03lf+IFdCWUoWbLj2cKvGstXKN6ubk94Tdv8ZkFe0VEAACH5BAUEAAIALAAAAAAWABYAAAIwhBGpG+fH4nuRTVfXhTltnn1G14ikiHToaapt+Far+7E1vZFlbl96LLvhJj8hzFEAACH5BAUEAAIALAAAAAAWABYAAAIwhB+pG+fI2HtRTljTxXmbrHgAqImkOILoaapt91ar67E1vdk5fpHNzaPoJr6Y7FAAACH5BAUEAAIALAAAAAAWABYAAAIvhG+hy4EPmoRINnosw0krHnkOJ45YCaKpB4ZaK8Ls+tKWXJOznp+736OogMGHqgAAIfkEBQQAAgAsAAAAABYAFgAAAi+Ej6HLgQ+ahEkyeuzFUSveeaD3caRjkqOaiqsGhlbMtvN72xO+6w3t8m2EC6CnAAAh+QQFBAACACwAAAAAFgAWAAACMAyOCcHtCp1kME1Z0X15bdp9YCYaodh5X1qy6LnCW6pe9CtPd5xj7vyzBXVDX69RAAAh+QQFBAACACwAAAAAFgAWAAACMIyBqWDtseJ7cU1X1cWZ7dN9YCZCodh5X1qy6LnCmxuTrzyl6qXf9kzjBXNDSjFQAAAh+QQFBAACACwAAAAAFgAWAAACLowNqQvnx+J7kU1X14U5bdQ1XxCOZGeWo/qxm3vBk0yhq93iL83pMw/y1YQYWAEAIfkEBQQAAgAsAAAAABYAFgAAAjCMH6DLgJ9ag0hOaizDWSseeaD3caQziqkGhlZLwqo5Y/H64pLM6hddg5x8P8rQUAAAIfkEBQQAAgAsAAAAABYAFgAAAjCMf6DLgB+ahEg2muzCRm/uKVwUjqEDlqk3klqrrhbMmrU82a8+8zl+8QWBQ8opUAAAOw==\")}.k-progressbar-indeterminate .k-progress-status-wrap,.k-progressbar-indeterminate .k-state-selected{display:none}.k-tabstrip{border-style:solid;border-width:1px;display:block;margin:0;padding:0;position:relative;zoom:1}.k-tabstrip>.k-button{position:absolute;top:.4em;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:2}.k-tabstrip.k-header{border:0}.k-tabstrip-scrollable .k-tabstrip-items{overflow:hidden;white-space:nowrap}.k-tabstrip-items .k-item{border-style:solid;border-width:1px 1px 0;display:inline-block;list-style-type:none;margin:0 -1px 0 0;outline:0;padding:0;position:relative;vertical-align:top}.k-tabstrip-items .k-item .k-link{border-bottom-width:0;display:inline-block;padding:.5em .92em}.k-tabstrip-items .k-item .k-icon{margin:-1px 4px 0 -3px;vertical-align:top}.k-tabstrip-items .k-item .k-image,.k-tabstrip-items .k-item .k-sprite{margin:-3px 3px 0 -6px;vertical-align:middle}.k-tabstrip-items .k-state-active,.k-tabstrip-items .k-tab-on-top{margin-bottom:-1px;padding-bottom:1px}.k-tabstrip-items .k-tab-on-top{z-index:1}.k-tabstrip-prev{left:.4em}.k-tabstrip-next{right:.4em}.k-tabstrip>.k-content{border-style:solid;border-width:1px;display:none;margin:0 .286em .3em;overflow:auto;padding:.3em .92em;position:static;zoom:1}.k-tabstrip>.k-content.k-state-active{display:block}.k-tabstrip-left>.k-content,.k-tabstrip-right>.k-content{margin:.286em .3em}.k-tabstrip-left .k-tabstrip-items .k-item,.k-tabstrip-right .k-tabstrip-items .k-item{display:block;margin-bottom:-1px}.k-tabstrip-left .k-tabstrip-items .k-link,.k-tabstrip-right .k-tabstrip-items .k-link{display:block}.k-tabstrip-left .k-tabstrip-items .k-state-active,.k-tabstrip-left .k-tabstrip-items .k-tab-on-top,.k-tabstrip-right .k-tabstrip-items .k-state-active,.k-tabstrip-right .k-tabstrip-items .k-tab-on-top{margin-bottom:-1px;padding-bottom:0}.k-tabstrip-left>.k-tabstrip-items{float:left;padding:.3em 0 .3em .3em}.k-tabstrip-left>.k-tabstrip-items .k-item,.k-tabstrip-left>.k-tabstrip-items .k-state-active{border-width:1px 0 1px 1px}.k-tabstrip-left>.k-tabstrip-items .k-state-active,.k-tabstrip-left>.k-tabstrip-items .k-tab-on-top{margin-right:-2px;padding-right:1px}.k-tabstrip-right>.k-tabstrip-items{float:right;padding:.3em .3em .3em 0}.k-tabstrip-right>.k-tabstrip-items .k-item,.k-tabstrip-right>.k-tabstrip-items .k-state-active{border-width:1px 1px 1px 0}.k-tabstrip-right>.k-tabstrip-items .k-state-active,.k-tabstrip-right>.k-tabstrip-items .k-tab-on-top{margin-left:-1px;padding-left:1px}.k-tabstrip-bottom>.k-button{bottom:.4em;top:auto}.k-tabstrip-bottom>.k-tabstrip-items{margin-top:-1px;padding:0 .3em .3em}.k-tabstrip-bottom>.k-tabstrip-items .k-item{border-width:0 1px 1px}.k-tabstrip-bottom>.k-tabstrip-items .k-state-active{margin-bottom:0;padding-bottom:0}.k-tabstrip-bottom>.k-content{margin:.3em .286em 0;min-height:100px;position:relative;z-index:1}.k-tabstrip{background-color:transparent}.k-tabstrip .k-item{border-color:transparent;border-radius:2px 2px 0 0}.k-tabstrip .k-item .k-link{color:#ff6358}.k-tabstrip .k-item:hover .k-link{color:#eb5b51}.k-tabstrip .k-item.k-state-active{border-color:rgba(0,0,0,.08)}.k-tabstrip .k-item.k-state-active .k-link{color:#656565}.k-tabstrip .k-item.k-state-disabled .k-link{color:#bababa}.k-tabstrip .k-content{color:#656565;border-color:rgba(0,0,0,.08);border-radius:0 0 2px 2px}.k-tabstrip .k-tabstrip-items .k-state-active,.k-tabstrip>.k-state-active{background-color:#fff}.k-tabstrip.k-tabstrip-right .k-content{border-radius:2px 0 0 2px}.k-tabstrip.k-tabstrip-left .k-content,.k-tabstrip.k-tabstrip-right .k-item{border-radius:0 2px 2px 0}.k-tabstrip.k-tabstrip-left .k-item{border-radius:2px 0 0 2px}.k-tabstrip.k-tabstrip-bottom .k-content{border-radius:2px 2px 0 0}.k-tabstrip.k-tabstrip-bottom .k-item{border-radius:0 0 2px 2px}.k-panelbar{border-style:solid;border-width:1px;display:block}.k-panel>.k-item,.k-panelbar>.k-item{border-radius:0;border-width:0;display:block;list-style-type:none;margin:0}.k-panelbar .k-link>.k-image,.k-panelbar .k-link>.k-sprite{float:left;margin-right:5px;margin-top:4px;vertical-align:middle}.k-panel>.k-item>.k-link,.k-panelbar>.k-item>.k-link{border-bottom-style:solid;border-bottom-width:1px;display:block;line-height:2.34em;padding:0 1em;position:relative;text-decoration:none}.k-panelbar>.k-item>.k-link{padding:.214em 2em .214em .714em}.k-panelbar>.k-item:last-child>.k-link{border-bottom:0}.k-panelbar-collapse,.k-panelbar-expand{margin-top:-.5em;position:absolute;right:.5em;top:50%}.k-panelbar .k-content,.k-panelbar .k-panel{border-bottom-style:solid;border-bottom-width:1px;margin:0;padding:0;position:relative}.k-panel>.k-item>.k-link{border-bottom:0;font-size:.95em;line-height:2.3}.k-panel .k-panel>.k-item>.k-link{padding-left:2em}.k-panel .k-panel,.k-panelbar .k-i-seee .k-link{border-bottom:0}.k-panelbar.k-header,.k-panelbar .k-item,.k-panelbar .k-panel,.k-panelbar>.k-item>.k-link{border-color:rgba(0,0,0,.08)}.k-panelbar .k-state-expanded{background:#f6f6f6}.k-panelbar .k-item>.k-header{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.k-panelbar .k-item .k-link{color:#656565;-webkit-transition:background-color .2s ease;transition:background-color .2s ease}.k-panelbar .k-item .k-link.k-state-selected{background-color:#ff6358;color:#fff}.k-panelbar .k-item .k-link.k-state-selected>.k-icon{color:#fff}.k-panelbar .k-item .k-link.k-state-selected.k-state-focused{box-shadow:inset 0 0 0 2px #eb5b51}.k-panelbar .k-item .k-link.k-state-selected.k-state-focused:hover{box-shadow:inset 0 0 0 2px #db554c}.k-panelbar .k-item .k-link.k-state-selected:hover{color:#fff;background-color:#eb5b51}.k-panelbar .k-item .k-link.k-state-focused{box-shadow:inset 0 0 0 2px #e2e2e2}.k-panelbar .k-item.k-state-disabled>.k-link.k-header{color:#ff6358}.k-panelbar>.k-item>.k-header{color:#ff6358;background-color:#fff}.k-panelbar>.k-item>.k-header:hover{color:#db554c}.k-panelbar .k-panel .k-link:hover{background-color:#ededed}.k-action-buttons{display:-webkit-box;display:-ms-flexbox;display:flex;margin:2.286em 0 -1.143em;padding:1.143em 0;border-top-width:1px;border-top-style:solid}.k-action-buttons .k-button{-webkit-box-flex:1;-ms-flex:1;flex:1;font-size:1em;margin:-1.143em 0;padding:1.143em 0;line-height:1.2em;border-radius:0}.k-action-buttons .k-button:before{content:'';display:block;position:absolute;top:0;left:0;width:1px;height:100%}.k-action-buttons .k-button:first-child:before{display:none}.k-action-buttons:after{display:block;content:'';clear:both}.k-action-buttons{border-top-color:rgba(0,0,0,.08)}.k-action-buttons .k-button{position:relative;background-color:#fff;background-image:none;border-radius:0;border:0}.k-action-buttons .k-button:hover{background-color:#ededed}.k-action-buttons .k-button:focus{box-shadow:inset 0 0 0 2px rgba(0,0,0,.1)}.k-action-buttons .k-button:active{background-image:-webkit-linear-gradient(#f1f1f1,#f6f6f6);background-image:linear-gradient(#f1f1f1,#f6f6f6);box-shadow:inset 0 3px 5px #e8e8e8}.k-action-buttons .k-button:before{background-color:rgba(0,0,0,.08)}.k-action-buttons .k-primary{color:#ff6358}.k-action-buttons .k-primary:hover{color:#fff;background-color:#ff6358}.k-action-buttons .k-primary:hover:before{background-color:#ff6358}.k-action-buttons .k-primary:focus{box-shadow:inset 0 0 0 2px #ffd1cd}.k-action-buttons .k-primary:focus:hover{box-shadow:inset 0 0 0 2px rgba(0,0,0,.08)}.k-action-buttons .k-primary:active{background-image:-webkit-linear-gradient(#fc655b,#ff6b58);background-image:linear-gradient(#fc655b,#ff6b58)}.k-window{border-width:0;display:inline-block;padding-top:2.667em;position:absolute;z-index:10001;min-width:450px;max-width:100%}.k-window.k-window-titleless{padding-top:0}.k-window-titlebar{font-size:1.286em;display:block;height:2.667em;margin-top:-2.667em;min-height:1em;width:100%}.k-window-titlebar,.k-window-titlebar .k-window-actions{line-height:2.667em;position:absolute;white-space:nowrap}.k-window-titlebar .k-window-actions{right:0;top:0}.k-window-titlebar .k-window-action{cursor:pointer;display:inline-block;border:0;text-decoration:none;text-align:center;vertical-align:middle;box-sizing:border-box;padding:0;width:2.667em;line-height:inherit}.k-window-titlebar .k-window-action .k-icon{margin:0;vertical-align:middle}.k-window-titlebar .k-window-action:focus .k-icon,.k-window-titlebar .k-window-action:hover .k-icon{font-size:23.33333px}.k-window-title{cursor:default;left:.865em;overflow:hidden;position:absolute;right:1.143em;text-overflow:ellipsis}.k-window-title .k-image{margin:0 5px 0 0;vertical-align:middle}.k-window-content{height:100%;outline:0;overflow:auto;padding:1.143em;position:relative}.k-window-iframecontent{overflow:visible;padding:0}.k-window>.k-resize-handle{background-color:#fff;filter:alpha(opacity=0);font-size:0;line-height:6px;opacity:0;position:absolute;z-index:1;zoom:1}.k-resize-n{cursor:n-resize;height:6px;left:0;top:-3px;width:100%}.k-resize-e{cursor:e-resize;height:100%;right:-3px;top:0;width:6px}.k-resize-s{bottom:-3px;cursor:s-resize;height:6px;left:0;width:100%}.k-resize-w{cursor:w-resize;height:100%;left:-3px;top:0;width:6px}.k-resize-se{bottom:-3px;cursor:se-resize;height:1em;right:-3px;width:1em}.k-resize-sw{bottom:-3px;cursor:sw-resize;height:6px;left:-3px;width:6px}.k-resize-ne{cursor:ne-resize;right:-3px}.k-resize-ne,.k-resize-nw{height:6px;top:-3px;width:6px}.k-resize-nw{cursor:nw-resize;left:-3px}.k-dialog-wrapper,.k-dialog-wrapper>.k-animation-container,.k-dialog-wrapper>.k-animation-container>div,.k-overlay{top:0;left:0;position:fixed;height:100%;width:100%}.k-dialog-wrapper>.k-animation-container,.k-overlay{z-index:10001}.k-overlay{background-color:#000;opacity:.5}.k-window .k-overlay{background-color:#fff;height:100%;opacity:0;position:absolute;width:100%}.k-window{border-color:rgba(0,0,0,.08);box-shadow:0 3px 3px 0 rgba(0,0,0,.06)}.k-window>.k-header{color:#fff;background-color:#ff6358}.k-window>.k-header .k-window-action{color:inherit;background:transparent}.k-window.k-state-focused{box-shadow:1px 1px 7px 1px rgba(0,0,0,.3)}.k-window .k-window-action:active{box-shadow:none}.k-window-content{overflow:hidden}.k-grid{display:block;position:relative;border-width:1px;border-style:solid}.k-grid table{width:100%;margin:0;max-width:none;border-collapse:separate;border-spacing:0;empty-cells:show;border-width:0;outline:none}.k-grid-toolbar{display:block;padding:1em;border-width:0 0 1px;border-style:solid}.k-grid-header{border-bottom-style:solid;border-bottom-width:1px}.k-grid-header th>.k-link>.k-icon{vertical-align:text-bottom}.k-grid-footer{border-width:1px 0 0;border-style:solid}.k-grid-content-locked>table,.k-grid-content table,.k-grid-footer table,.k-grid-header table{table-layout:fixed}.k-grid-virtual .k-grid-content>table{position:absolute;z-index:1}.k-grid-virtual .k-grid-content>.k-height-container{position:relative}.k-filter-row th,.k-grid-header th.k-header{overflow:hidden;border-style:solid;border-width:0 0 0 1px;padding:1em;font-weight:400;white-space:nowrap;text-overflow:ellipsis;text-align:left;line-height:1.286em}.k-grid-header th.k-header>.k-link{display:block;line-height:1.286em;padding:1em;margin:-1em;overflow:hidden;text-overflow:ellipsis}.k-grid-content{position:relative;overflow:auto;overflow-x:auto;overflow-y:scroll;min-height:0}.k-grid td{border-style:solid;border-width:0 0 0 1px;padding:.5em 1em;overflow:hidden;line-height:1.6em;vertical-align:middle;text-overflow:ellipsis}.k-grid-header th.k-header:first-child,.k-grid tbody td:first-child,.k-grid tfoot td:first-child{border-left-width:0}.k-grid-content tr:last-child td{border-bottom-width:0}.k-grid-footer-wrap,.k-grid-header-wrap{position:relative;width:100%;overflow:hidden;border-style:solid;border-width:0 1px 0 0;box-sizing:content-box}.k-grid .k-group-col,.k-grid .k-hierarchy-col{width:30px}td.k-hierarchy-cell{text-align:center;padding:0}td.k-hierarchy-cell>.k-icon{width:100%;display:inline-block;padding:.5em 0;line-height:1.6em;outline:0}.k-grid-content-locked,.k-grid-footer-locked,.k-grid-header-locked{display:inline-block;vertical-align:top;overflow:hidden;position:relative;border-style:solid;border-width:0 1px 0 0}.k-grid-content-locked+.k-grid-content,.k-grid-footer-locked+.k-grid-footer-wrap,.k-grid-header-locked+.k-grid-header-wrap,.k-grid .k-pager-numbers,.k-pager-numbers .k-link,.k-pager-numbers .k-state-selected{display:inline-block;vertical-align:top}.k-pager-wrap{display:block;clear:both;overflow:hidden;position:relative;border-style:solid;border-width:1px 0 0;line-height:2.143em;padding:.571em;border-radius:0}.k-pager-numbers .k-current-page{display:none}.k-pager-input,.k-pager-numbers li{float:left}.k-grid .k-pager-numbers{float:left;cursor:default}.k-pager-info{float:right}.k-pager-numbers .k-link{text-decoration:none}.k-pager-numbers .k-link,.k-pager-numbers .k-state-selected,.k-pager-wrap>.k-link{min-width:2.143em}.k-pager-wrap>.k-link{float:left;height:2.143em;line-height:2.143em;cursor:pointer;text-align:center}.k-pager-wrap>a.k-state-disabled:hover{background:none;cursor:default}.k-pager-numbers .k-link{text-align:center;line-height:2.143em}.k-pager-wrap .k-pager-refresh{float:right;margin-right:.5em;border-width:0;border-radius:0}.k-pager-numbers .k-state-selected{text-align:center}.k-pager-wrap .k-textbox{width:3.333em;height:2.143em;padding:0;text-indent:.5em}.k-pager-wrap .k-dropdown{width:4.5em}.k-pager-refresh{float:right}.k-pager-input,.k-pager-sizes{padding:0 1.4166em}.k-pager-sizes{display:inline-block}.k-pager-sizes .k-widget.k-dropdown{margin-top:-2px}.k-pager-wrap .k-textbox,.k-pager-wrap .k-widget{margin:0 .4em}.k-grid-content-locked,.k-grid-footer,.k-grid-footer-locked,.k-grid-footer-wrap,.k-grid-header,.k-grid-header-locked,.k-grid-header-wrap,.k-grid td{border-color:rgba(0,0,0,.08)}.k-grid-footer,.k-grid-header,.k-grid .k-alt,.k-pager-wrap{background-color:#f6f6f6}.k-grid tr.k-state-selected{background-color:#ff6358;color:#fff}.k-grid tr.k-state-selected .k-hierarchy-cell>.k-icon{color:#fff}.k-grid-pager .k-link,.k-grid-pager .k-link:link{color:#ff6358;-webkit-transition:background-color .2s ease;transition:background-color .2s ease}.k-grid-pager .k-link:focus,.k-grid-pager .k-link:link:focus{box-shadow:inset 0 0 0 2px #e2e2e2}.k-grid-pager .k-link:hover,.k-grid-pager .k-link:link:hover{background-color:#ededed}.k-grid-pager .k-link.k-state-selected,.k-grid-pager .k-link:link.k-state-selected{color:#fff}.k-grid-pager .k-link.k-state-selected:focus,.k-grid-pager .k-link:link.k-state-selected:focus{box-shadow:inset 0 0 0 2px #eb5b51}.k-grid-pager .k-link.k-state-selected:hover,.k-grid-pager .k-link:link.k-state-selected:hover{background-color:#eb5b51}.k-grid-pager .k-link.k-state-disabled,.k-grid-pager .k-link:link.k-state-disabled{box-shadow:none;background-color:transparent}.k-var--chart-font{font-size:14px}.k-var--chart-title-font{font-size:1.143em}.k-var--chart-label-font{font-size:.857em}.k-chart,.k-sparkline,.k-stockchart{-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}.k-chart,.k-stockchart{font-size:14px;font-family:inherit;display:block;height:400px}.k-chart-surface{height:100%}.k-chart-tooltip table{border-spacing:0;border-collapse:collapse}.k-chart-tooltip{font-size:.929em;line-height:1.154em;padding:.308em .692em}.k-chart-tooltip th{width:auto;text-align:center;padding:1px}.k-chart-tooltip td{width:auto;text-align:left;padding:.1em .308em;line-height:1.538em;vertical-align:middle}.k-chart-crosshair-tooltip,.k-chart-shared-tooltip{border-width:1px;border-style:solid}.k-chart-shared-tooltip{padding:1em;line-height:1.538em}.k-chart-shared-tooltip-marker{display:block;width:15px;height:3px;vertical-align:middle}.k-selector{position:absolute;-webkit-transform:translateZ(0)}.k-selection{border-width:1px;border-style:solid;border-bottom:0}.k-selection,.k-selection-bg{position:absolute;height:100%}.k-selection-bg{width:100%}.k-handle{width:22px;height:22px;border-width:1px;border-style:solid;z-index:1;border-radius:50%;position:absolute}.k-handle div{width:100%;height:100%}.k-leftHandle{left:-11px}.k-rightHandle{right:-11px}.k-leftHandle div{margin:-20px 0 0 -15px;padding:40px 30px 0 0}.k-leftHandle.k-handle-active div{margin-left:-40px;padding-right:55px}.k-rightHandle div{margin:-20px 0 0 -15px;padding:40px 0 0 30px}.k-rightHandle.k-handle-active div{padding-left:55px}.k-border,.k-mask{position:absolute;height:100%}.k-border{width:1px}.k-marquee{position:absolute;z-index:100000}.k-marquee-color,.k-marquee-text{position:absolute;top:0;left:0;width:100%;height:100%}.k-navigator-hint div{position:absolute}.k-navigator-hint .k-scroll{position:absolute;height:4px}.k-navigator-hint .k-tooltip{margin-top:20px;min-width:160px;opacity:1;text-align:center}.k-sparkline,.k-sparkline span{display:inline-block;vertical-align:top}.k-sparkline span{height:100%;width:100%}.k-chart-dragging{user-select:none;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}.k-var--chart-inactive{background-color:#d2d2d2}.k-var--chart-major-lines,.k-var--chart-minor-lines{background-color:rgba(0,0,0,.08)}.k-var--chart-area-opacity{opacity:.8}.k-var--chart-crosshair-background,.k-var--chart-error-bars-background,.k-var--chart-notes-background,.k-var--chart-notes-border,.k-var--chart-notes-lines{background-color:rgba(0,0,0,.5)}.k-chart,.k-sparkline,.k-stockchart{background-color:transparent}.k-chart-tooltip{color:#fff;border-radius:2px}.k-chart-tooltip-inverse{color:#000}.k-chart-crosshair-tooltip,.k-chart-shared-tooltip{color:#656565;background-color:#f6f6f6;border-color:rgba(0,0,0,.08)}.k-selection{border-color:rgba(0,0,0,.08);box-shadow:inset 0 1px 7px rgba(0,0,0,.15)}.k-selection-bg{background-color:transparent}.k-handle{background-color:#fff;background-image:-webkit-linear-gradient(#f6f6f6,#f1f1f1);background-image:linear-gradient(#f6f6f6,#f1f1f1);cursor:e-resize;border-color:rgba(0,0,0,.08)}.k-handle div{background-color:hsla(0,0%,100%,.01)}.k-mask{background-color:#fff;opacity:.8}.k-border{background:#d2d2d2}.k-marquee-color{background-color:#ff6358;opacity:.6}.k-navigator-hint .k-scroll{border-radius:2px;background:#d2d2d2}.k-navigator-hint .k-tooltip{border:0;background:#fff}html .k-upload{position:relative}.k-upload{border-width:1px;border-style:solid}.k-upload .k-action-buttons{margin:-6px 0 0}.k-dropzone em,.k-upload-button{vertical-align:middle}.k-dropzone,.k-file{position:relative}.k-dropzone{border-style:solid;border-width:0;padding:.8em;background-color:transparent}.k-dropzone em{visibility:hidden;margin-left:.6em}.k-dropzone-active em{visibility:visible}.k-upload-button{position:relative;overflow:hidden;direction:ltr}.k-upload .k-upload-button{min-width:7.167em}.k-ie8 .k-upload-button,.k-ie9 .k-upload-button,.k-upload-sync .k-upload-button{margin:.8em}.k-upload-button input{position:absolute;bottom:0;right:0;z-index:1;font:170px monospace!important;filter:alpha(opacity=0);opacity:0;margin:0;padding:0;cursor:pointer}.k-upload-files{line-height:2.66;border-style:solid;border-width:1px 0 0;margin:0;padding:0 0 5px}.k-upload-status .k-warning{display:none}.k-upload-status-total .k-icon{display:inline-block;margin-right:4px}.k-dropzone .k-upload-status-total{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.k-upload .k-fail{background-position:-161px -111px}.k-file{border-style:solid;border-width:0 0 1px;padding:.65em .17em .65em 1em;list-style:none}.k-file .k-icon{position:relative}.k-file-extension-wrapper,.k-file-invalid-extension-wrapper,.k-file-name-size-wrapper,.k-multiple-files-extension-wrapper,.k-multiple-files-invalid-extension-wrapper{display:inline-block}.k-file-extension-wrapper,.k-file-invalid-extension-wrapper,.k-multiple-files-extension-wrapper,.k-multiple-files-invalid-extension-wrapper{position:relative;width:28px;height:38px;border-width:2px;border-style:solid;vertical-align:top;font-size:.57em;text-transform:uppercase}.k-file-invalid-extension-wrapper,.k-multiple-files-invalid-extension-wrapper{font-size:1.2em}.k-multiple-files-extension-wrapper,.k-multiple-files-invalid-extension-wrapper{margin-top:4px}.k-file-state{visibility:hidden}.k-file-name-size-wrapper{vertical-align:middle;margin-left:1em}.k-file-extension-wrapper:before,.k-file-invalid-extension-wrapper:before,.k-multiple-files-extension-wrapper:after,.k-multiple-files-extension-wrapper:before,.k-multiple-files-invalid-extension-wrapper:after,.k-multiple-files-invalid-extension-wrapper:before{position:absolute;content:'';display:inline-block;border-style:solid}.k-file-extension-wrapper:before,.k-file-invalid-extension-wrapper:before,.k-multiple-files-extension-wrapper:before,.k-multiple-files-invalid-extension-wrapper:before{top:-1px;right:-1px;width:0;height:0;border-width:6px;margin-top:-1px;margin-right:-1px}.k-multiple-files-extension-wrapper:after,.k-multiple-files-invalid-extension-wrapper:after{top:-6px;left:-6px;width:15px;height:35px;border-width:2px 0 0 2px}.k-file-extension,.k-file-invalid-icon{position:absolute;bottom:0;line-height:normal}.k-file-extension{margin-left:.4em;margin-bottom:.3em;overflow:hidden;text-overflow:ellipsis;max-width:100%}.k-file-invalid-icon{margin-left:5px}.k-file-information,.k-file-name,.k-file-size,.k-file-validation-message{display:block}.k-file-name{position:relative;min-width:10em;max-width:16.667em;vertical-align:middle;line-height:1.2em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.k-file-information,.k-file-size,.k-file-validation-message{font-size:.78em;line-height:1.5em}.k-file-information,.k-file-validation-message{line-height:1.5em}.k-file-size{line-height:1.2em}.k-upload-status{position:absolute;right:10px;top:0}.k-upload-status .k-button{vertical-align:text-bottom}.k-dropzone .k-upload-status{line-height:2.4}.k-upload-pct{margin-right:.75em}.k-ie8 .k-upload-status-total{line-height:29px}.k-ie8 .k-upload-status-total,.k-ie9 .k-upload-status-total{top:1.5em}.k-ie8 .k-upload-status-total>.k-icon,.k-ie9 .k-upload-status-total>.k-icon{margin-top:-3px}.k-upload-action{line-height:normal}.k-progress{position:absolute;bottom:0;left:0;height:2px}.k-file-invalid>.k-progress{width:100%}.k-rtl .k-file-extension-wrapper{margin-left:14px}.k-upload{border-radius:2px}.k-upload,.k-upload .k-file,.k-upload .k-upload-files{border-color:rgba(0,0,0,.08)}.k-upload .k-file{background-color:#fff}.k-upload .k-file-progress{color:#656565}.k-upload .k-file-progress .k-progress{background-color:#0058e9}.k-upload .k-file-success{color:#37b400}.k-upload .k-file-success .k-progress{background-color:#37b400}.k-upload .k-file-error{color:#f31700}.k-upload .k-file-error .k-progress,.k-upload .k-file-invalid .k-progress{background-color:#f31700}.k-upload .k-file-extension-wrapper,.k-upload .k-multiple-files-extension-wrapper{color:#bababa;border-color:#bababa}.k-upload .k-file-invalid .k-file-name-invalid{color:#f31700}.k-upload .k-file-invalid-extension-wrapper,.k-upload .k-multiple-files-invalid-extension-wrapper{color:#f31700;border-color:#ff9388}.k-upload .k-file-extension-wrapper:before,.k-upload .k-multiple-files-extension-wrapper:before{background-color:#fff;border-color:transparent transparent #bababa #bababa}.k-upload .k-file-invalid-extension-wrapper:before,.k-upload .k-multiple-files-invalid-extension-wrapper:before{background-color:#fff;border-color:transparent transparent #ff9388 #ff9388}.k-upload .k-multiple-files-extension-wrapper:after{border-top-color:#bababa;border-left-color:#bababa}.k-upload .k-multiple-files-invalid-extension-wrapper:after{border-top-color:#ff9388;border-left-color:#ff9388}.k-upload .k-file-information,.k-upload .k-file-size,.k-upload .k-file-validation-message{color:#bababa}.k-scrollview-wrap{position:relative;overflow:hidden;outline:0;display:block}.k-scrollview{list-style-type:none;position:absolute;margin:0;padding:0;width:100%;height:100%;cursor:default}.k-scrollview img,.k-scrollview li{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.k-scrollview>li{display:inline-block;overflow:hidden;position:absolute;top:0;left:0}.k-scrollview li>*{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none;-khtml-user-drag:none;pointer-events:none}.k-scrollview-pageable{position:absolute;padding:0;width:100%;left:0;bottom:10px;margin:0 auto;text-align:center;list-style:none;pointer-events:none}.k-scrollview-pageable>li.k-button{box-sizing:content-box;vertical-align:middle;display:inline-block;border-radius:50%;padding:0;margin:10px;width:8px;height:8px;cursor:pointer;pointer-events:all}.k-scrollview-next,.k-scrollview-prev{display:table;position:absolute;padding:0;height:60%;top:20%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none;-khtml-user-drag:none;cursor:pointer;overflow:hidden}.k-scrollview-prev{left:0}.k-scrollview-next{right:0}.k-scrollview-next span,.k-scrollview-prev span{display:table-cell;margin:0;padding:0;vertical-align:middle;font-size:4.5em;font-weight:400}.k-scrollview-elements{width:100%}@supports (-webkit-user-select:none){div.k-scrollview-wrap ul.k-scrollview li>*{pointer-events:auto}}@supports not (-webkit-user-select:none){div.k-scrollview-wrap ul.k-scrollview li>*{pointer-events:none}}.k-scrollview-pageable>li.k-button{background-image:none;box-shadow:0 0 2px rgba(0,0,0,.08)}.k-scrollview-next,.k-scrollview-prev{background:transparent;outline-width:0;-webkit-tap-highlight-color:transparent}.k-scrollview-next span,.k-scrollview-prev span{text-shadow:rgba(0,0,0,.3) 0 0 15px;color:#fff;opacity:.7}.k-scrollview-next:hover span,.k-scrollview-prev:hover span{color:#fff;opacity:1}.k-scrollview-next .k-icon:focus,.k-scrollview-prev .k-icon:focus{color:#fff}.k-scrollview-animation{-webkit-transition-duration:.3s;transition-duration:.3s;-webkit-transition-timing-function:ease-out;transition-timing-function:ease-out}", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(27);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(56);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(30),
  Html4Entities: __webpack_require__(29),
  Html5Entities: __webpack_require__(4),
  AllHtmlEntities: __webpack_require__(4)
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-inverse navbar-fixed-top\">\r\n    <div class=\"container\">\r\n        <nav-bar></nav-bar>\r\n    </div>\r\n</nav>\r\n\r\n<br />\r\n\r\n<div class=\"container\">\r\n\r\n    <div class=\"jumbotron\">\r\n\r\n        <router-outlet></router-outlet>\r\n    </div>\r\n\r\n</div>\r\n\r\n";

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<h1>{{title}}</h1>\r\n\r\n\r\n<form #userform=\"ngForm\" class=\"form-horizontal\" (ngSubmit)=\"save(userform.value)\">\r\n\r\n    <div class=\"form-group\">\r\n        <label class=\"control-label col-sm-2\" [for]=\"name\">Name:</label>\r\n        <div class=\"col-sm-10\">\r\n            <input type=\"text\" name=\"Name\" validateRequired [(ngModel)]=\"userIndo.Name\" #Name=\"ngModel\" class=\"k-textbox\">\r\n            <common-validation-message [control]=\"Name\"></common-validation-message>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n        <label class=\"control-label col-sm-2\" [for]=\"dob\">Date of Birth:</label>\r\n        <div class=\"col-sm-10\">\r\n            <kendo-dateinput #DoB=\"ngModel\" validateRequired name=\"DoB\" [(ngModel)]=\"userIndo.DoB\"></kendo-dateinput>\r\n            <common-validation-message [control]=\"DoB\"></common-validation-message>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n        <label class=\"control-label col-sm-2\" [for]=\"gender\">Gender:</label>\r\n        <div class=\"col-sm-10\">\r\n            <kendo-dropdownlist name=\"Gender\"  #Gender=\"ngModel\" [(ngModel)]=\"userIndo.Gender\"  [data]=\"genderItems\"> </kendo-dropdownlist>\r\n            <common-validation-message [control]=\"Gender\"></common-validation-message>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n        <label class=\"control-label col-sm-2\" [for]=\"age\">Age:</label>\r\n        <div class=\"col-sm-10\">\r\n            <kendo-slider #Age=\"ngModel\"\r\n                          name=\"Age\"\r\n                          [(ngModel)]=\"userIndo.Age\"\r\n                          [min]=\"min\"\r\n                          [max]=\"max\"\r\n                          [smallStep]=\"smallStep\"></kendo-slider>\r\n            <span>(Age = {{Age.value}}) Better use numeric box :)</span>\r\n        </div>\r\n    </div>\r\n  \r\n\r\n    <button kendoButton  [disabled]=\"!userform.valid\" [primary]=\"true\" class=\"pull-right\" type=\"submit\">Submit</button>\r\n\r\n</form>\r\n\r\n\r\n<section>\r\n\r\n    <ul>\r\n        <li *ngFor=\"let user of userList\">\r\n            {{ user.Name }}\r\n        </li>\r\n    </ul>\r\n\r\n</section>";

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<h1>{{title}}</h1>\r\n\r\n\r\n<form class=\"form-horizontal\" [formGroup]=\"userDetailForm\" (ngSubmit)=\"save()\"  novalidate>\r\n\r\n    <div class=\"form-group\">\r\n        <div class=\"col-sm-12\">\r\n            <md-input-container>\r\n                <input mdInput placeholder=\"Name\" formControlName=\"Name\">\r\n            </md-input-container>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"form-group\">\r\n        <div class=\"col-sm-12\">\r\n            <md-input-container>\r\n                <input mdInput [mdDatepicker]=\"picker\" placeholder=\"Date of Birth\" formControlName=\"DoB\">\r\n                <button mdSuffix [mdDatepickerToggle]=\"picker\"></button>\r\n            </md-input-container>\r\n            <md-datepicker #picker></md-datepicker>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n        <div class=\"col-sm-12\">\r\n            <md-select placeholder=\"Gender\" formControlName=\"Gender\">\r\n                <md-option *ngFor=\"let item of genderItems\" [value]=\"item.value\">\r\n                    {{ item.viewValue }}\r\n                </md-option>\r\n            </md-select>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <div class=\"form-group\">\r\n        <div class=\"col-sm-12\">\r\n            <md-slider min=\"18\" max=\"99\" step=\"1\" formControlName=\"Age\"></md-slider>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <button md-raised-button class=\"pull-right\" type=\"submit\"  [disabled]=\"userDetailForm.pristine\">Submit</button>\r\n\r\n</form>\r\n\r\n\r\n<section>\r\n\r\n    <ul>\r\n        <li *ngFor=\"let user of userList\">\r\n            {{ user.Name }}\r\n        </li>\r\n    </ul>\r\n\r\n</section>";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<div class=\"navbar-header\">\r\n    <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\r\n        <span class=\"sr-only\">Toggle navigation</span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n    </button>\r\n    <a class=\"navbar-brand\" href=\"#\">Angular4-Asp.NetCore</a>\r\n</div>\r\n<div id=\"navbar\" class=\"navbar-collapse collapse\" aria-expanded=\"false\" style=\"height: 1px;\">\r\n    <ul class=\"nav navbar-nav\">\r\n        <li><a routerLink=\"/kendo\" routerLinkActive=\"active\">Kendo</a></li>\r\n        <li><a routerLink=\"/material\" routerLinkActive=\"active\">ng2-material</a></li>\r\n        <li><a routerLink=\"/kendo\" routerLinkActive=\"active\">ASP.NET Core SignalR</a></li>\r\n    </ul>\r\n</div><!--/.nav-collapse -->";

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "404: Not Found";

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<div #group *ngIf=\"controlInput.errors && (controlInput.dirty || controlInput.touched)\" class=\"text-danger\">\r\n    <label style=\"font-weight:normal\" *ngIf=\"controlInput.errors.required\">Required</label>\r\n</div>";

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(37);
exports.encode = exports.stringify = __webpack_require__(38);


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(58), __webpack_require__(2)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(13)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(24);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(25);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(12);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(28).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(121);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(269);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(270);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(271);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(272);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(273);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(274);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(275);

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(276);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(282);

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(283);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(72);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(9);
__webpack_require__(8);
module.exports = __webpack_require__(7);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map