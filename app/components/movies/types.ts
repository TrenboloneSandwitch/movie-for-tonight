import { type Genre as PrismaGenre } from '@prisma/client';
import { type MovieDB } from '~/api';

export type Genre = PrismaGenre;

export interface SelectedMovie extends MovieDB {
	genres: Genre[];
}

type HandleMovieSelectArgs = { findId: number; genres: Genre[] } | null;

export type HandleMovieSelect = (args: HandleMovieSelectArgs) => void;
