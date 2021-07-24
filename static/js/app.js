// Use the D3 library to read in samples.json
d3.json("data/samples.json").then((rawData) => {

	console.log(rawData);

	var data = rawData;

	var names = data.names;

	names.forEach((name) => {
		d3.select("#selDataset").append("option").text(name);
	})

	// Set homepage to run a base data so page is not empty
	function base() {

		// Set base data to be number 940 per prompt screenshot
		defaultDataset = data.samples.filter(sample => sample.id === "940")[0];
		console.log(defaultDataset);

		// Select data for respective ID
		allSampleValuesDefault = defaultDataset.sample_values;
		allOtuIdsDefault = defaultDataset.otu_ids;
		allOtuLabelsDefault = defaultDataset.otu_labels;

		// Select top 10 OTUs
		sampleValuesDefault = allSampleValuesDefault.slice(0, 10).reverse();
		otuIdsDefault = allOtuIdsDefault.slice(0, 10).reverse();
		otuLabelsDefault = allOtuLabelsDefault.slice(0, 10).reverse();

		console.log(sampleValuesDefault);
		console.log(otuIdsDefault);
		console.log(otuLabelsDefault);

        // Bar chart
		var trace1 = {
			x: sampleValuesDefault,
			y: otuIdsDefault.map(outId => `OTU ${outId}`),
			text: otuLabelsDefault,
			type: "bar",
			orientation: "h"
		};

		var barData = [trace1];

		var barlayout = {
			autosize: false,
			width: 450,
			height: 600
		}

		Plotly.newPlot("bar", barData, barlayout);

		// Bubble chart
		var trace2 = {
			x: allOtuIdsDefault,
			y: allSampleValuesDefault,
			text: allOtuLabelsDefault,
			mode: 'markers',
			marker: {
				color: allOtuIdsDefault,
				size: allSampleValuesDefault
			}
		};
		
		var bubbleData = [trace2];
		
		var bubbleLayout = {
			xaxis: { title: "OTU ID"},
			showlegend: false,
		};
		
		Plotly.newPlot('bubble', bubbleData, bubbleLayout);

		// Demographic Info
		demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(demoDefault);

		Object.entries(demoDefault).forEach(
			([key, value]) => d3.select("#sample-metadata")
													.append("p").text(`${key.toUpperCase()}: ${value}`));
	}

	base();


	// Select change for new dropdown selection
	d3.selectAll("#selDataset").on("change", updatePlot);

	function updatePlot() {

		// Use D3 to select dropdown menu
        var selection = d3.select("#selDataset");
        var input = selection.property("value");
        console.log(input);

		// Filter data to dropdown menu
        dataset = data.samples.filter(sample => sample.id === input)[0];
        console.log(dataset);

		// Select data for respective ID
        allSampleValues = dataset.sample_values;
        allOtuIds = dataset.otu_ids;
        allOtuLabels = dataset.otu_labels;

		// Select top 10 OTUs
		top10values = allSampleValues.slice(0, 10).reverse();
		top10ids = allOtuIds.slice(0, 10).reverse();
		top10labels = allOtuLabels.slice(0, 10).reverse();

		// Bar chart
		Plotly.restyle("bar", "x", [top10values]);
		Plotly.restyle("bar", "y", [top10ids.map(outId => `OTU ${outId}`)]);
		Plotly.restyle("bar", "text", [top10labels]);

		// Bubble chart
		Plotly.restyle('bubble', "x", [allOtuIds]);
		Plotly.restyle('bubble', "y", [allSampleValues]);
		Plotly.restyle('bubble', "text", [allOtuLabels]);
		Plotly.restyle('bubble', "marker.color", [allOtuIds]);
		Plotly.restyle('bubble', "marker.size", [allSampleValues]);

		// Demographic Info
		metainfo = data.metadata.filter(sample => sample.id == input)[0];

		d3.select("#sample-metadata").html("");

		Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));
	}
});