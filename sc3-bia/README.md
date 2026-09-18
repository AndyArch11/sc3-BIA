# Business Impact Assessment (BIA) - Single Page Application

This project provides a Business Impact Assessment (BIA) form in a simple Single Page Application (SPA) built using React. 

## Features

- A Business Impact Assessment form that calculates SLA, RTO, RPO and Application Criticality Values
- Exports results to an Excel spreadsheet for ongoing development

## Project Structure

```
sc3-bia
├── dist
│   ├── assets
│   │   ├── index-xxxx.css           # Compiled CSS styles
│   │   ├── index-xxxx.js            # Main application bundle
│   │   ├── vendor-xxxx.js           # Core vendor libraries bundle
│   │   ├── ExcelExport-xxxx.js      # Lazy-loaded Excel export bundle
│   │   └── rolldown-runtime-xxxx.js # Module runtime helper
│   └── index.html                   # Compiled root HTML file
│ 
├── node-modules           # supporting JavaScript libraries
│ 
├── public
│   └── robots.txt         # Web crawler directives
├── src
│   ├── index.jsx          # Entry point for the React application, mounts App
│   ├── index.css          # CSS styles for the React application
│   ├── App.jsx             # Main App component, imports BIAForm
│   ├── App.css            # CSS styles for the application
│   └── components
│       └── BIA.css         # Stylesheets
│       └── BIAForm.jsx     # BIA SPA form
│       └── BIAInputForm.jsx # Captures BIA details
│       └── BIAIntro.jsx     # Guidance on performing a BIA
│       └── BIAReport.jsx    # BIA report
│       └── BIATable.jsx     # BIA table
│       └── ExcelExport.js   # ExcelJS workbook generator, lazy-loaded on export
│   ├── App.test.jsx         # App-level rendering tests
│   └── setupTests.js        # Vitest and Testing Library test configuration
├── index.html               # Vite root entry HTML template
├── vite.config.mjs          # Vite and Vitest configuration
├── eslint.config.mjs        # ESLint flat configuration
├── .stylelintrc.json        # Stylelint configuration
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

### Clone the repository:
 
### `git clone https://github.com/AndyArch11/sc3-BIA.git`

change to the project directory
### `cd sc3-bia`

### Install dependencies

In the project folder

### `npm install`
### `npm install exceljs`
### `npm install react-router-dom`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the Vite development server.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the Vitest test runner.

### `npm run test:watch`

Runs Vitest in interactive watch mode for active development.

### `npm run lint`

Performs a lint parse across the project.

### `npm run lint:css`

Performs a lint parse across the project's CSS files.

### `npm run build`

Builds the app for production to the `dist` folder using Vite.\
It correctly bundles React in production mode and optimises the build for the best performance.
The build process bundles the deployment package into separate chunks for faster downloads. The Excel bundle is lazy loaded at the time of requesting an Excel extract.

When making updates to the code, ensure that you update the `Version` number in `BIAForm.jsx`.

The build is minified and the filenames include hashes for cache busting.\
Your app is ready to be deployed!

If launching as an embedded SPA, configure the following entry points in the host HTML page:

```html
<!-- 1. Include CSS -->
<link rel="stylesheet" href="./assets/index-dqPTFezv.css">

<!-- 2. Target container -->
<div id="root"></div>

<!-- 3. Entrypoint script (loads all other modules automatically) -->
<script type="module" src="./assets/index-7ldPnS8V.js"></script>
```
Or embedded as an `<iframe>` for CSS/JS isolation
```html
<iframe
	src="/path-to-app/index.html"
	width="100%"
	height="900px"
	style="border: none;">
</iframe>
```
N.B. Current Vite build generates a new hash with each build

```pwsh
npm run build

> sc3-bia@0.1.0 build
> vite build

vite v8.3.0 building client environment for production...
✓ 33 modules transformed.
computing gzip size...
dist/index.html                             0.80 kB │ gzip:   0.41 kB
dist/assets/index-dqPTFezv.css             34.43 kB │ gzip:   6.14 kB
dist/assets/rolldown-runtime-W7wSyTde.js    0.97 kB │ gzip:   0.56 kB
dist/assets/index-7ldPnS8V.js             102.52 kB │ gzip:  19.18 kB
dist/assets/vendor-DSNEASXB.js            218.83 kB │ gzip:  68.25 kB
dist/assets/ExcelExport-Bw_TE2Oq.js       937.79 kB │ gzip: 259.82 kB
```
To not have the file names being regenerated with each build, update `vite.config.mjs` with:
```js
build: {
	chunkSizeWarningLimit: 1200,
	rollupOptions: {
		output: {
			entryFileNames: 'assets/sc3-app.js',
			chunkFileNames: 'assets/[name].js',
			assetFileNames: 'assets/[name].[ext]',
		},
	},
}
```


