import "./App.css";
import "./dataset.js";
import { useDataset } from "./dataset.js";
import { useFilters } from "./Filters.js";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import { OUTPUT_COLORS } from "./constants.js";
import { useState } from "react";
import { Checkbox } from "@mui/material";

function Graph({ filteredIndices, setFilteredIndices }) {
	const { outputGraphData } = useDataset();
	const [selectedOutputs, setSelectedOutputs] = useState([0, 1]);

	const dataKeys = Object.keys(outputGraphData[0]).filter((key) => key !== "name");
	const filteredGraphData = outputGraphData.filter((v, i) => !filteredIndices.has(i));
	const payload = dataKeys.map((key, i) => ({ value: key, id: i, color: OUTPUT_COLORS[i] }));

	const yLeft = selectedOutputs[0];
	const yRight = selectedOutputs[1];
	const keyLeft = dataKeys[yLeft];
	const keyRight = dataKeys[yRight];

	function renderLegend({ payload }) {
		console.log(JSON.stringify(payload));
		function handleCheck(i) {
			const newSelectedOutputs = [...selectedOutputs];
			if (newSelectedOutputs.includes(i)) {
				newSelectedOutputs.splice(newSelectedOutputs.indexOf(i), 1);
			} else {
				if (newSelectedOutputs.length < 2) {
					newSelectedOutputs.push(i);
				} else {
					newSelectedOutputs[1] = i;
				}
			}
			setSelectedOutputs(newSelectedOutputs);
		}

		return (
			<div style={{ display: "flex", paddingTop: "6px" }}>
				<div style={{ width: "15%" }} />
				<div style={{ display: "flex", width: "100%" }}>
					{payload.map((entry, i) => {
						const { color, value } = entry;
						return (
							<div style={{ display: "flex", alignItems: "center", padding: "0 8px" }} key={value}>
								<Checkbox onClick={() => handleCheck(i)} checked={selectedOutputs.includes(i)} size="small" style={{ color }} />
								<div style={{ fontSize: "14px", marginLeft: "-4px", color }}>{value}</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	function formatTitle(keyLeft, keyRight) {
		if (keyLeft && keyRight) return `${keyLeft} and ${keyRight} across Experiments`;
		else if (keyLeft) return `${keyLeft} across Experiments`;
		else return "No Display Data Selected";
	}

	return (
		<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", alignItems: "center" }}>
			<div style={{ display: "flex", width: "fit-content" }}>{formatTitle(keyLeft, keyRight)}</div>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					width={500}
					height={300}
					data={filteredGraphData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" hide />
					<Tooltip />
					{/* <Legend content={renderLegend} /> */}
					<Legend payload={payload} content={renderLegend} />
					<YAxis label={{ value: keyLeft, angle: -90, position: "insideLeft" }} dataKey={keyLeft} key={yLeft} yAxisId="left" />
					<YAxis
						label={{ value: keyRight, angle: 90, position: "insideRight" }}
						dataKey={keyRight}
						key={yRight}
						yAxisId="right"
						orientation="right"
					/>
					<Bar dataKey={keyLeft} key={yLeft} yAxisId="left" fill={OUTPUT_COLORS[yLeft]} />
					<Bar dataKey={keyRight} key={yRight} yAxisId="right" fill={OUTPUT_COLORS[yRight]} />
					{/* {dataKeys.map((key, i) => (
					<Bar
						key={key}
						dataKey={key}
						fill={OUTPUT_COLORS[i]}
						// onClick={() => {
						// 	setFilteredIndices((prev) => prev.union(new Set([i])));
						// }}
					/>
				))} */}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default Graph;
