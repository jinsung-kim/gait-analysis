import pandas as pd
import numpy as np

class CSV:

    def __init__(self, dir, file_path) -> None:
        self.dir = dir
        self.file_path = file_path

    def __str__(self):
        return "Dir: %s\nFile Path: %s" % (self.dir, self.file_path)

    # Used to get the feature
    def read_file_for(self, feature):
        df = pd.read_csv(self.file_path)

        res = df[feature].tolist()

        res.sort() # Sorts in ascending order

        return res