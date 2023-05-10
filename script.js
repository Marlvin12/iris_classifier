import React, { useEffect, useState } from 'react';
import irisDataset from 'ml-dataset-iris';
import LogisticRegression from 'ml-logistic-regression';
import Papa from 'papaparse';

const IrisClassifier = () => {
  const [accuracy, setAccuracy] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);

  useEffect(() => {
    if (uploadedData) {
      trainAndTestModel(uploadedData.data, uploadedData.labels);
    }
  }, [uploadedData]);

  const trainAndTestModel = async (data, labels) => {
    const testSize = 0.2;
    const indices = Array.from({ length: data.length }, (_, i) => i);
    const testIndices = [];
    const trainIndices = [];

    while (testIndices.length < data.length * testSize) {
      const index = Math.floor(Math.random() * indices.length);
      testIndices.push(...indices.splice(index, 1));
    }

    trainIndices.push(...indices);

    const X_train = trainIndices.map((i) => data[i]);
    const X_test = testIndices.map((i) => data[i]);
    const y_train = trainIndices.map((i) => labels[i]);
    const y_test = testIndices.map((i) => labels[i]);

    const model = new LogisticRegression({ numSteps: 1000, learningRate: 0.5 });
    model.train(X_train, y_train);

    const y_pred = model.predict(X_test);

    let correct = 0;
    y_pred.forEach((pred, i) => {
      if (pred === y_test[i]) correct++;
    });

    const accuracyResult = (correct / y_test.length) * 100;
    setAccuracy(accuracyResult.toFixed(2));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data.map((row) => [
            row.sepalLength,
            row.sepalWidth,
            row.petalLength,
            row.petalWidth,
          ]);
          const labels = results.data.map((row) => row.species);
          setUploadedData({ data, labels });
        },
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      {accuracy === null ? (
        <p>Upload a CSV file to train and test the model.</p>
      ) : (
        <p>Accuracy: {accuracy}%</p>
      )}
    </div>
  );
};

export default IrisClassifier;
