from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pandas as pd
import numpy as np


class PcaPipeline:

    def __init__(self, X, y):
        """
        Initialize and transform BLI-data with StandardScaler()
        :param X: Pandas DataFrame
        :param y: Labels
        """
        self.labels = y
        std_scl = StandardScaler()
        self.scaled_bli = pd.DataFrame(std_scl.fit_transform(X), columns=X.columns)

    def get_std_scaled_data(self):
        """
        Enrich the data with labels and return the scaled bli-data.
        """
        return pd.concat([self.labels, self.scaled_bli], axis=1)

    def get_std_pca(self):
        """
        Fit and transform the scaled BLI-data into a PCA. Enrich the data with labels.
        :return: Pandas DataFrame()
        """
        pca = PCA(n_components=2)
        pca_values =  pd.DataFrame(np.array(pca.fit_transform(self.scaled_bli)), columns=['x', 'y'])
        return pd.concat([self.labels,pca_values], axis=1)
