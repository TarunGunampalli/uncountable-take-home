import { useState } from "react";
import "./App.css";
import { useDataset } from "./dataset";

function useFilters() {
	const { inputs, outputs } = useDataset();
	// set of indices that don't follow the filter bounds
	const [filteredIndices, setFilteredIndices] = useState(new Set());

	function filter(inputBounds, outputBounds) {
		// bounds are objects of objects with {key: {lowerBound, upperBound}}
		function getIndicesToFilter(bounds, data) {
			const indicesToFilter = new Set();
			Object.keys(bounds).forEach((key) => {
				const { lowerBound, upperBound } = bounds[key];
				const val = data[key];
				val.forEach((v, i) => {
					if (v < lowerBound || v > upperBound) indicesToFilter.add(i);
				});
			});
			return indicesToFilter;
		}

		const indicesToFilter = getIndicesToFilter(inputBounds, inputs).union(getIndicesToFilter(outputBounds, outputs));
		setFilteredIndices(indicesToFilter);
	}

	const filteredInputs = Object.assign({}, inputs);
	const filteredOutputs = Object.assign({}, outputs);

	// filter out each value based on filteredIndices
	Object.keys(filteredInputs).forEach((key) => (filteredInputs[key] = filteredInputs[key].filter((v, i) => !filteredIndices.has(i))));
	Object.keys(filteredOutputs).forEach((key) => (filteredOutputs[key] = filteredOutputs[key].filter((v, i) => !filteredIndices.has(i))));

	return { filter, filteredIndices, setFilteredIndices, filteredInputs, filteredOutputs };
}

export { useFilters };
