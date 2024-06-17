import { useForm, useInputControl, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { Form, json, useActionData } from '@remix-run/react';
import { AuthenticityTokenInput } from 'remix-utils/csrf/react';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { validateCSRF } from '~/utils/csrf.server';
import { checkHoneypot } from '~/utils/honeypot.server';
import { Field } from '~/components/forms/Field';
import { ErrorList } from '~/components/forms/ErrorList';

export const meta: MetaFunction = () => {
	return [
		{ title: '[TBD] New page' },
		{ name: 'description', content: '[TBD] New page!' },
	];
};

const LoginFormSchema = z.object({
	redirectTo: z.string().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	await validateCSRF(formData, request.headers);
	checkHoneypot(formData);
	const submission = await parseWithZod(formData, {
		schema: intent =>
			LoginFormSchema.transform(async (data, ctx) => {
				if (intent?.type !== 'validate') return { ...data, session: null };

				return { ...data, session: null };
			}),
		async: true,
	});
	return json({ submission, redirectTo: '/' });
}

export default function New() {
	const actionData = useActionData<typeof action>();

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(LoginFormSchema),
		defaultValue: {},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginFormSchema });
		},
		shouldRevalidate: 'onBlur',
	});
	return (
		<div className="p-4 font-sans">
			<h1 className="text-3xl">[TBD] New page</h1>

			<div className="mx-auto w-full max-w-md px-8">
				<Form method="POST" {...form}>
					<AuthenticityTokenInput />
					<HoneypotInputs />
					<Field
						labelProps={{ children: 'Username' }}
						inputProps={{
							...getInputProps(fields.redirectTo, { type: 'text' }),
							autoFocus: true,
							className: 'lowercase',
						}}
						errors={fields.redirectTo.errors}
					/>

					<input {...(fields.redirectTo, { type: 'hidden' })} />
					<ErrorList errors={form.errors} id={form.errorId} />
				</Form>
			</div>
		</div>
	);
}
