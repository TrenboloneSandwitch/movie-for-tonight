import { setupServer } from 'msw/node';
import { handlers } from './movies';

export const server = setupServer(...handlers);
