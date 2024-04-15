import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Button, IconButton, Slider, Snackbar, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./App.css";
import { useFilters } from "./Filters";
import Graph from "./Graph";
import { INPUT_COLORS, OUTPUT_COLORS } from "./constants";
import { useDataset } from "./dataset";

function App() {
	const [inputBounds, setInputBounds] = useState({});
	const [outputBounds, setOutputBounds] = useState({});
	const [showAllInputs, setShowAllInputs] = useState(true);
	const [openToast, setOpenToast] = useState(false);
	const { inputs, outputs } = useDataset();
	const { filter, filteredIndices, setFilteredIndices, filteredInputs, filteredOutputs } = useFilters();

	useEffect(() => filter(inputBounds, outputBounds), [inputBounds, outputBounds]);

	function handleLock(key, value, bounds, setBounds) {
		if (key in bounds) {
			setBounds((prev) => {
				const newBounds = { ...prev };
				delete newBounds[key];
				return newBounds;
			});
		} else {
			// prevent locking all bounds, since that won't provide any real information
			const numLocked = inputBounds.length + outputBounds.length;
			if (numLocked === inputs.length + outputs.length - 1) return;

			setBounds((prev) => ({ ...prev, [key]: { lowerBound: value[0], upperBound: value[1] } }));
		}
	}

	function getSliders(useInputs) {
		const COLORS = useInputs ? INPUT_COLORS : OUTPUT_COLORS;
		const data = useInputs ? inputs : outputs;
		const bounds = useInputs ? inputBounds : outputBounds;
		const setBounds = useInputs ? setInputBounds : setOutputBounds;
		const filtered = useInputs ? filteredInputs : filteredOutputs;
		const showAll = !useInputs || showAllInputs;

		function onChange(e, v) {
			const { name: key } = e.target;
			setBounds((prev) => ({ ...prev, [key]: { lowerBound: v[0], upperBound: v[1] } }));
		}
		return Object.keys(data).map((key, i) => {
			if (!showAll && !(key in bounds)) return null;
			const val = data[key];
			const lowerBound = Math.min(...val);
			const upperBound = Math.max(...val);
			let curValue = [lowerBound, upperBound];
			if (key in bounds) {
				curValue = [bounds[key].lowerBound, bounds[key].upperBound];
			} else {
				const filteredVals = filtered[key];
				curValue = [Math.min(...filteredVals), Math.max(...filteredVals)];
			}
			return (
				<div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px" }} key={key}>
					<div style={{ width: "30%" }}>{key}</div>
					<IconButton onClick={() => handleLock(key, curValue, bounds, setBounds)}>{key in bounds ? <LockIcon /> : <LockOpenIcon />}</IconButton>
					<div style={{ display: "flex", justifyContent: "center", width: "60%" }}>
						<div style={{ width: "80%" }}>
							<Slider
								value={curValue}
								onChange={onChange}
								min={lowerBound}
								max={upperBound}
								style={{ color: COLORS[i] }}
								name={key}
								step={(upperBound - lowerBound) / 100}
								marks={data[key].map((d) => ({ value: d }))}
								valueLabelFormat={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 2 })}
								valueLabelDisplay="on"
							/>
						</div>
					</div>
				</div>
			);
		});
	}

	function handleHide() {
		if (showAllInputs) {
			if (Object.keys(inputBounds).length > 0) {
				setShowAllInputs(false);
			} else {
				setOpenToast(true);
			}
		} else {
			setShowAllInputs(true);
		}
	}

	return (
		<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "stretch" }}>
			<div style={{ display: "flex", flexDirection: "column", width: "40%" }}>
				<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
					<div style={{ display: "flex", justifyContent: "center", width: "30%" }}>
						<h2>Inputs</h2>
					</div>
					<div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
						<Tooltip title="Reset Filters" arrow>
							<IconButton onClick={() => setInputBounds({})}>{Object.keys(inputBounds).length > 0 ? <LockIcon /> : <LockOpenIcon />}</IconButton>
						</Tooltip>
					</div>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "60%" }}>
						<Button onClick={handleHide} size="small" style={{ width: "fit-content" }}>
							{showAllInputs ? "Hide Nonfiltering Inputs" : "Show All Inputs"}
						</Button>
					</div>
				</div>
				{getSliders(true)}
			</div>
			<div style={{ display: "flex", flexDirection: "column", width: "40%", justifyContent: "space-between" }}>
				<div>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<h2>Outputs</h2>
					</div>
					{getSliders(false)}
				</div>
				<div
					style={{
						width: "100%",
						minHeight: "300px",
						height: "30vw",
						maxHeight: "600px",
						paddingTop: "20px",
					}}
				>
					<Graph filteredIndices={filteredIndices} setFilteredIndices={setFilteredIndices} />
				</div>
			</div>
			<Snackbar open={openToast} autoHideDuration={3000} onClose={() => setOpenToast(false)} message="Apply some filters before hiding!" />
		</div>
	);
}

export default App;
