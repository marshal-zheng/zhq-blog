// Temporary shim for missing `assistant-stream/ai-sdk` export.
// Provides a no-op TransformStream so downstream code can construct and pipe.
// Remove once upstream publishes the official subpath.
export class LanguageModelV1StreamDecoder {
	constructor() {
		return new TransformStream();
	}
}

