import { SoundType } from "./sequence";
import { AudioBufferLoader } from 'waves-loaders';

export class Variables {

	public emojiID : number = null;
	public currentSoundType: SoundType = null;

	audioBufferLoader : AudioBufferLoader;
	soundLengths: number[] = [];
	buffers: any;
	
}