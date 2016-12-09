# Processeer

Processeer is an online report builder. It allows you to create reports by
fetching data from public APIs and transforming that data into anything you
like using the power of JavaScript. It then takes care of nicely displaying
that data for you, in tables or charts for example.

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

#### Table

Displays data as a table. Uses [Griddle](https://griddlegriddle.github.io/Griddle/) ([documentation](https://griddlegriddle.github.io/Griddle/quickstart.html)).

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

See [Griddle documentation about properties](https://griddlegriddle.github.io/Griddle/properties.html)
for a list of options you can pass to customize your table.

#### Tables

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

#### Line Chart

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

See the [Chart.js documentation about Line Charts](http://www.chartjs.org/docs/#line-chart-dataset-structure)
for a list of options to customize your datasets.

## Installation

```bash
cd processeer

# Create a Kinto instance
docker-compose up kinto -d

# Set up permissions in Kinto
source storage/init.sh

# Start the web site
cd client
npm start
```

By default the Kinto database is exposed on [localhost:8888](http://localhost:8888/)
and the Processeer web site is exposed on [localhost:8080](http://localhost:8080/).
