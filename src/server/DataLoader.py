import pandas as pd
from .pca_transformer import PcaPipeline
import json

class DataLoader:
    def __init__(self):
        """
        Load data from .csv file and standardize data. Run PCA, and store the data in memory.
        """
        self.bli_data = pd.read_csv(filepath_or_buffer='src/static/data/bli_data.csv')
        labels = self.bli_data['country']
        data = self.bli_data.iloc[:, 1:]
        pca_scaler = PcaPipeline(data, labels)
        self.scaled_bli_data = pca_scaler.get_std_scaled_data()
        self.pca_bli_data = pca_scaler.get_std_pca()


    def get_as_json(self):
        """
        get scaled data and enrich it with the actual values from the BLI-Dataset. Finally, convert the data to a json-string.
        """
        scaled_data = self.scaled_bli_data.to_dict(orient="records")
        bli = self.bli_data.to_dict(orient="records")
        for i, entry in enumerate(scaled_data):
            for key in entry.keys():
                if key == "country":
                    continue
                entry[key] = {"scaled": entry[key], 'actual' : bli[i][key]}
        return json.dumps(scaled_data)

    def get_pca_as_json(self):
        """
        get PCA data and convert them to a json string.
        """
        return self.pca_bli_data.to_json(orient="records")
