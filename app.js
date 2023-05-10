// Import required libraries
const irisDataset = require('ml-dataset-iris');
const LogisticRegression = require('ml-logistic-regression').default;

// Load the Iris dataset
const data = irisDataset.getNumbers();
const labels = irisDataset.getClasses().map((label) => irisDataset.getDistinctClasses().indexOf(label));

// Split the dataset into training and testing sets
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

// Create and train the Logistic Regression model
const model = new LogisticRegression({ numSteps: 1000, learningRate: 0.5 });
model.train(X_train, y_train);

// Make predictions on the testing set
const y_pred = model.predict(X_test);

// Calculate the accuracy and display the results
let correct = 0;
y_pred.forEach((pred, i) => {
  if (pred === y_test[i]) correct++;
});

const accuracy = (correct / y_test.length) * 100;
console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
