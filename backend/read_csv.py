import pandas as pd
import numpy as np

class CSV:

    def __init__(self, dir, file_path) -> None:
        self.dir = dir
        self.file_path = file_path

    def __str__(self):
        return "Dir: %s\nFile Path: %s" % (self.dir, self.file_path)

    # Used to get the feature
    def read_file_for(self, feature, side):
        df = pd.read_csv(self.file_path)

        res = df[feature].tolist()

        res.sort() # Sorts in ascending order

        q1 = np.quantile(res, 0.25)
        q3 = np.quantile(res, 0.75)
        interQuantileRange = q3 - q1
        mi = q1 - 1.5 * interQuantileRange
        ma = q1 + 1.5 * interQuantileRange
        med = np.quantile(res, 0.5)

        crit = {
            "q1": q1,
            "median": med,
            "q3": q3,
            "interQuantileRange": q3 - q1,
            "min": mi,
            "max": ma,
            "key": side
        }

        return crit

    def generate_list(self, feature):
        df = pd.read_csv(self.file_path)

        res = df[feature].tolist()
        res.sort()

        return res

