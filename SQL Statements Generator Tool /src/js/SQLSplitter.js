document.getElementById("generateSQL").addEventListener("click", () => {
  const fileInput = document.getElementById("excelInput");
  const queryInput = document.getElementById("queryInput").value.trim();
  const limit = parseInt(
    document.getElementById("limitInput").value.trim(),
    10
  );
  const outputButtons = document.getElementById("outputButtons");

  if (!fileInput.files[0]) {
    alert("Please upload an Excel file.");
    return;
  }
  if (!queryInput) {
    alert("Please enter an SQL query.");
    return;
  }
  if (!limit || limit <= 0) {
    alert("Please enter a valid limit.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Remove header row if present
    // jsonData.shift();

    if (jsonData.length === 0) {
      alert("The uploaded Excel file is empty or invalid.");
      return;
    }

    // Clear previous SQL queries
    outputButtons.innerHTML = "";

    // Generate SQL queries
    let currentBatch = [];
    let queries = [];

    jsonData.forEach((row, index) => {
      currentBatch.push(row);
      if (currentBatch.length === limit || index === jsonData.length - 1) {
        let sql = queryInput;
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          const colPlaceholder = `#Col${colIndex + 1}`;
          const colValues = currentBatch.map((r) => r[colIndex]).join(",");
          sql = sql.replace(colPlaceholder, colValues);
        }
        sql = sql.replace(/,\)/g, ")"); // Remove trailing commas before closing parenthesis
        queries.push(sql);
        currentBatch = [];
      }
    });

    // Create buttons to copy queries
    queries.forEach((query, i) => {
      const button = document.createElement("button");
      button.textContent = `Part ${i + 1}`;
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(query).then(() => {
          // Change button color to green after copy
          button.classList.add("copied");
          // alert(`Copied: Part ${i + 1}`);
        });
      });
      outputButtons.appendChild(button);
    });
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
});
