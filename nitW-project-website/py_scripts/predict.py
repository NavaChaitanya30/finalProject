import json
import sys
import joblib
import pandas as pd

# Get the input data as a JSON string
input_data = json.loads(sys.argv[1])

# Create a pandas DataFrame from the dictionary
data_df = pd.DataFrame([input_data])

# Define the path to the pretrained model
model_path = "/home/lenovo/ML/nitw_project/models/noProtocol/Bagging_9cols_CICIOT2023.pkl"

# Load the pretrained model
model = joblib.load(model_path)

# Get the wanted features
wanted_features = model.feature_names_in_

# Select only the wanted features from the DataFrame
data_for_prediction = data_df[wanted_features]

# Predict using the loaded model
result = model.predict(data_for_prediction)

print(result[0])
