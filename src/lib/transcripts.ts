import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

let transcriptMapPromise: Promise<Map<string, CollectionEntry<'transcripts'>>> | null = null;

function normalize(value: string | number | null | undefined) {
  return String(value ?? '').trim().toLowerCase();
}

function basename(id: string) {
  const parts = id.split('/');
  return parts[parts.length - 1] || id;
}

async function getTranscriptMap() {
  if (!transcriptMapPromise) {
    transcriptMapPromise = getCollection('transcripts').then((entries) => {
      const map = new Map<string, CollectionEntry<'transcripts'>>();

      for (const entry of entries) {
        if (entry.id.startsWith('__')) continue;

        map.set(normalize(entry.id), entry);
        map.set(normalize(basename(entry.id)), entry);
      }

      return map;
    });
  }

  return transcriptMapPromise;
}

export async function getTranscriptForEpisode(
  episodeNumber?: string | number,
  episodeSlug?: string
) {
  const transcripts = await getTranscriptMap();

  const numberKey = normalize(episodeNumber);
  if (numberKey && transcripts.has(numberKey)) {
    return transcripts.get(numberKey);
  }

  const slugKey = normalize(episodeSlug);
  if (slugKey && transcripts.has(slugKey)) {
    return transcripts.get(slugKey);
  }

  return undefined;
}
