import clsx from 'clsx';
import { type FC } from 'react';

interface ScoreCardProps {
	rating: number;
	className?: string;
	isTextColored?: boolean;
}

export const ScoreCard: FC<ScoreCardProps> = ({
	rating,
	className,
	isTextColored,
}) => {
	const isGreen = rating > 7.5;
	const isRed = rating < 6.5;
	const isOrange = !isRed && !isGreen;

	return (
		<div
			className={clsx('rounded-xl p-2 font-bold', className, {
				[`${isTextColored ? 'text-green-500' : 'bg-green-500'}`]: isGreen,
				[`${isTextColored ? 'text-yellow-500' : 'bg-yellow-400'}`]: isOrange,
				[`${isTextColored ? 'text-red-500' : 'bg-red-500'}`]: isRed,
			})}
		>
			{rating.toFixed(1)}
		</div>
	);
};
