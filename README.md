# netlify-og-image [![Netlify Status](https://api.netlify.com/api/v1/badges/78d33f83-2b8a-4d63-b137-5a8ea463ac87/deploy-status)](https://app.netlify.com/sites/netlify-og-image/deploys)

Ready to use `og-image` generator for netlify functions. Includes CSS-reset and bundler to remove styling headaches.

## Usage

- `yarn dev` – to preview template
- `yarn build` – build package

## Example

This string
`https://netlify-og-image.netlify.app/.netlify/functions/og-image/template/template?title=netlify-og-image&description=Ready%20to%20use%20og-image%20generator%20for%20netlify%20functions` outputs:

![og-image](https://netlify-og-image.netlify.app/.netlify/functions/og-image/template/template?title=netlify-og-image&description=Ready%20to%20use%20og-image%20generator%20for%20netlify%20functions)

## Credits

- [Generating OpenGraph images with Netlify On-demand builders by Michael Heap](https://michaelheap.com/og-image-netlify-on-demand-builders/)
- [Dynamically Generating Thousands of OG Images by Aaron Francis](https://www.netlify.com/blog/dynamically-generate-open-graph-image-variants/)
