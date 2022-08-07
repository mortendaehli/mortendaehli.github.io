+++
title = "HUGO"
description = "My current blog platform"
author = "Morten Dæhli Aslesen"
date = 2021-12-11T20:10:21+01:00
tags = ["Blog", "Hugo", "goLang"]
draft = false
+++

## Introduction

This is a guide to create your own static Hugo blog platform. It will deploy automatically using GitHub Actions and
be hosted on GitHub Pages. With one simple command you can also refer it to your own custom domain using a Canonical Name record (CNAME).

Follow along and replace my username "mortendaehli" with your username, and my domain www.daehli.no with your domain
if you chose to use your own custom domain.

## Step 1. Install Hugo

Goto [Hugo Install](https://gohugo.io/getting-started/installing) and install the appropriate version according 
to your architecture. For MacOS you simply install Hugo using HomeBrew:

    brew install hugo

## Step 2. Create your new site

To keep things simple I usually create a git repository on GitHub with a README, license and .gitignore.
Then I clone the repo.

    git clone https://github.com/mortendaehli/mortendaehli.github.io
    hugo new site mortendaehli.github.io --force
    cd mortendaehli.github.io.git

Note that we force "hugo new site" since the git repo already exists with that name. Replace "mortendaehli" with your GitHub
user-name.

## Step 3. Download and activate a theme

For this blog I used ghostwrite as a theme.

1. Go to [Ghostwriter](https://github.com/jbub/ghostwriter) and download the repository. 
2. Unzip the project and rename the folder to only "ghostwriter". 
3. Copy the whole folder into themes. 
4. Copy the files from /themes/exampleSite into the root folder of your project.
5. Configure config.yml to your liking

## Step 4. Personalize / add content

Now you are free to either edit the existing example content or write your own content.

All you need to do in order to launch the development server is:

    hugo serve

You will now find you website at [http://localhost:1313/](http://localhost:1313/)

## Step 5. Deploy to GitHub Pages using GitHub Actions

Write the following content into /.github/workflows/gh-pages.yml

    name: GitHub Pages

    on:
      push:
        branches:
          - main  # Set a branch name to trigger deployment
      pull_request:
    
    jobs:
      deploy:
        runs-on: ubuntu-20.04
        concurrency:
          group: ${{ github.workflow }}-${{ github.ref }}
        steps:
          - uses: actions/checkout@v2
            with:
              submodules: true  # Fetch Hugo themes (true OR recursive)
              fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod
    
          - name: Setup Hugo
            uses: peaceiris/actions-hugo@v2
            with:
              hugo-version: latest
    
          - name: Build
            run: hugo --minify
    
          - name: Deploy
            uses: peaceiris/actions-gh-pages@v3
            if: ${{ github.ref == 'refs/heads/main' }}
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./public
              # cname: www.daehli.no

All you have to do is to uncomment # cname at the end to use a custom domain, 
and replace "main" branch if you use "master" or similar.

## Step 6. Have fun

Go check that everything is working:
- GitHub Actions should run when you push to GitHub [https://github.com/mortendaehli/mortendaehli.github.io/actions](https://github.com/mortendaehli/mortendaehli.github.io/actions)
- Check that GitHub Pages has been activated [https://github.com/mortendaehli/mortendaehli.github.io/settings/pages](https://github.com/mortendaehli/mortendaehli.github.io/settings/pages)
- Check our your GitHub Pages page [https://mortendaehli.github.io/](https://mortendaehli.github.io/) or in my case [https://www.daehli.no](https://www.daehli.no)

Enjoy, and have fun!
