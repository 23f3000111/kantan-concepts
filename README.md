# Kantan Food: website revamp pitch

Two things live here:

- `index.html` is the proposal for Kantan Food Asia Sdn Bhd. It covers the audit of kantanfood.com, a before/after slider, what stays, what they get, the three packages, the timeline, an ROI calculator and next steps.
- `flagship/` is the working Flagship demo of the revamped site: home, shop, product, OEM, recipes and trade portal.

## View it

Serve the folder rather than double-clicking files. The YouTube recipe videos and the map need a real URL.

```
python -m http.server 8765
```

Then open http://127.0.0.1:8765. The repo also works as-is on GitHub Pages (`.nojekyll` is included).

## Before sending it to the client

- In `index.html`, find the `EDIT:` comment in the "Next steps" section and replace the name, studio, WhatsApp number and email with your own.
- Packages show timelines but no prices. Add prices there if you want them on the page.

## Presenting the demo

- Switch on **Show what's new** in the dark bar at the top. Every new feature gets a numbered pink flower. Tap one to see what it does and which package includes it (Refresh, Revamp or Flagship).
- Try **EN / BM / 中文** in the header and in the Tanya Kantan chat.
- Good chat prompts: "What can I cook with rendang paste?", "I want my own paste brand", "Track my order".
- Checkout runs a fake DuitNow QR payment that confirms by itself. No real payment, WhatsApp message or email is sent anywhere.

## What is real and what is sample data

- Real, from kantanfood.com and Kantan's pack artwork: product names, prices, pack sizes, serving, spice and cooking-time facts, recipes and video IDs, the rendang ingredient list, certificates, the Okmaya case study, trade shows, distributors, founders, and the marketplace review quotes.
- Sample or concept: gift box and pantry box prices, trade-portal prices and account data, the demo checkout address, and the factory tour video, which would be filmed in the Flagship shoot.
- Some mood photos (curry laksa, rendang, spices and similar) are from Unsplash under its free licence. The final site would use Kantan's own photography.
