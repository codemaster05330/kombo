export class Sequence {
	//ID of the sound to identify it uniquely. Randomly generated when newly created
	id : number;

	//The type of sound this Sound file is supposed to be playing in. needs to be set in the constructor
	type : SoundType;

	/* The actual array of when the sounds are supposed to play.
	 * the int values represent the length of the sound started at this beat in 1/8ths.
	 * the size of the grid defaults to 5x32, the first dimension can be set in the constructor
	 * the first dimension is the height of the tone, the second dimension is the beat position
	*/ 
	beatGrid : number[][];

	constructor(_type : SoundType, _toneheights:number = 5){

		this.type = _type;

		//randomly selects an id between -32767 and 32767
		this.id = Math.floor(Math.random() * (32767 + 32767 + 1)) - 32767;

		this.beatGrid = [];
		//initialise the beat grid with 0s
		for (var i : number = 0; i < _toneheights; i++){
			this.beatGrid[i] = [];
			for (var j: number = 0; j < 32; j++){
				this.beatGrid[i][j] = 0;
			}
		}
	}


	public getId() : number {
		return this.id; 
	}

	public setId(_id: number){
		this.id = _id;
	}

	public getType() : SoundType {
		return this.type;
	}

	public setType(_type: SoundType){
		this.type = _type;
	}

	public nextType(){
		this.type++;
		if (this.type >= Object.keys(SoundType).length / 2){
			this.type = 0;
		}
	}

	public getBeatGrid() : number[][]{
		return this.beatGrid;
	}

	public setBeatGrid(grid: number[][]):boolean {
		if (this.beatGrid.length == grid.length && this.beatGrid[0].length == grid[0].length) {
			this.beatGrid = grid;
			return true;
		} else {
			return false;
		}
	}

	public setBeatGridAtPos(x: number, y:number, value:number):boolean {
		if (x < this.beatGrid.length && x >= 0 && y < this.beatGrid[0].length && y >= 0 && value >= 0){
			this.beatGrid[x][y] = value;
			return true;
		} else {
			return false;
		}
	}

	public clearBeatGrid() : void {
		var x : number = this.beatGrid.length;

		this.beatGrid = [];

		for (var i : number = 0; i < x; i++){
			this.beatGrid[i] = [];
			for (var j: number = 0; j < 32; j++){
				this.beatGrid[i][j] = 0;
			}
		}
	}

	public fillBeatGridAtRandom(){
		this.clearBeatGrid();

		var x: number = this.beatGrid.length;
		for(var i: number = 0; i < x; i++){
			for (var j = 0; j < 32; j++) {
				var rand:number = Math.random();
				if(rand>0.75){
					this.beatGrid[i][j] = 1;
				} else if (rand > 0.7){
					var l = Math.floor(Math.random()*7) + 1;
					if(j + l > 32){
						l = 32 - j;
					}
					this.beatGrid[i][j] = l;
					j += l;
				}
			}
		}

	}

}


// Enum to hold the different types of Sounds. please add the possible sounds here.
export enum SoundType {
	Bass1,
	Bass2,
	Bass3,
	Drums1,
	Drums2,
	Drums3,
	Harm1,
	Harm2,
	Harm3,
	Lead1,
	Lead2,
	Lead3,
	Mall1,
	Mall2,
	Mall3
}

// Enum to hold the "fancy names" of the Sounds. please add the possible soundnames here in the same order as above.
export enum SoundName {
	"On the fly",
	"Process of growth",
	"Ocean Abyss",
	"Percussion",
	"Drumset",
	"Drumcore",
	"Space walk",
	"Robot's dream",
	"Galaxy",
	"Cloud",
	"Little star",
	"Blade",
	"Glasses",
	"Sunray",
	"Schneehase"
}