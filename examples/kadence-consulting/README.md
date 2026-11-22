# Cedar & Field WordPress sample

Cedar & Field is a fictional management consultancy built as a six-page WordPress sample. A single navigation menu connects Home, Services, Method, About, Example and Contact. Gutenberg blocks hold the page content, with the Kadence Theme and editable Kadence Advanced Text headings.

[Download the editable WordPress blueprint](./kadence-sample.zip). The preview images below show the pages running in WordPress. The Contact page is a writing sample with a project brief outline.

## Preview

![Desktop home page](./desktop.png)

[Mobile home page](./mobile.png) · [Gutenberg editor](./gutenberg.png) · [Local verification results](./readback.json)

[Services](./pages/services.png) · [Method](./pages/method.png) · [About](./pages/about.png) · [Example](./pages/example.png) · [Contact](./pages/contact.png)

## Reproduce locally

Use the WordPress Playground CLI with the downloaded bundle.

```sh
npx @wp-playground/cli@3.1.65 server --blueprint kadence-sample.zip --port 9423
```

The bundle contains the blueprint, original page content, and stylesheet. It uses Kadence Theme 1.6.0.1 and Kadence Blocks 3.9.1.2 from the WordPress.org package repository.

You can also [try the hosted WordPress Playground](https://playground.wordpress.net/?blueprint-url=https%3A%2F%2Fraw.githubusercontent.com%2FArron-byte%2Ftongshi-order-csv-check%2F6eb9cddaaa71591a3c1b36166b22ee0ddb41ae4a%2Fexamples%2Fkadence-consulting%2Fkadence-sample.zip). Its first load fetches WordPress and the two Kadence packages.
