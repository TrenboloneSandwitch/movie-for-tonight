import { type FC } from 'react';
import Select, { type Options } from 'react-select';
import makeAnimated from 'react-select/animated';

type Option = { value: string | number; label: string };

export interface MultiSelectProps {
	options: Options<Option>;
	defaultValue?: Options<Option>;
	placeholder?: string;
}

const animatedComponents = makeAnimated();

const brandColor = 'none';

export const MultiSelect: FC<MultiSelectProps> = ({
	options,
	defaultValue,
	placeholder,
}) => {
	return (
		<Select
			placeholder={placeholder ?? 'Select...'}
			styles={{
				option: (base, state) => ({
					...base,
					backgroundColor: state.isFocused
						? 'rgb(203, 212, 220)'
						: base.backgroundColor,
				}),
				control: (base, state) => ({
					...base,
					boxShadow: 'none',
					borderColor: state.isFocused ? brandColor : base.borderColor,
					'&:hover': {
						borderColor: state.isFocused ? brandColor : base.borderColor,
					},
				}),
			}}
			closeMenuOnSelect={false}
			components={animatedComponents}
			defaultValue={defaultValue}
			isMulti
			options={options}
		/>
	);
};
