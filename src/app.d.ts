import type { cast as CastType } from 'chromecast-caf-receiver'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	var cast: CastType;

	interface Window {
		cast: CastType
	}
}

export { };
