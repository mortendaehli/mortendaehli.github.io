+++
title = "SQL Injections"
description = "How to scan and inject with SQL using Python"
author = "Morten Dæhli Aslesen"
date = 2021-12-11T22:08:24+01:00
tags = ["Security", "Python", "SQL"]
draft = false
+++

## Introduction

This is a work-in-progress code for scanning and injecting SQL commands. The code was initially created in order to 
test SQL injections for [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)

The project is located at [https://github.com/mortendaehli/owasp-sql-injections](https://github.com/mortendaehli/owasp-sql-injections)

## Development Setup

I am solving this using mostly python 3.9, but in order to build a proper environment you need to install [Poetry](https://python-poetry.org/) and run

```bash
git git@github.com:mortendaehli/owasp-sql-injections.git
cd owasp-sql-injections
poetry install
```

## Host OWASP Juice Shop for testing

Using Docker we can spin up an instance of the Juice Shop:

```bash
docker run --rm -p 3000:3000 bkimminich/juice-shop
```

Then you will be able to access it on [http://localhost:3000](http://localhost:3000)
