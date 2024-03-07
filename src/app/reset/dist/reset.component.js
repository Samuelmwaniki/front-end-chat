"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResetComponent = void 0;
var core_1 = require("@angular/core");
var ResetComponent = /** @class */ (function () {
    function ResetComponent() {
    }
    ResetComponent.prototype.ngOnInit = function () {
    };
    ResetComponent = __decorate([
        core_1.Component({
            selector: 'app-reset',
            templateUrl: './reset.component.html',
            styleUrls: ['./reset.component.scss']
        })
    ], ResetComponent);
    return ResetComponent;
}());
exports.ResetComponent = ResetComponent;
