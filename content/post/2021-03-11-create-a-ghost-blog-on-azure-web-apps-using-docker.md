+++
title = "Create a Ghost Blog on Azure Web Apps Using Docker"
description = "This is how you create a Ghost blog using Azure Web Apps and Docker"
author = "Morten Dæhli Aslesen"
date = 2021-03-10T18:10:10.000Z
tags = ["Azure", "Web" "Apps", "Docker"]
draft = false
+++

Have you ever wondered how you can host your tech-blog? If you are like me, and you've built countless prototypes from scratch. They all work and do what they are meant to do. But something is off. They just don't look any good, and they are not that user-friendly. I recently came across a solution, inspired by a fellow [Bouvet colleague](https://www.frodehus.dev/), I'm now running my very own blog in the cloud. No more 1990s feel and lack of proper UX. This is the real deal for modern blogging and content publishing. It even comes with a bunch of easy to integrate applications - and you can easily monetize your content if that's your flavor.

I'm a pragmatic techie. I like to see results, and I love to adopt and contribute to open source when I find the opportunity. So why do it the hard way? There are two general options. You can pay for official managed to host such as [Ghost(Pro)](https://ghost.org/), or you can host it yourself and host it any way you like. The out of the box solutions are:

1. Ubuntu server
2. **Docker**
3. Local install on macOS, Windows, or Linux
4. Install Ghost Core from source

Having hosted other web services myself, and being fully aware of the dangers lurking on the internet - I find it more convenient to run it and scale it as a containerized web service. The choice here is simple. I'll go for docker and Azure Web App Service. The Docker since it has a [Ghost Docker Official Image](https://hub.docker.com/_/ghost/). Azure since it's what I'm currently using at work, and I already have a private subscription going.

The Azure hosting costs will be approximately 10 USD per month.

# Testing Ghost locally

Let us try to run the Ghost Docker Official Image locally. If you are running Windows, then you can easily install [Docker Desktop for Windows from here](https://hub.docker.com/editions/community/docker-ce-desktop-windows). If you run Linux, macOS, or something else - then you can go look for [installation guides here](https://docs.docker.com/engine/install/).

With the Docker service running, all you have to do is to write the following in your terminal window:

    docker run -d --name some-ghost -e url=http://localhost:3001 -p 3001:2368 ghost

Go to [http://localhost:3001/](http://localhost:3001/) in your browser and you are up and running!
![](/images/2021/03/ghost-local-docker.png)Ghost blog running locally in docker on http://localhost:3001/
This is cool! You already have a Ghost blog, and there was almost no effort at all. Me being a pragmatic techie would call that a great win! This is now working, but there are a few drawbacks... Go ahead and set up your admin account at [http://localhost:3001/ghost](http://localhost:3001/ghost) - try publishing some random text and some content. Go back to the main page and verify that your post is there. Then go ahead and restart the service using

    docker restart some-ghost

Check your blog. What is the result? Ouch... it's all gone! What a disaster! 🤯

Don't you worry? This is by design. The default Ghost configuration runs a local SQLite database - and running a Docker service means that everything is wiped when you restart the service. If your blog grows and you need to scale up to multiple containers - or your container fails - then you want to have storage outside of the container. Have a look at the [twelve-factor app](https://12factor.net/) if you are interested in modern web applications and considerations when building one.

On Azure, we will solve this by having static content (images, settings, themes) on an Azure Blog Storage and by manually backing up the database (the actual content such as blog posts). I'll also guide you on how to connect to a MySQL-database.

# Ghost on Azure

This is the process:

1. Create an Azure account
2. Create a Resource Group
3. Create a Web App Service resource with Ghost Docker image
4. Add an Azure storage account
5. Add MySQL database (optional)
6. Connect to your custom domain (optional)
7. Add an SSL certificate for HTTPS
8. Updating to the latest Ghost image

Let's get going!

### 1. Creating an Azure account

The first thing you need is to [create an Azure account](https://azure.microsoft.com/en-us/free/) if you don't already have one.

### 2. Creating a Resource Group

Then you create a resource group. This is a [logical organization of resources that are created in Azure](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal#what-is-a-resource-group). Alternatively, you can skip this because the next step will create one anyway. You simply click 'create' as shown below.
![](/images/2021/03/Create-resource-group.png)Create a new Azure resource group
Then you create a name and chose a region. The name is prefixed with "rg-" as a best practice suggestion. The choice of the region does not have an impact on this project, but I prefer to choose the region closes to me. See the example below:
![](/images/2021/03/Create-resource-group-2.png)Creating a resource group
Click Review + create, and then Create.

### 3. Creating the Web App Service with Ghost Docker image

On the [main page of the Azure portal, ](https://portal.azure.com/#home)you can create the Web App Service by clicking "+ Create a resource"
![](/images/2021/03/create-resource.png)Create resource in Azure portal
Search for Web App by Microsoft and click create:
![](/images/2021/03/Microsoft-web-app.png)Create Web App in Azure portal
Now is the time for some details:

1. **Resource Group**: the one you just created
2. **Name**:  Your unique name for your blog. The domain will be <your-unique-name>.azurewebsites.net
3. **Publish**: Docker Container
4. **Operating System**: Linux
5. **Region**: The same as for your Resource Group

Then you click 'Create new' under the Linux plan. I suggest you go for a "Basic BI" plan. It should look something like this:
![](/images/2021/03/create-web-app.png)Create a Azure Web App
Click next: Docker and go for **Option **Single Container. Select **Image Source** which should be Docker Hub. We are using the **Access Type** Public and **Tag **should be the [latest image for Ghost on Docker Hub](https://hub.docker.com/_/ghost/) which at the moment is ghost:3.42. It should look something like this:
![](/images/2021/03/create-web-app-docker.png)Selecting the official Ghost Docker Image on Docker Hub
Go on to **Review and create **then **Create**. Your web app will deploy within a few minutes. You will find the status in the notification bar on top. Wait for it to finish, and click **Go to resource**. And click **Browse** to go directly to your new blog.
![](/images/2021/03/image-1.png)
It will take a few additional minutes before it's live. Exciting! It will look like this:
![](/images/2021/03/ghost-live-on-azure.png)
You can go on and create a blog post if you like - but unfortunately, we have the same problem here as we had earlier. If you restart the service, then all is lost. So let's solve this by adding a storage account and a database.

### 4. Add an Azure storage account

***Note****: Because of an update from Azure you will not be able to synch the SQLite database on a storage account. This had me waste some time because most sources will tell you to do the following steps differently. This changed in February 2021, so be aware! I hope Microsoft fixes this issue soon because it's quite convenient to use local SQLite databases for this kind of light web application, for prototyping and to get projects quickly going without a big production database.*

Find your Resource Group and search for 'Blob' - the first thing that pops up should be a **Storage Account **(This is annoying, but if I search for Storage Account I won't find it). Go on and click **Create**.
![](/images/2021/03/create-storage-account.png)Create Azure Storage Account
A few important details here. Fill in the same **Resource group** as before, and give your storage account a unique **Storage account name**. I suggest st<some-name>01 as suggested by Microsoft. The **Location **should be the same as before, **Performance** can be Standard for now. The **Account kind** should be StorageV2 since this is the current version. **Replication** you can leave as standard. Everything else can be left as Standard so head on to **Review + create** and click **Create.**

Head over to the Storage Account you just created and create a new **File share** like this:
![](/images/2021/03/create-file-share.png)Create File share in an Azure Storage Account
I've set the **Name to **ghost-file share and set the **Quota** at 10GB. I suggest you put a higher limit and change the Tier as needed.

Head back to your Web App Service, and find the Configuration tab under **Settings**. Go to **Path mappings** and click **New Azure Storage Mount**. Here you will fill **Name** to something like ContentFilesVolume. Select the **Storage Account** you just created, select the **Storage container **and create the **Mount path***/var/lib/ghost/content_files* - this is an important path. This is where the Docker image will store the static content files such as images, settings, and themes. Click **OK. **See screenshot below:
![](/images/2021/03/mount-storage.png)
Move on to **Application settings** and click **+ New application setting**. Here we will add:

- **URL: **https://<name-of-service>.azurewebsites.net or your custom domain
- ***paths__contentPath***: /var/lib/ghost/content_files/
- ***privacy__useUpdateCheck***: false

The first, ***url***, will make sure the internal URLs are correct. So change this to your domain later. ***paths__contentPath*** makes sure that Ghost writes content files to our mounted **File share**. ***privacy__useUpdateCheck*** we set this false to control updates ourselves. Make sure to click **Save**. These are all Environmental variables that will be passed and available in the Docker container. [More configuration details can be found here](https://ghost.org/docs/config/).

Now. Restart the Web Application and you will see that it crashes. Ouch...
![](/images/2021/03/ghost-casper-missing.png)Ghost complaining that the Casper theme is missing
For some reason, Ghost does not migrate the default Casper theme when migrating over to an external File share. So we need to add this ourselves. Head back to the Storage account and click **Storage Explorer (preview) **or for a better user experience open the File share in the [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) app.

Create a new folder called **themes** on your File share. Then head over to [Github for the Casper theme files](https://github.com/TryGhost/Casper). Place everything inside a folder called **casper** and restart the service. The folder should look like this:
![](/images/2021/03/casper-theme-files.png)Adding the Casper theme files to the Files share
The service should come back up and look as before. This time we are storing the content files externally on a Storage Account. This gives you everything you need in terms of redundancies, scaling, and backup abilities. Make sure that the blog is back up.

### 5. Add MySQL database (optional)

To add a MySQL database you will head back to **Application settings** where you configures the File share and the url earlier. Now you will add the following

- **database__client**: mysql
- **database__connection__database**: <database-name>
- **database__connection__host**: <server-host>
- **database__connection__password**: <password>
- **database__connection__port**: <port>
- **database__connection__user**: <username>@<server-name>

Restart the server. If everything is Okay, then you should see the ghost tables being created in the database within a few minutes.

### 6. Connect to your custom domain (optional)

Coming soon!

### 7. Add an SSL certificate for HTTPS

Coming soon!

### 8. Update to the latest Ghost image

Coming soon!

## Finally

Now you are all set! Head on over to your newly created blog and register your admin account by going to <your-domain>/ghost.

I hope you like it!