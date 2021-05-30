import { components } from './schema';

export type MangaRequest = components['schemas']['MangaRequest'];
export type MangaResponse = components['schemas']['MangaResponse'];
export type Manga = components['schemas']['Manga'];

export type ChapterRequest = components['schemas']['ChapterRequest'];
export type ChapterResponse = components['schemas']['ChapterResponse'];
export type Chapter = components['schemas']['Chapter'];

export type MangaList = components['schemas']['MangaList'];
export type ChapterList = components['schemas']['ChapterList'];

export type Group = components['schemas']['ScanlationGroupResponse'];

export type CoverResponse = components['schemas']['CoverResponse'];
export type Cover = components['schemas']['Cover'];

export const ApiRoot = 'https://api.mangadex.org';
