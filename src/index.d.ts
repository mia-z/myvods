declare namespace Twitch {
    interface Video {
        id: string;
        streamID: null;
        userID: string;
        userLogin: string;
        userName: string;
        title: string;
        description:   string;
        createdAt: Date;
        publishedAt: Date;
        url: string;
        thumbnailURL: string;
        viewable: string;
        viewCount: number;
        language: string;
        type: string;
        duration: string;
        mutedSegments: null;
    }
    interface User {
        id: string;
        login: string;
        description: string;
        display_name: string;
        profile_image_url: string;
        offline_image_url: string;
    }
    interface IPlayerOptions {
        width: number | string;
        height: number | string;
        channel?: string;
        video?: string;
        collection?: string;
        parent: string[]
    }
    interface PlaybackStats {
        backendVersion: string;
        bufferSize: number;
        codecs: string;
        displayReolution: string;
        fps: number;
        hlsLatencyBroadcaster: number;
        playbackRate: number;
        skippedFrames: number;
        videoResolution: strin;
    } 
    declare class Player {
        public options: IPlayerOptions;
        public element: string;
        public autoplay: boolean;
        constructor(element: string, opts: IPlayerOptions, autoplay = true, muted = false, time = "0h0m0s");
        disableCaptions(): void;
        enableCaptions(): void;
        pause(): void;
        play(): void;
        seek(timestamp: number): void;
        setQuality(quality: string):void;
        getMuted(): boolean;
        setMuted(muted: boolean): void;
        getVolume(): number;
        setVolume(volume: number): void;
        getPlaybackStats(): PlaybackStats;
        getChannel(): string;
        getCurrentTime(): number;
        getDuration(): number;
        getEnded(): boolean;
        getQualitites(): string[];
        getQuality(): string;
        getVideo(): string;
        isPaused(): boolean;
        /** EVENTS
        * Twitch.Player.CAPTIONS	Closed captions are found in the video content being played. This event will be emitted once for each new batch of captions, in sync with the corresponding video content. The event payload is a string containing the caption content.
        * Twitch.Player.ENDED	Video or stream ends.
        * Twitch.Player.PAUSE	Player is paused. Buffering and seeking is not considered paused.
        * Twitch.Player.PLAY	Player just unpaused, will either start video playback or start buffering.
        * Twitch.Player.PLAYBACK_BLOCKED	Player playback was blocked. Usually fired after an unmuted autoplay or unmuted programmatic call on play().
        * Twitch.Player.PLAYING	Player started video playback.
        * Twitch.Player.OFFLINE	Loaded channel goes offline.
        * Twitch.Player.ONLINE	Loaded channel goes online.
        * Twitch.Player.READY	Player is ready to accept function calls.
        * Twitch.Player.SEEK	User has used the player controls to seek a VOD, the seek() method has been called, or live playback has seeked to sync up after being paused.
        */
    }
}

declare namespace Google {
    interface Person {
        resourceName: string;
        etag: string;
        names: PersonName[]
    }
    interface PersonName {
        metadata: PersonNameMetadata;
        displayName: string;
        familyName: string;
        givenName: string;
        displayNameLastFirst: string;
        unstructuredName: string;
    }
    interface PersonNameMetadata {
        primary?: boolean;
        source: PersonNameMetadataSource;
        sourcePrimary?: boolean;
    }
    interface PersonNameMetadataSource {
        type: string;
        id: string;
    }
}

declare namespace YT {
    interface PlayerOptions {
        width?: number | "100%";
        height?: number | "100%";
        videoId: string;
        width?: number | string | undefined;
        height?: number | string | undefined;
        videoId?: string | undefined;
        host?: string | undefined;
        playerVars?: {
            autoplay?: 0 | 1 | undefined,
            cc_lang_pref?: string | undefined,
            cc_load_policy?: 1 | undefined,
            color?: 'red' | 'white' | undefined,
            controls?: 0 | 1 | undefined,
            disablekb?: 0 | 1 | undefined,
            enablejsapi?: 0 | 1 | undefined,
            end?: number | undefined,
            fs?: 0 | 1 | undefined,
            hl?: string | undefined,
            iv_load_policy?: 1 | 3 | undefined,
            list?: string | undefined,
            listType?: 'playlist' | 'search' | 'user_uploads' | undefined,
            loop?: 0 | 1 | undefined,
            modestbranding?: 1 | undefined,
            origin?: string | undefined,
            playlist?: string | undefined,
            playsinline?: 0 | 1 | undefined,
            rel?: 0 | 1 | undefined,
            start?: number | undefined,
            widget_referrer?: string | undefined,
        } | undefined;
        events?: { [eventType in EventType]?: (event: CustomEvent) => void
        } | undefined;
    }
    type EventType =
    "ready" |
    "stateChange" |
    "playbackQualityChange" |
    "playbackRateChange" |
    "error" |
    "apiChange" |
    "volumeChange";
    declare class Player {
        constructor(elementId: string, options: PlayerOptions);
        addEventListener(event: string, listener: (event: CustomEvent) => void): Promise<void>;
        destroy(): Promise<void>;
        getAvailablePlaybackRates(): Promise<ReadonlyArray<number>>;
        getAvailableQualityLevels(): Promise<ReadonlyArray<string>>;
        getCurrentTime(): Promise<number>;
        getDuration(): Promise<number>;
        getIframe(): Promise<HTMLIFrameElement>;
        getOption(module: string, option: string): Promise<any>;
        getOptions(): Promise<string[]>;
        getOptions(module: string): Promise<object>;
        setOption(module: string, option: string, value: any): Promise<void>;
        setOptions(): Promise<void>;
        cuePlaylist(
            playlist: string | ReadonlyArray<string>,
            index?: number,
            startSeconds?: number,
            suggestedQuality?: string,
            ): Promise<void>;
            cuePlaylist(playlist: {
                listType: string,
                list?: string | undefined,
                index?: number | undefined,
                startSeconds?: number | undefined,
                suggestedQuality?: string | undefined,
            }): Promise<void>;
            loadPlaylist(
                playlist: string | ReadonlyArray<string>,
                index?: number,
                startSeconds?: number,
                suggestedQuality?: string,
                ): Promise<void>;
                loadPlaylist(playlist: {
                    listType: string,
                    list?: string | undefined,
                    index?: number | undefined,
                    startSeconds?: number | undefined,
                    suggestedQuality?: string | undefined,
                }): Promise<void>;
                getPlaylist(): Promise<ReadonlyArray<string>>;
                getPlaylistIndex(): Promise<number>;
                getPlaybackQuality(): Promise<string>;
                getPlaybackRate(): Promise<number>;
                getPlayerState(): Promise<PlayerState>;
                getVideoEmbedCode(): Promise<string>;
                getVideoLoadedFraction(): Promise<number>;
                getVideoUrl(): Promise<string>;
                getVolume(): Promise<number>;
                cueVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): Promise<void>;
                cueVideoById(video: {
                    videoId: string,
                    startSeconds?: number | undefined,
                    endSeconds?: number | undefined,
                    suggestedQuality?: string | undefined,
                }): Promise<void>;
                cueVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): Promise<void>;
                cueVideoByUrl(video: {
                    mediaContentUrl: string,
                    startSeconds?: number | undefined,
                    endSeconds?: number | undefined,
                    suggestedQuality?: string | undefined,
                }): Promise<void>;
                loadVideoByUrl(mediaContentUrl: string, startSeconds?: number, suggestedQuality?: string): Promise<void>;
                loadVideoByUrl(video: {
                    mediaContentUrl: string,
                    startSeconds?: number | undefined,
                    endSeconds?: number | undefined,
                    suggestedQuality?: string | undefined,
                }): Promise<void>;
                loadVideoById(videoId: string, startSeconds?: number, suggestedQuality?: string): Promise<void>;
                loadVideoById(video: {
                    videoId: string,
                    startSeconds?: number | undefined,
                    endSeconds?: number | undefined,
                    suggestedQuality?: string | undefined,
                }): Promise<void>;
                isMuted(): Promise<boolean>;
                mute(): Promise<void>;
                nextVideo(): Promise<void>;
                pauseVideo(): Promise<void>;
                playVideo(): Promise<void>;
                playVideoAt(index: number): Promise<void>;
                previousVideo(): Promise<void>;
                removeEventListener(event: string, listener: (event: CustomEvent) => void): Promise<void>;
                seekTo(seconds: number, allowSeekAhead: boolean): Promise<void>;
                setLoop(loopPlaylists: boolean): Promise<void>;
                setPlaybackQuality(suggestedQuality: string): Promise<void>;
                setPlaybackRate(suggestedRate: number): Promise<void>;
                setShuffle(shufflePlaylist: boolean): Promise<void>;
                getSize(): Promise<PlayerSize>;
                setSize(width: number, height: number): Promise<object>;
                setVolume(volume: number): Promise<void>;
                stopVideo(): Promise<void>;
                unMute(): Promise<void>;
                on(eventType: "stateChange", listener: (event: CustomEvent & { data: number }) => void): void;
                on(eventType: EventType, listener: (event: CustomEvent) => void): void;
            }
        }
        
        declare namespace Youtube {
            //Common and base
            interface YoutubeBaseObject {
                kind: string;
                etag: string;
            }
            interface ResponseBase extends YoutubeBaseObject {
                pageInfo: PageInfo
            }
            interface PageInfo {
                totalResults: number,
                resultsPerPage: number
            }
            interface ThumbnailCollection {
                [thumbnailName: string]: Thumbnail;
            }
            interface Thumbnail {
                url: string;
                width: number;
                height: number;
            }
            interface ResourceId {
                kind: string;
                videoId: string;
            }
            interface SnippetBase {
                title: string;
                description: string;
                publishedAt: string;
                thumbnails: ThumbnailCollection;
            }
            //Playlist
            interface PlaylistListResponse extends ResponseBase {
                nextPageToken?: string;
                prevPageToken?: string;
                pageInfo: PageInfo;
                items: Playlist[];
            } 
            interface Playlist extends YoutubeBaseObject {
                snippet: PlaylistSnippet;
                status: PlaylistStatus;
                contentDetails: PlaylistContentDetails;
                player: PlaylistPlayer;
            }
            interface PlaylistSnippet extends SnippetBase {
                channelId: string;
                channelTitle: string;
                defaultLanguage: string;
            }
            interface PlaylistStatus {
                privacyStatus: "public" | "private" | "unlisted";
            }
            interface PlaylistContentDetails {
                itemCount: number;
            }
            interface PlaylistPlayer {
                embedHtml: string;
            }
            //Playlist Items
            interface PlaylistItemsResponse extends ResponseBase {
                nextPageToken?: string;
                prevPageToken?: string;
                pageInfo: PageInfo;
                items: PlaylistItem[];
            }
            interface PlaylistItem extends YoutubeBaseObject {
                id: string;
                snippet: PlaylistItemSnippet;
                status: PlaylistItemStatus;
            }
            interface PlaylistItemStatus {
                privacyStatus: "public" | "private" | "unlisted";
            }
            interface PlaylistItemSnippet extends SnippetBase {
                resourceId: ResourceId;
                channelId: string;
                channelTitle: string;
                playlistId: string;
                position: number;
                videoOwnerChannelTitle: string;
                videoOwnerChannelId: string;
            }
            //Videos
            interface VideoListResponse extends ResponseBase {
                items: Video[]
            }
            interface Video extends YoutubeBaseObject {
                id: string;
                snippet: VideoSnippet;
                contentDetails: VideoContentDetails;
                statistics: VideoStatistics;
                liveStreamingDetails: LiveStreamingDetails;
            }
            interface VideoSnippet {
                publishedAt: string;
                channelId: string;
                title: string;
                description: string;
                thumbnails: ThumbnailCollection;
                channelTitle: string;
                tags: string[];
                categoryId: string;
                liveBroadcastContent: string;
            }
            interface VideoContentDetails {
                duration: string;
                dimension: string;
                definition: string;
                caption: boolean;
                licensedContent: boolean;
                contentRating: {
                    ytRating: string;
                },
                projection: string;
            }
            interface VideoStatistics {
                viewCount: number,
                likeCount: number,
                favoriteCount: number
            }
            interface LiveStreamingDetails {
                actualStartTime: string;
                actualEndTime: string;
            }
            //Channels
            interface ChannelListResponse extends ResponseBase {
                items: Channel[]
                nextPageToken?: string;
                prevPageToken?: string;
                pageInfo: PageInfo;
            }
            interface Channel extends YoutubeBaseObject {
                snippet: ChannelSnippet;
                contentDetails: ChannelContentDetails;
                statistics: ChannelStatistics;
                status: ChannelStatus
            }
            interface ChannelSnippet extends SnippetBase {
                customUrl: string;
                country: string;
                defaultLanguage: string;
                localized: {
                    title: string;
                    description: string
                };
            }
            interface ChannelContentDetails {
                relatedPlaylists: {
                    likes: string;
                    favorites: string;
                    uploads: string
                };
            }
            interface ChannelStatistics {
                viewCount: number;
                subscriberCount: number;
                hiddenSubscriberCount: boolean;
                videoCount: number;
            }
            interface ChannelStatus {
                privacyStatus: string;
                isLinked: boolean;
                longUploadStatus: string;
                madeForKids: boolean;
                selfDeclaredMadeForKids: boolean;
            }
            //Search
            interface SearchListResponse<T extends Channel | Playlist | Video> extends ResponseBase {
                items: SearchResult<T>[];
                nextPageToken?: string;
                prevPageToken?: string;
                pageInfo: PageInfo;
            }
            interface SearchResult<T extends Channel | Playlist | Video> extends YoutubeBaseObject {
                id: T extends Channel ? SearchResultChannelId :
                T extends Playlist ? SearchResultPlaylistId :
                T extends Video ? SearchResultPlaylistId :
                never;
                snippet: SearchResultSnippet;
            }
            interface SearchResultVideoId {
                kind: "youtube#video",
                videoId: string;
            }
            interface SearchResultChannelId {
                kind: "youtube#channel",
                channelId: string;
            }
            interface SearchResultPlaylistId {
                kind: "youtube#playlist",
                playlistId: string;
            }
            interface SearchResultSnippet {
                channelId: string;
                channelTitle: string;
                liveBroadcastContent: string;
            }
        }
        
        /**
        * DATA SOURCED FROM 
        * https://kick.com/api/v1/users/destiny
        * https://kick.com/api/v1/channels/destiny
        * https://kick.com/api/v1/video/909ed367-f986-4ab4-bdcb-e26483a4951f
        */
        declare namespace Kick {
            interface Channel {
                id: number;
                userID: number;
                slug: string;
                isBanned: boolean;
                playbackURL: string;
                nameUpdatedAt: null;
                vodEnabled: boolean;
                subscriptionEnabled: boolean;
                followersCount: number;
                subscriberBadges: SubscriberBadge[];
                bannerImage: Banner;
                recentCategories: RecentCategoryElement[];
                livestream: null;
                role: null;
                muted: boolean;
                followerBadges: any[];
                offlineBannerImage: OfflineBannerImage;
                canHost: boolean;
                user: UserClass;
                chatroom: Chatroom;
                ascendingLinks: any[];
                plan: Plan;
                previousLivestreams: PreviousLivestream[];
                verified: Verified;
                media: Media[];
            }
            
            interface Banner {
                responsive: string;
                url: string;
            }
            
            interface Chatroom {
                id: number;
                chatableType: string;
                channelID: number;
                createdAt: Date;
                updatedAt: Date;
                chatModeOld: string;
                chatMode: string;
                slowMode: boolean;
                chatableID: number;
                followersMode: boolean;
                subscribersMode: boolean;
                emotesMode: boolean;
                messageInterval: number;
                followingMinDuration: number;
            }
            
            interface Media {
                id: number;
                modelType: string;
                modelID: number;
                collectionName: string;
                name: string;
                fileName: string;
                mimeType: string;
                disk: string;
                size: number;
                manipulations: any[];
                customProperties: CustomProperties;
                responsiveImages: any[] | ResponsiveImagesClass;
                orderColumn: number;
                createdAt: Date;
                updatedAt: Date;
                uuid: string;
                conversionsDisk:  string;
            }
            
            interface CustomProperties {
                generatedConversions: GeneratedConversions;
            }
            
            interface GeneratedConversions {
                fullsize: boolean;
                medium?: boolean;
            }
            
            interface ResponsiveImagesClass {
                fullsize: Fullsize;
            }
            
            interface Fullsize {
                urls: string[];
                base64SVG: string;
            }
            
            interface OfflineBannerImage {
                src: string;
                srcset: string;
            }
            
            interface Plan {
                id: number;
                channelID: number;
                stripePlanID: string;
                amount: string;
                createdAt: Date;
                updatedAt: Date;
            }
            
            interface PreviousLivestream {
                id: number;
                slug: string;
                channelID: number;
                createdAt: Date;
                sessionTitle: string;
                isLive: boolean;
                riskLevelID: null;
                startTime: Date;
                source: null;
                twitchChannel: null;
                duration: number;
                language: string;
                isMature: boolean;
                viewerCount: number;
                thumbnail: OfflineBannerImage;
                views: number;
                tags: string[];
                categories: RecentCategory[];
                video: Video;
            }
            
            interface Category {
                id: number;
                categoryID: number;
                name: string;
                slug: string;
                tags: string[];
                description: null;
                deletedAt: null;
                viewers: number;
                banner: Banner;
                category: CategoryMeta;
            }
            
            interface CategoryMeta {
                id: number;
                name: string;
                slug: string;
                icon: string;
            }
            
            interface Video {
                id: number;
                liveStreamID: number;
                slug: null;
                thumb: null;
                s3: null;
                tradingPlatformID: null;
                createdAt: Date;
                updatedAt: Date;
                uuid: string;
                views: number;
                deletedAt: null;
            }
            
            interface SubscriberBadge {
                id: number;
                channelID: number;
                months: number;
                badgeImage: OfflineBannerImage;
            }
            
            interface User {
                id: number;
                username: string;
                agreedToTerms: boolean;
                emailVerifiedAt: Date;
                bio: string;
                country: string;
                state: string;
                city: string;
                instagram: string;
                twitter: string;
                youtube: string;
                discord: string;
                tiktok: string;
                facebook: string;
                profilePic: string;
            }
            
            interface Verified {
                id: number;
                channelID: number;
                createdAt: Date;
                updatedAt: Date;
            }
            
            interface Video {
                id:                number;
                liveStreamID:      number;
                slug:              null;
                thumb:             null;
                s3:                null;
                tradingPlatformID: null;
                createdAt:         Date;
                updatedAt:         Date;
                uuid:              string;
                views:             number;
                deletedAt:         null;
                source:            string;
                livestream:        Livestream;
            }
            interface Livestream {
                id:            number;
                slug:          string;
                channelID:     number;
                createdAt:     Date;
                sessionTitle:  string;
                isLive:        boolean;
                riskLevelID:   null;
                startTime:     Date;
                source:        null;
                twitchChannel: null;
                duration:      number;
                language:      string;
                isMature:      boolean;
                viewerCount:   number;
                thumbnail:     string;
                channel:       Channel;
                categories:    Category[];
            }
        }