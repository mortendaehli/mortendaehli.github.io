# My private blog
This is the repository for deploying my personal blog at [www.daehli.no](https://www.daehli.no). This blog is based on [HUGO](https://gohugo.io/) - the worlds fastet framework for building websites. The build time for this page is at the time of writing less than 5ms.

"_Hugo is one of the most popular open-source static site generators. With its amazing speed and flexibility, Hugo makes building websites fun again._"

## Development
Follow the [Hugo quick start guide](https://gohugo.io/getting-started/quick-start/) or simply clone this repo and:

    brew install hugo
    # or
    port install hugo

Then start the development server using:

    hugo server -D

## CI/CD
This blog is automatically deployed using GitHub Actions to GitHub Pages. See .github/workflows for details.
