import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),

		vite:{
			server:{
				proxy:{
					'/api/sendmail':{
						target: 'http://localhost:5001/lab2-o-p/us-central1/sendmail',
						changeOrigin: true,
						secure: false,
						rewrite:(path ) => path.replace(/ *\/api/, '')
					}
				}
			}

		}
	}
};

export default config;
