# BOBY — initial design samples

This package contains four interactive Hebrew RTL design samples:

1. Style guide
2. Homepage
3. Artwork page
4. Corporate gifting page

The artwork and photography areas are deliberate placeholders. They keep the
review focused on layout, typography, hierarchy, commerce clarity and mobile
behavior.

## Fastest free publishing option: Netlify

Use the separate `BOBY-static-preview.zip` file:

1. Create a free Netlify account.
2. Open Netlify Drop at https://app.netlify.com/drop
3. Unzip `BOBY-static-preview.zip` on your computer.
4. Drag the unzipped folder onto the Netlify Drop page.
5. Netlify will return a public preview URL.

No coding or build step is required.

## Publishing the editable source

The source can also be hosted through Vercel or Netlify:

1. Create a new personal GitHub repository.
2. Upload everything in this source folder.
3. In Vercel or Netlify, choose “Import an existing project.”
4. Select the repository and publish with the detected defaults.

## Local preview

Requires Node.js 22 or newer:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
