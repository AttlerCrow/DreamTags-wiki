import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DreamTags',
  description: 'Simple and lightweight nametag and health bar plugin for Paper and Folia servers',
  lang: 'en-US',

  // Repository name on GitHub Pages. Change this if the wiki repo is renamed,
  // or set it to '/' when serving from a custom domain.
  base: '/DreamTags-wiki/',

  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#5b7cfa' }]
  ],

  themeConfig: {
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/config' },
      { text: 'Layouts', link: '/layouts/' },
      { text: 'Placeholders', link: '/placeholders/' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'How it works', link: '/guide/how-it-works' },
          { text: 'Commands & permissions', link: '/guide/commands' }
        ]
      },
      {
        text: 'Configuration',
        items: [
          { text: 'config.yml', link: '/config' },
          { text: 'Packs', link: '/packs/' }
        ]
      },
      {
        text: 'Content',
        items: [
          { text: 'Images', link: '/images' },
          {
            text: 'Layouts',
            link: '/layouts/',
            collapsed: false,
            items: [
              { text: 'Images', link: '/layouts/images' },
              { text: 'Texts', link: '/layouts/texts' },
              { text: 'Stacks', link: '/layouts/stacks' },
              { text: 'Effects', link: '/layouts/effects' },
              { text: 'Components', link: '/layouts/components' },
              { text: 'Listeners', link: '/layouts/listeners' },
              { text: 'Conditions', link: '/layouts/conditions' }
            ]
          },
          { text: 'Tags', link: '/tags' },
          { text: 'Damage indicators', link: '/damage-indicators' },
          { text: 'Popups', link: '/popups' }
        ]
      },
      {
        text: 'Placeholders',
        items: [
          { text: 'Syntax', link: '/placeholders/' },
          { text: 'Built-in', link: '/placeholders/built-in' },
          { text: 'From other plugins', link: '/placeholders/hooks' }
        ]
      }
    ],

    outline: [2, 3],

    editLink: {
      pattern: 'https://github.com/AttlerCrow/DreamTags-wiki/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'DreamTags documentation',
      copyright: 'Copyright © 2026'
    }
  }
})
