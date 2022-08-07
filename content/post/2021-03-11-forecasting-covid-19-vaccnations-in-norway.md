+++
title = "Forecasting Covid-19 vaccinations in Norway"
description = "An attempt to forecast Covid-19 vaccination rates in Norway in from March to July 2021"
author = "Morten Dæhli Aslesen"
date = 2021-03-10T18:10:10.000Z
tags = ["Machine learning", "Time series forecast", "Covid-19"]
draft = false
+++

In this blog post, we will try to predict the Covid-19 vaccination race in Norway. We are all looking forward to getting "back to normal" - and wide vaccination coverage is probably the only realistic way to get there.

The question we are trying to answer is - how is the vaccine coverage going to be during the summer of 2021? I feel that the Norwegian government is pretty optimistic when it comes to vaccination rates. Below is a facsimile from the Norwegian national newspaper [VG](https://www.vg.no) visualizing prognosis data from the [Norwegian Institute of Public Health](https://www.fhi.no).
![Cumulative forecast FHI vaccines Norway Covid-19 neutral](/images/2021/03/FHI-vaccine-prognosis.png)Cumulative forecast of arrived vaccine doses. Facsimile: www.vg.no

# Bayesian time series forecasting with Facebook Prophet

In this post, I would like to balance this prognosis by implementing a naïve time series forecast using [Facebook Prophet](https://facebook.github.io/prophet/) in python. Tweaking and optimizing the algorithm may be the basis of a future blog post. The algorithm is a time series forecast tool based on an additive model with non-linear trends fitted with yearly, weekly and daily seasonality. You can think about it as a Bayesian ARIMAX model but often better and simpler to use. The highlights are:

- Fast and accurate with the computation done in C++ using the Stan framework
- Fully automatic and fairly robust and accurate without any manual efforts
- Easy tweaking and adjustments based on domain competence

# What do we need?

- Python 3.8
- [Full anaconda](https://docs.anaconda.com/anaconda/install/) or install requests and pandas
- Facebook [Prophet](https://facebook.github.io/prophet/docs/installation.html)
- Historic vaccine doses data for Norway

Note! The installation can be a bit tricky with [pip install](https://pip.pypa.io/en/stable/user_guide/) when installing Prophet in Windows. Then you should try conda install like so:

    conda install requests pandas
    conda install -c conda-forge fbprophet
    

# Get the data

Everything is depending on data, so let's go to the [vaccination statistics page for VG.no](https://www.vg.no/spesial/corona/vaksinering/norge/). To get the data we right-click on the graph we are interested in - and click 'inspect' in Chrome. For this, I'm using the number of single vaccination doses that have been injected. The graph in Norwegian has the header "Enkeltdoser satt". Go to the Network tab in the inspect tool and refresh the page. You will find the data loaded. The relevant fields are here
![API requests python scraping website machine learning](/images/2021/03/Skjermbilde-2021-03-11-kl.-20.43.35.png)Relevant areas to look at when trying to find the API Request URL
Based on this we know that we will get the relevant data using a GET request on the URL shown above. To get the data in a pandas DataFrame you can do as following:

    import pandas as pd
    import requests
    
    r = requests.get('https://redutv-api.vg.no/corona/v1/areas/country/vaccinations/timeseries')
    r.raise_for_status()
    data = r.json()
    assert 'items' in data.keys(), 'Failed to find items in the resulting json data structure'
    df = pd.json_normalize(data['items'])

Reading data from VG.no Covid-19 data API
The resulting data looks like this:
![Raw data vaccines Covid-19 Norway historic](/images/2021/03/raw-data.png)Raw data parsed as a Pandas DataFrame
On to do some machine learning!

# Training the Prophet model

To train the model we need a Pandas DataFrame with the date series 'ds' and the observations 'y'. It is also possible to add exogenous regressors if needed.

To get the correct data format we continue with the following code:

    df.rename(columns={'date': 'ds', 'cumulative.doses': 'y'}, inplace=True)
    df = df.loc[:, ['ds', 'y']]

Now we are ready to train the model:

    from fbprophet import Prophet
    
    m = Prophet()
    m.fit(df)

# Forecasting

Making a forecast is simple. First, we create an empty future DataFrame, and then we predict data for this DataFrame:

    future = m.make_future_dataframe(periods=365)
    forecast = m.predict(future)

The data will look something like this with a bunch of other columns:
![FBProphet Prophet time series forecast tabular NorwayCovid-19 vaccines](/images/2021/03/df_forecast-tail.png)Subset of a Prophet forecast showing the predicted value together with upper and lower bound.
To get a feeling of the forecast we want to plot the results:

    import matplotlib.pyplot as plt
    fig1 = m.plot(forecast)
    fig1.show()

The result of our somewhat naïve forecast looks like this:

# Conclusion
![FBProphet Prophet time series forecast vaccines covid-19 ARIMA Norway](/images/2021/03/naive_forecast_vaccines.png)Our naïve vaccine doses time series forecast
If we compare this naïve time series forecast given the little data we have - then we expect to have less than 3 million vaccine doses injected by July. This is dramatically less than the projections by Compared to the approximately 7 million cumulative vaccine doses that the [Norwegian Institute of Public Health](https://www.fhi.no) expects to have by that time.

There are a couple of things to note here. Firstly, we are forecasting based on the actual doses injected and comparing them with the number of doses received. There are delays in the logistics because vaccines are held back to guarantee the second jab in case of a sudden drop in supplies. Further - the production capacity is expected to increase dramatically going forward. Especially in June and July, we are expecting a big jump in deliveries.

Without digging deep in the data underlying the official prognosis, I would expect they are realistic. This is of course a delicate situation, and I'm keeping my fingers crossed that the scale-up goes as expected without further incidents!

I hope you like this!

Here is the [Github Gists](https://gist.github.com/mortendaehli) if you want to run the complete code:

## Update
The government just released a statement that the Oxford vaccine is reducing their estimates for deliveries in Q2. Maybe, unfortunately, the short history is telling us a bit about the future here? I hope I'm wrong!

## Update 2
It seems like this forecast was spot on until June which was surprisingly good given the limited data available 3 months earlier.

The moral of this story is that given enough heterogeneity in the underlying process, the history can in some cases tell us something about the future. But be careful. This experiment was on purpose very naive.