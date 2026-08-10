# md2web

<div align="center">

**A fast, responsive, and intuitive Markdown-to-Web Editor/Preview tool**

[🚀 **Live Demo / Visit Website**](https://md2web.ronnakrit.net)

[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## Features

- **Real-time Markdown Editing** - Live editor with instant preview pane for seamless writing experience
- **Fully Responsive Design** - Intelligent mobile toolbar with context-aware Edit/Preview mode switching
- **Theme Customization** - Background color palette swatches for personalized preview theming
- **Footnote Navigation** - Built-in scroll navigation utility for easy footnote reference
- **Statistics Dashboard** - Real-time character, word, and line count in the footer
- **Dark/Cyberpunk UI** - Clean, modern dark theme optimized for long writing sessions
- **High Performance** - Built with Astro for lightning-fast page loads and interactions
- **Accessibility First** - Semantic HTML and ARIA labels for screen reader compatibility

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Astro](https://astro.build) | Modern static site generator and framework |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JavaScript development |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework for styling |
| [Markdown-it](https://github.com/markdown-it/markdown-it) | Markdown parser and renderer |

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ronnakritnet/md2web.git
cd md2web
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:4321`

### Building for Production

```bash
npm run build
# or
pnpm build
# or
yarn build
```

The optimized build will be in the ` dist/` directory.

---

## Project Structure

```
md2web/
├── src/
│   ├── components/          # Astro components
│   │   ├── Editor.astro    # Main editor component
│   │   ├── Toolbar.astro   # Formatting toolbar
│   │   ├── ColorSwatches.astro  # Theme color picker
│   │   ├── Header.astro    # Top navigation bar
│   │   ├── EditorPane.astro    # Markdown editor pane
│   │   ├── PreviewPane.astro   # Preview render pane
│   │   └── UrlModal.astro  # URL generation modal
│   ├── pages/              # Route pages
│   │   └── index.astro    # Main application page
│   ├── styles/             # Global styles
│   │   └── global.css
│   └── utils/              # Utility functions
│       ├── markdown.ts    # Markdown parsing
│       ├── editor/         # Editor-specific utilities
│       │   ├── markdown-formatter.ts
│       │   ├── responsive-view.ts
│       │   ├── draft-persistence.ts
│       │   ├── url-generator.ts
│       │   └── scroll-navigation.ts
│       └── debounce.ts
├── public/                 # Static assets
└── package.json
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Ronnakrit Wananukan**

- Website: [md2web.ronnakrit.net](https://md2web.ronnakrit.net)
- GitHub: [@ronnakritnet](https://github.com/ronnakritnet)
- Project: [md2web](https://github.com/ronnakritnet/md2web)

---

<div align="center">

**Built with ❤️ using Astro and Tailwind CSS**

</div>
