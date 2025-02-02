let csvData = [];
let modifiedCsvData = [];

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const text = event.target.result;
    csvData = text.split("\n").map((row) => row.split(","));
    modifiedCsvData = csvData.map((row) => [...row]); // Clone the original data for modification
  };

  reader.readAsText(file);
});

document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    const sqlTemplate = document.getElementById("sqlTemplate").value;
    const resultsArea = document.getElementById("results");

    if (!sqlTemplate || csvData.length === 0) {
      alert("Please provide a valid SQL template and upload a CSV file.");
      return;
    }

    const sqlStatements = csvData.map((row) => {
      let sqlStatement = sqlTemplate;

      // Replace #ColX with the value from the corresponding column
      const regex = /#Col(\d+)/g;
      sqlStatement = sqlStatement.replace(regex, (match, colNum) => {
        const index = parseInt(colNum) - 1; // Convert to 0-based index
        return row[index] !== undefined ? row[index] : match; // Return value or original placeholder
      });

      return sqlStatement;
    });

    // Add the SQL statements to the first empty column in the modified CSV data
    modifiedCsvData = modifiedCsvData.map((row, index) => {
      // Find the first empty column (if any)
      const firstEmptyColumn =
        row.findIndex((cell) => cell === "") !== -1
          ? row.findIndex((cell) => cell === "")
          : row.length; // If no empty cell, append at the end

      row[firstEmptyColumn] = sqlStatements[index]; // Add SQL statement to the first empty column
      return row;
    });

    resultsArea.value = sqlStatements.join("\n");
    document.getElementById("downloadButton").style.display = "block"; // Show download button
  });

document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    const csvContent = modifiedCsvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modified.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
