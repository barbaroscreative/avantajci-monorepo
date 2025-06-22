"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var static_style_extract_1 = require("@ant-design/static-style-extract");
var outputPath = './public/antd.min.css';
// Create public directory if it doesn't exist
if (!fs_1.default.existsSync('./public')) {
    fs_1.default.mkdirSync('./public');
}
var css = (0, static_style_extract_1.extractStyle)();
fs_1.default.writeFileSync(outputPath, css);
console.log("Ant Design CSS extracted to ".concat(outputPath));
