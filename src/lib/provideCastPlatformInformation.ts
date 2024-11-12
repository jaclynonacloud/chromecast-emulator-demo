const provideCastPlatformInformation = () => {
    if (window) {
        window.cast = window.cast || {};
        if (!window?.cast?.__platform__) window.cast.__platform__ = {};
        window.cast.__platform__ = {
            ...window.cast.__platform__,
            queryPlatformValue: (e: any) => {
                switch (e) {
                    case 'port-for-web-server':
                        return 8008;
                    case 'log-level-cast-receiver':
                        return undefined;
                    case 'max-video-resolution-vpx':
                        return undefined;
                    case 'device-model':
                        return undefined;
                    case 'cast-receiver-version':
                        return undefined;
                    case 'system-version':
                        return undefined;
                    case 'volume-controllable':
                        return undefined;
                    case 'device-capabilities':
                        return {
                            display_supported: true,
                            hi_res_audio_supported: false,
                            remote_control_input_supported: false,
                            touch_input_supported: false,
                        };
                    case 'is-remote-control-mode-enabled':
                        return false;
                    case 'dpad-controls-overlay-disabled':
                        return false;
                    case 'receiver-flags':
                        return {
                            enable_check_discontinuity_seq_num_for_playlist_reloads: true,
                            enable_dpad_ui: false,
                            enable_hide_controls_on_timer_when_paused: false,
                            enable_synchronize_media_time_with_prev_manifest: true,
                            mirror_crossorigin_exactly: false,
                            shaka_version_for_u_release: '4.11.11',
                        };
                    case 'enabled-for-dev':
                        return true;
                    case 'enable-hls-sample-aes':
                        return 1;
                }
            },
        };
    }
}

export default provideCastPlatformInformation;