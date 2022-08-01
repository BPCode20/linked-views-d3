from flask import Flask
from flask import render_template
from server.DataLoader import DataLoader

app = Flask(__name__)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True


data_loader = DataLoader()

@app.route("/")
def index():
    """
    return index.html with transformed and scaled data.
    """
    return render_template("index.html", bli_data=  data_loader.get_as_json(), pca_data=data_loader.get_pca_as_json())
