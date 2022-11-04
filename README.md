# Linked View Visualisation
I created this visualisation during my master's degree. The data is from https://www.oecdbetterlifeindex.org.
The data was cleaned and manipulated to create the visualisation. For example, empty values were replaced with their corresponding median. 


## Start server:

To get started, you need to install the requirements in the virtual environment of your choice and activate it. 
To start the server, run the following command:
```
./run_flask.sh
```
This will start the server on port 4000. You can edit  `run_flask.sh`, if you want to start the server on another port.

Open a browser and go to `localhost:4000` (or the port that you adjusted in the script) and you will see the rendered charts. I tested the charts with Safari and Firefox.
The solution is optimized for a 13" notebook in fullscreen. 

## Visualisation

The project will allow you to explore the Better life index data. Here is a screenshot from the tool:

![ screenshot of isualization](screenshot_vis.png?raw=true "Visualisation Screenshot")