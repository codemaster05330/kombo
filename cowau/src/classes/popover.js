var Popover = /** @class */ (function () {
    function Popover(popoverCtrl) {
        this.popoverCtrl = popoverCtrl;
    }
    Popover.prototype.show = function (p, timeout) {
        var pop = this.popoverCtrl.create(p);
        pop.present();
        this.close(pop, timeout);
    };
    // Todo: insert dynamic soundname parameter.
    Popover.prototype.close = function (pop, timeout) {
        setTimeout(function () { pop.dismiss(); }, timeout);
    };
    return Popover;
}());
export { Popover };
//# sourceMappingURL=popover.js.map