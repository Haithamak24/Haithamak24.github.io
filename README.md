# haitham.dev (portfolio v3)

React + Vite. Bilingual (English / Arabic with full RTL), light and dark, tatreez patterns drawn in code.

## Run locally
    npm install
    npm run dev

## Edit content
Every word and fact lives in `src/content.js` (English and Arabic side by side). Photos live in `public/photos/`.
Add your CV as `public/Haitham_Abu_Khaled_CV.pdf`.

## Deploy to GitHub Pages (custom domain: haithamabukhaled.dev, set by public/CNAME)
1. Create a public repo named `Haithamak24.github.io`.
2. `npm run build`
3. Upload everything inside `dist/` to the repo root (or push the whole project and use a Pages GitHub Action).
4. Settings > Pages > Deploy from branch > main / root.
