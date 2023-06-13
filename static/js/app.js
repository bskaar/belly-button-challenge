// Fetch the data from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(jsonData => {
    // Extract the necessary data
    const samples = jsonData.samples;
    const metadata = jsonData.metadata;

    // Populate the dropdown menu
    const dropdown = d3.select("#selDataset");

    samples.forEach(sample => {
      dropdown.append("option").text(sample.id).property("value", sample.id);
    });

    // Update the charts and demographic info based on the selected sample
    const optionChanged = (sampleId) => {
      // Find the selected sample
      const selectedSample = samples.find(sample => sample.id === sampleId);
      const selectedMetadata = metadata.find(sample => sample.id.toString() === sampleId);

      // Extract the necessary data for the charts
      const otuIds = selectedSample.otu_ids.slice(0, 10).reverse();
      const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
      const otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

      // Create the horizontal bar chart
      const barTrace = {
        x: sampleValues,
        y: otuIds.map(id => `OTU ${id}`),
        text: otuLabels,
        type: "bar",
        orientation: "h"
      };

      const barData = [barTrace];

      const barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };

      Plotly.newPlot("bar", barData, barLayout);

      // Create the bubble chart
      const bubbleTrace = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: "markers",
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids,
        },
      };

      const bubbleData = [bubbleTrace];

      const bubbleLayout = {
        title: "OTU IDs vs Sample Values",
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" },
      };

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

      // Display sample metadata
      const panelBody = d3.select("#sample-metadata");

      // Clear existing metadata
      panelBody.html("");

      // Display each key-value pair from the metadata JSON object
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        panelBody.append("p").text(`${key}: ${value}`);
      });
    };

    // Handle the dropdown change event
    dropdown.on("change", function() {
      const selectedSampleId = d3.event.target.value;
      optionChanged(selectedSampleId);
    });

    // Initialize with the first sample
    const initialSample = samples[0].id;
    optionChanged(initialSample);
  })
  .catch(error => console.log(error));