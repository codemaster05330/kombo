var Sequence = /** @class */ (function () {
    function Sequence(_type, _toneheights) {
        if (_toneheights === void 0) { _toneheights = 5; }
        this.type = _type;
        //randomly selects an id between -32767 and 32767
        this.id = Math.floor(Math.random() * (32767 + 32767 + 1)) - 32767;
        this.beatGrid = [];
        //initialise the beat grid with 0s
        for (var i = 0; i < _toneheights; i++) {
            this.beatGrid[i] = [];
            for (var j = 0; j < 32; j++) {
                this.beatGrid[i][j] = 0;
            }
        }
    }
    Sequence.prototype.getId = function () {
        return this.id;
    };
    Sequence.prototype.getType = function () {
        return this.type;
    };
    Sequence.prototype.getBeatGrid = function () {
        return this.beatGrid;
    };
    Sequence.prototype.setBeatGrid = function (grid) {
        if (this.beatGrid.length == grid.length && this.beatGrid[0].length == grid[0].length) {
            this.beatGrid = grid;
            return true;
        }
        else {
            return false;
        }
    };
    Sequence.prototype.setBeatGridAtPos = function (x, y, value) {
        if (x < this.beatGrid.length && x >= 0 && y < this.beatGrid[0].length && y >= 0 && value >= 0) {
            this.beatGrid[x][y] = value;
            return true;
        }
        else {
            return false;
        }
    };
    Sequence.prototype.clearBeatGrid = function () {
        var x = this.beatGrid.length;
        this.beatGrid = [];
        for (var i = 0; i < x; i++) {
            this.beatGrid[i] = [];
            for (var j = 0; j < 32; j++) {
                this.beatGrid[i][j] = 0;
            }
        }
    };
    Sequence.prototype.fillBeatGridAtRandom = function () {
        this.clearBeatGrid();
        var x = this.beatGrid.length;
        for (var i = 0; i < x; i++) {
            for (var j = 0; j < 32; j++) {
                var rand = Math.random();
                if (rand > 0.75) {
                    this.beatGrid[i][j] = 1;
                }
                else if (rand > 0.7) {
                    var l = Math.floor(Math.random() * 7) + 1;
                    if (j + l > 32) {
                        l = 32 - j;
                    }
                    this.beatGrid[i][j] = l;
                    j += l;
                }
            }
        }
    };
    return Sequence;
}());
export { Sequence };
// Enum to hold the different types of Sounds. please add the possible sounds here.
export var SoundType;
(function (SoundType) {
    SoundType[SoundType["Drums"] = 0] = "Drums";
    SoundType[SoundType["Bass"] = 1] = "Bass";
    SoundType[SoundType["Marimba"] = 2] = "Marimba";
})(SoundType || (SoundType = {}));
//# sourceMappingURL=sequence.js.map