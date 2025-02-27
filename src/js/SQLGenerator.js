let csvData = [];

document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();

  if (file.type.includes("sheet") || file.type.includes("excel")) {
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      csvData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    };
    reader.readAsArrayBuffer(file);
  } else {
    reader.onload = function (event) {
      const text = event.target.result;
      csvData = text.split("\n").map((row) => row.split(","));
    };
    reader.readAsText(file);
  }
});

document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    const sqlTemplate = document.getElementById("sqlTemplate").value;
    const resultsArea = document.getElementById("results");

    if (!sqlTemplate || csvData.length === 0) {
      alert(
        "Please provide a valid SQL template and upload a CSV or Excel file."
      );
      return;
    }

    // Array to store SQL statements and IDs
    const sqlStatements = [];
    const id_no = []; // To store unique IDs for filenames

    csvData.forEach((row) => {
      let sqlStatement = sqlTemplate;

      // Replace #ColX placeholders with corresponding row values
      const regex = /#Col(\d+)/g;
      sqlStatement = sqlStatement.replace(regex, (match, colNum) => {
        const index = parseInt(colNum) - 1; // Convert to 0-based index
        return row[index] !== undefined ? row[index] : match; // Replace or keep placeholder
      });

      sqlStatements.push(sqlStatement);

      // Assuming the second column (index 1) is used for IDs
      if (row[1]) {
        id_no.push(row[1]);
      }
    });

    // Display SQL statements in the results textarea
    resultsArea.value = sqlStatements.join("\n");

    // Create a zip file with individual files for each SQL statement
    const zip = new JSZip();

    sqlStatements.forEach((statement, index) => {
      const id = id_no[index] || `file_${index + 1}`; // Fallback to "file_X" if no ID
      zip.file(`${index}NewInsert_${id}.txt`, statement);
    });

    // Generate the zip file and trigger the download
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "sql_statements.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
