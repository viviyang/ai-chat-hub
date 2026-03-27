import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(__dirname, '../../libs/chat-ui/src/**/*!(*.stories|*.spec).{ts,tsx,html}')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
