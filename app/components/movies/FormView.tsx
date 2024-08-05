import { useForm, getInputProps, getTextareaProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, useActionData } from '@remix-run/react';
import { useMemo, type FC } from 'react';
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import { useIsPending } from '~/hooks';
import { type action } from '~/routes/movies+/new';
import { StatusState } from '~/types';
import { getMoviePosterUrl } from '~/utils/misc';
import { InputField, MultiSelectField, TextAreaField } from '../forms';
import { Button, Icon, StatusButton } from '../ui';
import {
	type SelectedMovie,
	type HandleMovieSelect,
	type Genre,
} from './types';

interface FormViewProps {
	onMovieSelect: HandleMovieSelect;
	movie: SelectedMovie;
	genres: Genre[] | null;
}

export const MovieSchema = z.object({
	apiId: z.number(),
	title: z.string(),
	description: z
		.string()
		.max(1000, { message: 'Must be 1000 or fewer characters long' }),
	releaseDate: z.date(),
	rating: z.number(),
	genres: z.array(z.object({ id: z.number(), name: z.string() })),
	profilePic: z.string(),
});

export const FormView: FC<FormViewProps> = ({
	onMovieSelect,
	movie,
	genres,
}) => {
	const isPending = useIsPending();
	const actionData = useActionData<typeof action>();

	const posterPath = getMoviePosterUrl(movie.poster_path);

	const [form, fields] = useForm({
		id: 'new-movie-form',
		constraint: getZodConstraint(MovieSchema),
		defaultValue: {
			title: movie.title,
			apiId: movie.id,
			description: movie.overview,
			releaseDate: movie.release_date,
			rating: Number(movie.vote_average.toPrecision(2)),
			genres: movie.genres,
			profilePic: posterPath,
		},
		shouldRevalidate: 'onInput',
		lastResult: actionData?.submission,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: MovieSchema });
		},
	});

	const selectedGenresForSelect = useMemo(
		() => movie.genres.map(genre => ({ label: genre.name, value: genre.id })),
		[movie.genres],
	);

	const genresForSelect = useMemo(
		() => (genres ?? []).map(genre => ({ label: genre.name, value: genre.id })),
		[genres],
	);

	return (
		<>
			<h1 className="mb-4 text-2xl">
				<Button className="mr-3" size="sm" onClick={() => onMovieSelect(null)}>
					<Icon name="arrow-left" className="mr-1" /> Back
				</Button>
				[TBD] Change movie info
			</h1>
			<img
				src={posterPath}
				alt={movie.title}
				className="mb-3 rounded-3xl shadow-lg"
			/>
			<Form {...form} className="container" method="POST" id={form.id}>
				<AuthenticityTokenInput />
				<HoneypotInputs />

				<input {...getInputProps(fields.apiId, { type: 'hidden' })} />
				<input {...getInputProps(fields.profilePic, { type: 'hidden' })} />
				<div className="grid grid-cols-6 gap-x-2">
					<InputField
						className="col-span-6 md:col-span-3"
						labelProps={{ children: 'Title:', htmlFor: fields.title.id }}
						inputProps={{
							...getInputProps(fields.title, {
								type: 'text',
								ariaAttributes: true,
								ariaDescribedBy: fields.title.descriptionId,
							}),
						}}
						errors={fields.title.errors}
					/>
					<InputField
						className="col-span-3 md:col-span-2"
						labelProps={{
							children: 'Release date:',
							htmlFor: fields.releaseDate.id,
						}}
						inputProps={{
							...getInputProps(fields.releaseDate, {
								type: 'date',
								ariaAttributes: true,
								ariaDescribedBy: fields.releaseDate.descriptionId,
							}),
						}}
						errors={fields.releaseDate.errors}
					/>
					<InputField
						className="col-span-3 md:col-span-1"
						labelProps={{
							children: 'Rating:',
							htmlFor: fields.rating.id,
						}}
						inputProps={{
							...getInputProps(fields.rating, {
								type: 'number',
								ariaAttributes: true,
								ariaDescribedBy: fields.rating.descriptionId,
							}),
						}}
						errors={fields.rating.errors}
					/>
					<TextAreaField
						className="col-span-6"
						labelProps={{
							children: 'Description:',
							htmlFor: fields.description.id,
						}}
						textareaProps={{
							...getTextareaProps(fields.description, {
								ariaAttributes: true,
							}),
							maxLength: 1000,
						}}
						errors={fields.description.errors}
					/>
					<MultiSelectField
						className="col-span-6"
						labelProps={{
							children: 'Genres:',
							htmlFor: fields.genres.id,
						}}
						defaultValue={selectedGenresForSelect}
						options={genresForSelect}
						id={fields.genres.id}
						errors={fields.genres.errors}
					/>
				</div>

				<div className="col-span-3">
					<StatusButton
						type="submit"
						status={isPending ? StatusState.PENDING : StatusState.IDLE}
					>
						Add Movie
					</StatusButton>
				</div>
			</Form>
		</>
	);
};
