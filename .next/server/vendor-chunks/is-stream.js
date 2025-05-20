"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-stream";
exports.ids = ["vendor-chunks/is-stream"];
exports.modules = {

/***/ "(action-browser)/./node_modules/is-stream/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-stream/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\nconst isStream = (stream)=>stream !== null && typeof stream === \"object\" && typeof stream.pipe === \"function\";\nisStream.writable = (stream)=>isStream(stream) && stream.writable !== false && typeof stream._write === \"function\" && typeof stream._writableState === \"object\";\nisStream.readable = (stream)=>isStream(stream) && stream.readable !== false && typeof stream._read === \"function\" && typeof stream._readableState === \"object\";\nisStream.duplex = (stream)=>isStream.writable(stream) && isStream.readable(stream);\nisStream.transform = (stream)=>isStream.duplex(stream) && typeof stream._transform === \"function\";\nmodule.exports = isStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9pcy1zdHJlYW0vaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQSxNQUFNQSxXQUFXQyxDQUFBQSxTQUNoQkEsV0FBVyxRQUNYLE9BQU9BLFdBQVcsWUFDbEIsT0FBT0EsT0FBT0MsSUFBSSxLQUFLO0FBRXhCRixTQUFTRyxRQUFRLEdBQUdGLENBQUFBLFNBQ25CRCxTQUFTQyxXQUNUQSxPQUFPRSxRQUFRLEtBQUssU0FDcEIsT0FBT0YsT0FBT0csTUFBTSxLQUFLLGNBQ3pCLE9BQU9ILE9BQU9JLGNBQWMsS0FBSztBQUVsQ0wsU0FBU00sUUFBUSxHQUFHTCxDQUFBQSxTQUNuQkQsU0FBU0MsV0FDVEEsT0FBT0ssUUFBUSxLQUFLLFNBQ3BCLE9BQU9MLE9BQU9NLEtBQUssS0FBSyxjQUN4QixPQUFPTixPQUFPTyxjQUFjLEtBQUs7QUFFbENSLFNBQVNTLE1BQU0sR0FBR1IsQ0FBQUEsU0FDakJELFNBQVNHLFFBQVEsQ0FBQ0YsV0FDbEJELFNBQVNNLFFBQVEsQ0FBQ0w7QUFFbkJELFNBQVNVLFNBQVMsR0FBR1QsQ0FBQUEsU0FDcEJELFNBQVNTLE1BQU0sQ0FBQ1IsV0FDaEIsT0FBT0EsT0FBT1UsVUFBVSxLQUFLO0FBRTlCQyxPQUFPQyxPQUFPLEdBQUdiIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vam9iLWNvc3RpbmctdG9vbC8uL25vZGVfbW9kdWxlcy9pcy1zdHJlYW0vaW5kZXguanM/MTlkOCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGlzU3RyZWFtID0gc3RyZWFtID0+XG5cdHN0cmVhbSAhPT0gbnVsbCAmJlxuXHR0eXBlb2Ygc3RyZWFtID09PSAnb2JqZWN0JyAmJlxuXHR0eXBlb2Ygc3RyZWFtLnBpcGUgPT09ICdmdW5jdGlvbic7XG5cbmlzU3RyZWFtLndyaXRhYmxlID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtKHN0cmVhbSkgJiZcblx0c3RyZWFtLndyaXRhYmxlICE9PSBmYWxzZSAmJlxuXHR0eXBlb2Ygc3RyZWFtLl93cml0ZSA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHR0eXBlb2Ygc3RyZWFtLl93cml0YWJsZVN0YXRlID09PSAnb2JqZWN0JztcblxuaXNTdHJlYW0ucmVhZGFibGUgPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0oc3RyZWFtKSAmJlxuXHRzdHJlYW0ucmVhZGFibGUgIT09IGZhbHNlICYmXG5cdHR5cGVvZiBzdHJlYW0uX3JlYWQgPT09ICdmdW5jdGlvbicgJiZcblx0dHlwZW9mIHN0cmVhbS5fcmVhZGFibGVTdGF0ZSA9PT0gJ29iamVjdCc7XG5cbmlzU3RyZWFtLmR1cGxleCA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbS53cml0YWJsZShzdHJlYW0pICYmXG5cdGlzU3RyZWFtLnJlYWRhYmxlKHN0cmVhbSk7XG5cbmlzU3RyZWFtLnRyYW5zZm9ybSA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbS5kdXBsZXgoc3RyZWFtKSAmJlxuXHR0eXBlb2Ygc3RyZWFtLl90cmFuc2Zvcm0gPT09ICdmdW5jdGlvbic7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJlYW07XG4iXSwibmFtZXMiOlsiaXNTdHJlYW0iLCJzdHJlYW0iLCJwaXBlIiwid3JpdGFibGUiLCJfd3JpdGUiLCJfd3JpdGFibGVTdGF0ZSIsInJlYWRhYmxlIiwiX3JlYWQiLCJfcmVhZGFibGVTdGF0ZSIsImR1cGxleCIsInRyYW5zZm9ybSIsIl90cmFuc2Zvcm0iLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/is-stream/index.js\n");

/***/ })

};
;