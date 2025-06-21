"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const auth_1 = __importDefault(require("./routes/auth"));
const store_1 = __importDefault(require("./routes/store"));
const bank_1 = __importDefault(require("./routes/bank"));
const campaign_1 = __importDefault(require("./routes/campaign"));
const upload_1 = __importDefault(require("./routes/upload"));
const category_1 = __importDefault(require("./routes/category"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = parseInt(process.env.PORT || '5008');
app.get('/', (req, res) => {
    res.send('API Çalışıyor!');
});
app.use('/api/auth', auth_1.default);
app.use('/api/store', store_1.default);
app.use('/api/bank', bank_1.default);
app.use('/api/campaign', campaign_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/category', category_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Sunucu ${PORT} portunda çalışıyor.`);
        console.log(`Mobil uygulama için: http://192.168.111.5:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Veritabanı bağlantı hatası:', error);
});
