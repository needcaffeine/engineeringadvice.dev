import { htmlToText } from 'html-to-text';
import parseFeed from 'rss-to-json';
import { array, number, object, optional, parse, string, union } from 'valibot';

import { optimizeImage } from './optimize-episode-image';
import { dasherize } from '../utils/dasherize';
import { truncate } from '../utils/truncate';
import starpodConfig from '../../starpod.config';

export interface Show {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Episode {
  id: string;
  title: string;
  published: number;
  description: string;
  duration: number;
  content: string;
  episodeImage?: string;
  episodeNumber?: string;
  episodeSlug: string;
  episodeThumbnail?: string;
  audio: {
    src: string;
    type: string;
  };
}

let showInfoCache: Show | null = null;

export async function getShowInfo() {
  if (showInfoCache) {
    return showInfoCache;
  }

  // @ts-expect-error
  const showInfo = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  showInfo.image = (await optimizeImage(showInfo.image, {
    height: 640,
    width: 640
  })) as string;

  showInfoCache = showInfo;
  return showInfo;
}

let episodesCache: Array<Episode> | null = null;

function normalizeDuration(duration: number | string): number {
  if (typeof duration === 'number') {
    return duration;
  }

  if (/^\d+$/.test(duration)) {
    return Number(duration);
  }

  const parts = duration.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) {
    return 0;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
}

export async function getAllEpisodes() {
  if (episodesCache) {
    return episodesCache;
  }
  let FeedSchema = object({
    items: array(
      object({
        id: string(),
        title: string(),
        published: number(),
        description: optional(string()),
        content_encoded: optional(string()),
        itunes_duration: union([number(), string()]),
        itunes_episode: optional(union([number(), string()])),
        itunes_episodeType: string(),
        itunes_image: optional(object({ href: optional(string()) })),
        enclosures: array(
          object({
            url: string(),
            type: string()
          })
        )
      })
    )
  });

  // @ts-expect-error
  let feed = (await parseFeed.parse(starpodConfig.rssFeed)) as Show;
  let items = parse(FeedSchema, feed).items;

  let episodes: Array<Episode> = await Promise.all(
    items
      .filter((item) => item.itunes_episodeType !== 'trailer')
      .map(
        async ({
          description,
          content_encoded,
          id,
          title,
          enclosures,
          published,
          itunes_duration,
          itunes_image
        }) => {
          const episodeSlug = dasherize(title);
          const safeDescription = description || '';
          const episodeContent = content_encoded || safeDescription;

          return {
            id,
            title: `${title}`,
            content: episodeContent,
            description: truncate(htmlToText(safeDescription), 260),
            duration: normalizeDuration(itunes_duration),
            episodeImage: itunes_image?.href,
            episodeNumber: '',
            episodeSlug,
            episodeThumbnail: await optimizeImage(itunes_image?.href),
            published,
            audio: enclosures.map((enclosure) => ({
              src: enclosure.url,
              type: enclosure.type
            }))[0]
          };
        }
      )
  );

  // Assign a global episode number across all seasons (oldest -> newest).
  for (const [index, episode] of [...episodes].sort((a, b) => a.published - b.published).entries()) {
    episode.episodeNumber = `${index + 1}`;
  }

  episodesCache = episodes;
  return episodes;
}
