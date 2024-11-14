import type { MediaInformation } from 'chromecast-caf-receiver/cast.framework.messages'
import { get } from 'svelte/store'
import { mediaSessionId } from './store'

export const messageReady = () => ({
	namespace: 'urn:x-cast:com.google.cast.system',
	senderId: 'SystemSender',
	data: {
		type: 'ready',
		activeNamespaces: [
			'urn:x-cast-com:google.cast.debugoverlay',
			'urn:x-cast-com:google.cast.cac',
			'urn:x-cast-com:google.cast.media',
			'urn:x-cast-com:google.cast.inject'
		],
		messagesVersion: '1.0',
		sdkCapabilities: {
			show_media_controls_group_supported: true,
			group_capabilities_supported: true,
			playback_device_status_supported: true
		}
	}
})

export const messageConnected = () => ({
	namespace: 'urn:x-cast:com.google.cast.system',
	senderId: 'sender-0',
	data: {
		type: 'senderconnected',
		senderId: 'sender-0'
	}
})

export const messagePlay = () => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'PLAY',
		mediaSessionId: get(mediaSessionId),
		requestId: Date.now()
	}
})

export const messagePause = () => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'PAUSE',
		mediaSessionId: get(mediaSessionId),
		requestId: Date.now()
	}
})

export const messageMute = (volume: number, muted: boolean) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SET_VOLUME',
		volume: {
			level: volume / 100, // normalized 0-1
			muted
		},
		mediaSessionId: get(mediaSessionId),
		requestId: Date.now()
	}
})

export const messageSkipBack = (timeSec = 10) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SEEK',
		resumeState: 'PLAYBACK_START',
		currentTime: 0,
		relativeTime: timeSec * -1.0,
		requestId: Date.now(),
		mediaSessionId: get(mediaSessionId)
	}
})
export const messageSkipForward = (timeSec = 10) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SEEK',
		resumeState: 'PLAYBACK_START',
		currentTime: 0,
		relativeTime: timeSec,
		requestId: Date.now(),
		mediaSessionId: get(mediaSessionId)
	}
})
export const messageSeek = (timeSec: number) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SEEK',
		resumeState: 'PLAYBACK_START',
		currentTime: timeSec,
		requestId: Date.now(),
		mediaSessionId: get(mediaSessionId)
	}
})

export const messageVolume = (volume: number) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: {
		type: 'SET_VOLUME',
		volume: {
			level: volume / 100, // normalized 0-1
			muted: false
		},
		mediaSessionId: get(mediaSessionId),
		requestId: Date.now()
	}
})

export const messageMediaLoad = (media: MediaInformation) => ({
	namespace: 'urn:x-cast:com.google.cast.media',
	senderId: 'SystemSender',
	data: media
})