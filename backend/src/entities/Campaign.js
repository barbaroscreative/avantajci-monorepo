"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Campaign = void 0;
const typeorm_1 = require("typeorm");
const Store_1 = require("./Store");
const Bank_1 = require("./Bank");
let Campaign = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _stores_decorators;
    let _stores_initializers = [];
    let _stores_extraInitializers = [];
    let _bank_decorators;
    let _bank_initializers = [];
    let _bank_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _imageUrl_decorators;
    let _imageUrl_initializers = [];
    let _imageUrl_extraInitializers = [];
    let _rewardAmount_decorators;
    let _rewardAmount_initializers = [];
    let _rewardAmount_extraInitializers = [];
    let _rewardType_decorators;
    let _rewardType_initializers = [];
    let _rewardType_extraInitializers = [];
    var Campaign = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.category = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.stores = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _stores_initializers, void 0));
            this.bank = (__runInitializers(this, _stores_extraInitializers), __runInitializers(this, _bank_initializers, void 0));
            this.createdAt = (__runInitializers(this, _bank_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.isActive = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            this.rewardAmount = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _rewardAmount_initializers, void 0));
            this.rewardType = (__runInitializers(this, _rewardAmount_extraInitializers), __runInitializers(this, _rewardType_initializers, void 0));
            __runInitializers(this, _rewardType_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Campaign");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _title_decorators = [(0, typeorm_1.Column)()];
        _description_decorators = [(0, typeorm_1.Column)('text')];
        _startDate_decorators = [(0, typeorm_1.Column)()];
        _endDate_decorators = [(0, typeorm_1.Column)()];
        _category_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _stores_decorators = [(0, typeorm_1.ManyToMany)(() => Store_1.Store, { eager: true }), (0, typeorm_1.JoinTable)()];
        _bank_decorators = [(0, typeorm_1.ManyToOne)(() => Bank_1.Bank, { eager: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _isActive_decorators = [(0, typeorm_1.Column)({ default: true })];
        _imageUrl_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _rewardAmount_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _rewardType_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _stores_decorators, { kind: "field", name: "stores", static: false, private: false, access: { has: obj => "stores" in obj, get: obj => obj.stores, set: (obj, value) => { obj.stores = value; } }, metadata: _metadata }, _stores_initializers, _stores_extraInitializers);
        __esDecorate(null, null, _bank_decorators, { kind: "field", name: "bank", static: false, private: false, access: { has: obj => "bank" in obj, get: obj => obj.bank, set: (obj, value) => { obj.bank = value; } }, metadata: _metadata }, _bank_initializers, _bank_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: obj => "imageUrl" in obj, get: obj => obj.imageUrl, set: (obj, value) => { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, null, _rewardAmount_decorators, { kind: "field", name: "rewardAmount", static: false, private: false, access: { has: obj => "rewardAmount" in obj, get: obj => obj.rewardAmount, set: (obj, value) => { obj.rewardAmount = value; } }, metadata: _metadata }, _rewardAmount_initializers, _rewardAmount_extraInitializers);
        __esDecorate(null, null, _rewardType_decorators, { kind: "field", name: "rewardType", static: false, private: false, access: { has: obj => "rewardType" in obj, get: obj => obj.rewardType, set: (obj, value) => { obj.rewardType = value; } }, metadata: _metadata }, _rewardType_initializers, _rewardType_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Campaign = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Campaign = _classThis;
})();
exports.Campaign = Campaign;
