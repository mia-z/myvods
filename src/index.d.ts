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