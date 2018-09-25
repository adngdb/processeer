# Processeer

Processeer is an online report builder. It allows you to create reports by
fetching data from public APIs and transforming that data into anything you
like using the power of JavaScript. It then takes care of nicely displaying
that data for you, in tables or charts for example.

## Important notes

This is an **alpha version**. It has some features, the ones I deemed the
most important, but lacks many more that would make it a truly good tool
(the main missing feature is forking, the second main missing feature is an
actual permission system). It is **probably not secured**, as I haven't done
much to verify that it is. The custom JavaScript is executed using the
[jailed library](https://github.com/asvd/jailed), which supposedly is secured,
but there might be a lot of other ways to attack the website. Please please
do not use it for sensitive things.

## Core Concepts

### Blocks

A Block is a basic unit of logic in Processeer. It has 3 main components:

 - Parameters - variables that can have a default value and can be set in a form, via the URL or from a previous Block
 - Models - a list of API endpoints to fetch, with associated parameters
 - Controller - a JavaScript ``transform`` function that takes the parameters and models data as input and can output whatever you like

Blocks can be chained. In that case, the output of each Block will be passed as
the input of the next Block in the chain. The output of the last Block will be
displayed.

### Reports

A Report is a list of Blocks, that can be executed to display data. Blocks are
called in order, and the output of the last Block in the chain will be parsed
and displayed using front-end libraries, depending on the format of that data.

## Documentation

### Supported Outputs

#### Table :: [example](http://processeer.io/report/89df2c14-886f-4847-8599-9ea622e36dac)

Displays data as a table. Uses React Table ([documentation](https://react-table.js.org/)).

```json
{
    "type": "table",
    "title": "My Nice Table",
    "options": {},
    "data": [
        {
            "Field 1": "foo",
            "Field 2": "bar"
        },
        {
            "Field 1": "fizz",
            "Field 2": "bizz"
        }
    ]
}
```

See [React Table's documentation about properties](https://react-table.js.org/)
for a list of options you can pass to customize your table.

#### Tables :: [example](http://processeer.io/report/8290e71b-f502-4fd3-b92e-52f4bae4673c)

Same as Table, but it will show several tables instead of just one.

```json
{
    "type": "tables",
    "title": "My Nice Tables",
    "data": [
        {
            "options": {},
            "data": [
                {
                    "Field 1": "foo",
                    "Field 2": "bar"
                },
                {
                    "Field 1": "fizz",
                    "Field 2": "bizz"
                }
            ]
        }        
    ]
}
```

#### Line Chart :: [example](http://processeer.io/report/a125b734-61ce-4e33-bab1-7b0fec66de69)

Displays a line chart. Uses [Chart.js](http://www.chartjs.org/) ([documentation](http://www.chartjs.org/docs/)).

```json
{
    "type": "chart:line",
    "title": "My Little Chart",
    "data": {
        "labels": ["Point 1", "Point 2"],
        "datasets": [
            {
                "label": "Line 1",
                "data": [ 12, 24 ]
            }
        ]
    }
}
```

See the [Chart.js documentation about Line Charts](http://www.chartjs.org/docs/latest/charts/line.html)
for a list of options to customize your datasets.

## Installation

Processeer runs in a docker environment. You need docker and docker-compose to run it locally. [Example nginx configuration files](https://github.com/adngdb/processeer/tree/master/storage/conf) are provided for a production installation.

To run Processeer locally, run the following commands:

```bash
cd processeer

# Create a Kinto instance.
docker-compose up kinto -d

# Set up permissions in Kinto (only the first time).
source storage/init.sh

# Start the web site.
cd client
npm start
```

By default the Kinto database is exposed on [localhost:8888](http://localhost:8888/)
and the Processeer web site is exposed on [localhost:8080](http://localhost:8080/).
