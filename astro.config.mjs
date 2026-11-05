import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { remarkCaveats } from './src/plugins/remark-caveats.mjs';
import { remarkEnvLinks } from './src/plugins/remark-env-links.mjs';
import { remarkExternalLinks } from './src/plugins/remark-external-links.mjs';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const requiredEnv = [
  'PUBLIC_INSTALL_SH_URL',
  'PUBLIC_INSTALL_PS1_URL',
];
for (const name of requiredEnv) {
  if (!env[name]) throw new Error(`${name} is not set. Copy .env.example to .env`);
}

export default defineConfig({
  markdown: { remarkPlugins: [remarkCaveats, remarkEnvLinks(env), remarkExternalLinks] },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    starlight({
      title: 'Poplar',
      favicon: '/favicon.svg',
      credits: false,
      customCss: ['./src/styles/global.css'],
      head: [{ tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@500;600&family=Nunito:wght@400;600;800&family=JetBrains+Mono:wght@400;500&display=swap' } }],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/poplar-mc/poplar' }],
      editLink: { baseUrl: 'https://github.com/poplar-mc/poplar-website/edit/main/' },
      components: {
        Header: './src/components/DocsHeader.astro',
        ThemeSelect: './src/components/ThemeToggle.astro',
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
        PageTitle: './src/components/DocsPageTitle.astro',
        Footer: './src/components/DocsFooter.astro',
        EditLink: './src/components/DocsEditLink.astro',
        SocialIcons: './src/components/DocsSocialIcons.astro',
      },
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', slug: 'docs' },
            { label: 'Install', slug: 'docs/install' },
            { label: 'Your first pack', slug: 'docs/your-first-pack' },
          ],
        },
        {
          label: 'Language',
          items: [
            'variables',
            'scores',
            'data',
            'entities',
            'conditions',
            'loops-and-return',
            'functions',
            'commands',
            'namespaces',
            'events',
          ].map((page) => `docs/${page}`),
        },
        {
          label: 'Reference',
          items: ['data-files', 'standard-library', 'project', 'cli', 'pack-output'].map((page) => `docs/${page}`),
        },
      ],
    }),
  ],
});
