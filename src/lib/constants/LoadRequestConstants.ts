import type { GenericMediaMetadata } from 'chromecast-caf-receiver/cast.framework.messages'

export enum TemplateLoadRequestEnum {
	BASIC,
	BASIC_QUEUE
}

export const DEFAULT_QUEUED_MEDIA = {
	type: 'LOAD',
	requestId: Date.now(),
	media: {
		contentUrl:
			'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
		streamType: 'BUFFERED',
		metadata: {
			metadataType: 1,
			title: 'Item 1',
			subtitle: 'Big Buck Bunny'
		}
	},
	queueData: {
		name: 'Queue Name',
		repeatMode: 'REPEAT_OFF',
		items: [
			{
				startTime: 0,
				media: {
					contentType: 'video/mp4',
					contentUrl:
						'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/BigBuckBunny.mp4',
					streamType: 'BUFFERED',
					metadata: {
						metadataType: 1,
						title: 'Item 1',
						subtitle: 'Big Buck Bunny'
					}
				}
			},
			{
				autoplay: true,
				startTime: 0,
				preloadTime: 20,
				media: {
					contentType: 'video/mp4',
					contentUrl:
						'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
					streamType: 'BUFFERED',
					metadata: {
						metadataType: 1,
						title: 'Item 2',
						subtitle: 'Tears of Steel'
					}
				}
			},
			{
				autoplay: true,
				startTime: 0,
				preloadTime: 10,
				media: {
					contentType: 'video/mp4',
					contentUrl:
						'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8',
					streamType: 'BUFFERED',
					metadata: {
						metadataType: 1,
						title: 'Item 3',
						subtitle: 'Bipbop Adventure'
					}
				}
			}
		]
	}
}

export const DEFAULT_MEDIA = {
	type: 'LOAD',
	requestId: Date.now(),
	media: {
		contentId: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
		metadata: {
			title: 'Big Buck Bunny',
			subtitle: 'Gettin Real Tired of Big Buck Bunny',
			images: [{ url: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png' }]
		} as GenericMediaMetadata,
		contentType: 'video/mp4',
		streamType: 'BUFFERED',
		mediaCategory: 'VIDEO'
	}
}
