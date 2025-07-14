"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccountKey_json_1 = __importDefault(require("../serviceAccountKey.json"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccountKey_json_1.default),
    });
}
const auth = firebase_admin_1.default.auth();
exports.auth = auth;
const db = firebase_admin_1.default.firestore();
exports.db = db;
//# sourceMappingURL=firebase.js.map