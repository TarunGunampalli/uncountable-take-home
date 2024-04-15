import dataset from "./assets/dataset.json";

/**
 * Ideas
 * graph multibar graph with experiments on x axis, outputs on y axis
 * select input as x axis, output as y axis, plot 2d graph and get LOBF (other types of regression?)
 *      drag and drop inputs/outputs onto potential graphs?
 * filter outputs by values and show corresponding input values that produce them
 *      sliders with locks to prevent input filters from changing
 * include date filter for all graphs
 */

function useDataset() {
	const dataList = Object.values(dataset);

	// initialize inputs object with empty lists
	const inputs = {};
	Object.keys(dataList[0].inputs).forEach((key) => (inputs[key] = []));
	// populate lists with data from all experiments
	dataList.forEach((data) =>
		Object.keys(data.inputs).forEach((key) => {
			inputs[key].push(data.inputs[key]);
		})
	);

	// repeat for outputs
	const outputs = {};
	Object.keys(dataList[0].outputs).forEach((key) => (outputs[key] = []));

	dataList.forEach((data) =>
		Object.keys(data.outputs).forEach((key) => {
			outputs[key].push(data.outputs[key]);
		})
	);

	const inputGraphData = Object.keys(dataset).map((key) => ({ ...dataset[key].inputs, name: key }));
	const outputGraphData = Object.keys(dataset).map((key) => ({ ...dataset[key].outputs, name: key }));

	return { inputs, outputs, inputGraphData, outputGraphData };
}

export { useDataset };
