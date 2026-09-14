# Change service pages in the admin panel

1. Open /admin/ and sign in with your administrator account.
2. Choose **Pages**, then open **Services** or the service detail page you want.
3. Open its section. Edit the heading, description, button text/link, image, or the cards inside it. You can add, remove and reorder sections and cards.
4. Each image control shows the current picture. Choose an existing image, choose **No image**, or expand **Upload a new image**.
5. For an upload, choose a PNG, JPG or WebP up to 8 MB, describe the picture, and select **Upload & use image**. The upload becomes available in other image selectors and the Media library.
6. Choose **Save draft** to keep your changes privately. Use **Preview** to check the page in its public design.
7. Choose **Publish** when ready. The public website updates without a Render deployment.

The hero, section images, service cards, project examples, FAQ pictures, hero highlights, icons, copy, links and SEO sharing image are editable. Hero picture captions and card button text also have controls. Header and footer content are managed in their reusable layouts and menus.

Uploads are stored in the database, so they survive Render restarts and deployments. Publishing is restricted to administrators; editors can prepare drafts. Later image migrations only replace recognised old defaults, preserving custom uploads.

## Image set

The service overview and eight detail pages contain 120 unique image placements after this update: 99 newly generated replacements, 12 existing marketing card images and 9 retained overview images. Logo reuse in the global header and footer is intentional.

The generated scenes are illustrative service photography, not customer case studies. Built-in OpenAI image generation was used. The asset paths and complete prompts are in public/assets/service-image-prompts.md; image-to-section mappings are in shared/service-section-images.json.
