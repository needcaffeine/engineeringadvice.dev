import type { APIRoute } from 'astro';

import { cleanTranscript, generateEpisodeMarkdown } from '../lib/llms';
import { getAllEpisodes, getShowInfo } from '../lib/rss';
import { getTranscriptForEpisode } from '../lib/transcripts';
import starpodConfig from '../../starpod.config';

export async function getStaticPaths() {
  const allEpisodes = await getAllEpisodes();

  return allEpisodes.map((episode) => {
    return {
      params: { episode: episode.episodeSlug },
      props: { episode }
    };
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { episode } = props;
  const show = await getShowInfo();
  let transcriptContent = '';
  const transcript = await getTranscriptForEpisode(
    episode.episodeNumber,
    episode.episodeSlug
  );

  if (transcript?.body) {
    transcriptContent = cleanTranscript(transcript.body);
  }

  const markdown = generateEpisodeMarkdown(
    episode,
    show,
    starpodConfig,
    transcriptContent
  );

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
};
