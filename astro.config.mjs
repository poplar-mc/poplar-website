import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { remarkCaveats } from './src/plugins/remark-caveats.mjs';
import { remarkEnvLinks } from './src/plugins/remark-env-links.mjs';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const requiredLinks = [
  'PUBLIC_REPO_URL',
  'PUBLIC_REPO_CLONE_URL',
  'PUBLIC_RELEASES_URL',
  'PUBLIC_LICENSE_URL',
  'PUBLIC_EDIT_URL',
  'PUBLIC_EXAMPLES_URL',
  'PUBLIC_INSTALL_SH_URL',
  'PUBLIC_INSTALL_PS1_URL',
  'PUBLIC_ZIG_DOWNLOAD_URL',
  'PUBLIC_MISODE_URL',
  'PUBLIC_MC_WIKI_MACROS_URL',
  'PUBLIC_MC_WIKI_CRITERIA_URL',
  'PUBLIC_FONTS_URL',
];
for (const name of requiredLinks) {
  if (!env[name]) throw new Error(`${name} is not set in website/.env. Copy it from website/.env.example`);
}

export default defineConfig({
  markdown: { remarkPlugins: [remarkCaveats, remarkEnvLinks(env)] },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    starlight({
      title: 'Poplar',
      favicon: '/favicon.svg',
      credits: false,
      customCss: ['./src/styles/global.css'],
      head: [{ tag: 'link', attrs: { rel: 'stylesheet', href: env.PUBLIC_FONTS_URL } }],
      social: [{ icon: 'github', label: 'GitHub', href: env.PUBLIC_REPO_URL }],
      editLink: { baseUrl: env.PUBLIC_EDIT_URL },
      components: {
        Header: './src/components/DocsHeader.astro',
        ThemeSelect: './src/components/ThemeToggle.astro',
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
        PageTitle: './src/components/DocsPageTitle.astro',
        Footer: './src/components/DocsFooter.astro',
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
