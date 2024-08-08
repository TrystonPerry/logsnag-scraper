# Logsnag Scraper

## Why

I couldn't find a public API for getting Logsnag data, so I wrote a scraper. Love the product, but wtf why is the data vendor locked?

## What do?

git clone this codebase, and inspect the fetch requests on app.logsnag.com to get your projectId and Authorization token to use this.

Declare them in a .env file:

```
PROJECT_ID=
AUTHORIZATION=
```

Then run `npm i` and `node index.js`

If you run into any other issues, try copying the entire fetch request from the browser tools and replace all headers and context in the mock request in index.js with that.
