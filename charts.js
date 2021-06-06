function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var results = samplesArray[0];
    console.log(data);
    //console.log(data);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
     var otuIds = results.otu_ids;
     var otuLabels = results.otu_labels;
     var sampleValues = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(x => `OTU ID ${x}`).reverse();
    //console.log(yticks);
    var xticks = sampleValues.slice(0,10).reverse();
    var text_labels = otuLabels.slice(0,10).reverse();
    
  // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: xticks,
      y: yticks,
      text: text_labels,
      type: "bar",
      orientation: 'h'

    };

    var barData = [trace1];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     
     //margin: {t: 30, l: 150}  
    };
    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot('bar', barData, barLayout)

// Bar and Bubble charts
// Create the buildCharts function.
// 1. Create the trace for the bubble chart.
    
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: text_labels,
      type: "bubble",
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds
        //colorscale: "Earth"
      },

    };
    
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: `closest`
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
 
    // 3. Create a variable that holds the washing frequency.
    // function buildMetadata(sample) {
    // d3.json("samples.json").then((data) => {
    //   var metadata = data.metadata;
    //   var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var wfreq = parseFloat(result.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0,1], y: [0,1] },
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        title: { text: "<h3> Belly Button Washing Frequency </h3><br><p> Scrubs per week </p>" },
        gauge: {
          axis: { rrange: [null, 10] },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "cyan" },
            { range: [2, 4], color: "olive"},
            { range: [4, 6], color: "plum"},
            { range: [6, 8], color: "pink" },
            { range: [8, 10], color: "darkmagenta"}
          ],
        },
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0} };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
   
  });
    };